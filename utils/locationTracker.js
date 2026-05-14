/**
 * locationTracker.js
 * GPS 轨迹追踪核心模块（纯逻辑单例）
 *
 * 职责：GPS 监听、点位采集策略、缓冲区管理、批量上传
 * 从 stores/location.js 的 locationConfig 动态读取配置
 */

import { UploadTrackPoint } from '@/api/index.js'
import { useLocationStore } from '@/stores/location.js'
import dayjs from 'dayjs'

// ==================== 常量 ====================
const TAG = '[locationTracker]'
const MAX_ACCURACY = 200 // 精度 > 200m 的数据丢弃

// ==================== 工具函数 ====================

/**
 * Haversine 公式计算两点距离（米）
 */
function getDistance(p1, p2) {
	const R = 6371000
	const toRad = (deg) => deg * Math.PI / 180
	const dLat = toRad(p2.latitude - p1.latitude)
	const dLng = toRad(p2.longitude - p1.longitude)
	const a = Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(p1.latitude)) * Math.cos(toRad(p2.latitude)) * Math.sin(dLng / 2) ** 2
	return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * 方位角计算（0~360，正北为 0，顺时针）
 */
function calcBearing(lat1, lng1, lat2, lng2) {
	const toRad = (deg) => deg * Math.PI / 180
	const toDeg = (rad) => rad * 180 / Math.PI
	const dLng = toRad(lng2 - lng1)
	const y = Math.sin(dLng) * Math.cos(toRad(lat2))
	const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
		Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng)
	return (toDeg(Math.atan2(y, x)) + 360) % 360
}

/**
 * 从 locationStore 获取最新配置
 */
function getConfig() {
	const store = useLocationStore()
	return store.locationConfig
}

// ==================== 单例对象 ====================

const locationTracker = {
	// --- 运行状态 ---
	_running: false,
	_appState: 'foreground', // 'foreground' | 'background'
	_gpsActive: false,

	// --- 采集状态 ---
	_lastPos: null,
	_lastBearing: 0,

	// --- 缓冲区 ---
	_buffer: [],

	// --- 定时器 ---
	_intervalTimer: null,  // TimeoutInterval 定时器（T秒强制记录）
	_thresholdTimer: null, // TimeoutThreshold 定时器（W秒强制上传）
	_lastUploadTime: 0,    // 上次上传时间戳

	// --- 前后台回调引用 ---
	_onAppHideFn: null,
	_onAppShowFn: null,

	// --- locationChange 回调引用 ---
	_onLocationChangeFn: null,
	_onLocationChangeErrorFn: null,

	// ==================== 公共 API ====================

	/**
	 * 是否正在运行
	 */
	get isRunning() {
		return this._running
	},

	/**
	 * 当前缓冲区点位数
	 */
	get bufferSize() {
		return this._buffer.length
	},

	/**
	 * 当前方位角（0~360，正北为 0，顺时针）
	 * 未计算过时为 0
	 */
	get currentBearing() {
		return this._lastBearing
	},

	/**
	 * 启动追踪（自动从 store 读配置）
	 */
	start() {
		if (this._running) {
			console.log(TAG, '已在运行，跳过')
			return
		}

		const config = getConfig()

		// 边界检查：LocationSwitch 为 C 或 D 不启动
		if (config.LocationSwitch === 'C' || config.LocationSwitch === 'D') {
			console.log(TAG, 'LocationSwitch 为', config.LocationSwitch, '，不需要定位，不启动')
			return
		}

		// 边界检查：OnwayList 为空不启动
		if (!config.OnwayList || config.OnwayList.length === 0) {
			console.log(TAG, 'OnwayList 为空，不启动')
			return
		}

		console.log(TAG, '启动追踪', JSON.stringify({
			DistanceTriggerStep: config.DistanceTriggerStep,
			TimeoutInterval: config.TimeoutInterval,
			BatchSendCount: config.BatchSendCount,
			TimeoutThreshold: config.TimeoutThreshold,
			OnwayCount: config.OnwayList.length,
			LocationSwitch: config.LocationSwitch,
		}))

		this._running = true
		this._buffer = []
		this._resetState()
		this._registerCallbacks()
		this._startGps()
		this._startIntervalTimer()
		this._startThresholdTimer()
	},

	/**
	 * 停止追踪（上传剩余缓冲）
	 */
	stop() {
		if (!this._running) {
			console.log(TAG, '未在运行，跳过')
			return
		}

		console.log(TAG, '停止追踪，缓冲区剩余', this._buffer.length, '个点')

		this._running = false
		this._stopGps()
		this._clearAllTimers()
		this._unregisterCallbacks()
		this._resetState()

		// 上传剩余缓冲
		if (this._buffer.length > 0) {
			this._doUpload()
		}
	},

	// ==================== 内部方法 ====================

	/**
	 * 重置内部状态
	 */
	_resetState() {
		this._appState = 'foreground'
		this._gpsActive = false
		this._lastPos = null
		this._lastBearing = 0
		this._lastUploadTime = 0
		// 注意：不清空 _buffer，stop() 时可能需要上传剩余数据
	},

	/**
	 * 注册前后台切换回调
	 */
	_registerCallbacks() {
		const self = this

		this._onLocationChangeFn = function(res) {
			self._onLocationChange(res)
		}

		this._onLocationChangeErrorFn = function(err) {
			self._onLocationChangeError(err)
		}

		this._onAppHideFn = function() {
			self._onAppHide()
		}

		this._onAppShowFn = function() {
			self._onAppShow()
		}

		wx.onLocationChange(this._onLocationChangeFn)
		wx.onLocationChangeError(this._onLocationChangeErrorFn)
		wx.onAppHide(this._onAppHideFn)
		wx.onAppShow(this._onAppShowFn)
	},

	/**
	 * 注销前后台切换回调
	 */
	_unregisterCallbacks() {
		if (this._onLocationChangeFn) {
			wx.offLocationChange(this._onLocationChangeFn)
		}
		if (this._onLocationChangeErrorFn) {
			wx.offLocationChangeError(this._onLocationChangeErrorFn)
		}
		if (this._onAppHideFn) {
			wx.offAppHide(this._onAppHideFn)
		}
		if (this._onAppShowFn) {
			wx.offAppShow(this._onAppShowFn)
		}
		this._onLocationChangeFn = null
		this._onLocationChangeErrorFn = null
		this._onAppHideFn = null
		this._onAppShowFn = null
	},

	/**
	 * 启动 GPS 定位
	 */
	_startGps() {
		if (this._gpsActive) return

		const self = this

		if (this._appState === 'background') {
			console.log(TAG, '启动后台定位')
			wx.startLocationUpdateBackground({
				isHighAccuracy: true,
				highAccuracyExpireTime: 3000,
				success() {
					self._gpsActive = true
					console.log(TAG, 'startLocationUpdateBackground 成功')
				},
				fail(err) {
					console.error(TAG, 'startLocationUpdateBackground 失败', JSON.stringify(err))
					self._gpsActive = false
				},
			})
		} else {
			console.log(TAG, '启动前台定位')
			wx.startLocationUpdate({
				isHighAccuracy: true,
				highAccuracyExpireTime: 3000,
				success() {
					self._gpsActive = true
					console.log(TAG, 'startLocationUpdate 成功')
				},
				fail(err) {
					console.error(TAG, 'startLocationUpdate 失败', JSON.stringify(err))
					self._gpsActive = false
				},
			})
		}
	},

	/**
	 * 停止 GPS 定位
	 */
	_stopGps() {
		if (!this._gpsActive) return
		wx.stopLocationUpdate()
		this._gpsActive = false
		console.log(TAG, '停止定位')
	},

	/**
	 * 前后台切换 — 切到后台
	 */
	_onAppHide() {
		if (!this._running) return
		console.log(TAG, '切到后台')

		this._appState = 'background'
		// 停掉前台定位，重新以后台 API 启动
		this._stopGps()
		this._startGps()
	},

	/**
	 * 前后台切换 — 切回前台
	 */
	_onAppShow() {
		if (!this._running) return
		console.log(TAG, '切回前台')

		this._appState = 'foreground'
		// 停掉后台定位，重新以前台 API 启动
		this._stopGps()
		this._startGps()
	},

	/**
	 * 定位错误回调 — 权限被收回时自动停止
	 */
	_onLocationChangeError(err) {
		console.error(TAG, '定位错误', JSON.stringify(err))
		if (err.errCode === 11) {
			console.log(TAG, '定位权限已关闭，自动停止追踪')
			this.stop()
			const store = useLocationStore()
			store.userLocation = false
			store.userLocationBackground = false
		}
	},

	/**
	 * GPS 回调 — 采集点位核心逻辑
	 */
	_onLocationChange(res) {
		if (!this._running) return

		// 精度过滤
		if (res.accuracy > MAX_ACCURACY) {
			console.log(TAG, '精度', res.accuracy.toFixed(1), 'm >', MAX_ACCURACY, 'm，丢弃')
			return
		}

		const config = getConfig()
		const distanceStep = Number(config.DistanceTriggerStep) || 0

		// 计算距离
		let distance = 0
		if (this._lastPos) {
			distance = getDistance(this._lastPos, res)
		}

		// 判断是否需要记录此点
		const movedEnough = distance >= distanceStep

		if (movedEnough || !this._lastPos) {
			// 满足距离阈值，或首次定位 → 记录点位
			let bearing = this._lastBearing
			if (this._lastPos) {
				bearing = calcBearing(
					this._lastPos.latitude, this._lastPos.longitude,
					res.latitude, res.longitude
				)
				this._lastBearing = bearing
			}

			// 构建点位数据
			const point = {
				location: res.longitude + ',' + res.latitude,
				locatetime: Date.now(),
				speed: res.speed != null ? Number((res.speed * 3.6).toFixed(3)) : 0,
				direction: Number(bearing.toFixed(4)),
				height: res.altitude != null ? Number(res.altitude.toFixed(3)) : 0,
				accuracy: res.accuracy != null ? Number(res.accuracy.toFixed(3)) : 0,
			}

			this._buffer.push(point)
			this._lastPos = { latitude: res.latitude, longitude: res.longitude }

			console.log(TAG, '记录点位', JSON.stringify({
				time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
				location: point.location,
				speed: point.speed,
				height: point.height,
				distance: distance.toFixed(1) + 'm',
				bearing: bearing.toFixed(1) + '°',
				bufferSize: this._buffer.length,
			}))

			// 记录点位后，重置 IntervalTimer（T秒超时）
			this._restartIntervalTimer()

			// 检查是否达到批量上传数量
			const batchCount = Number(config.BatchSendCount) || 0
			if (batchCount > 0 && this._buffer.length >= batchCount) {
				this._doUpload()
			}
		} else {
			// 未移动足够距离，不记录，仅更新 lastPos 避免方向角跳变
			// 不重置定时器，让 IntervalTimer 超时后强制记录
		}
	},

	// ==================== 定时器管理 ====================

	/**
	 * 启动 TimeoutInterval 定时器（T秒后强制记录一个点）
	 */
	_startIntervalTimer() {
		this._clearIntervalTimer()

		const config = getConfig()
		const intervalSeconds = Number(config.TimeoutInterval) || 0
		if (intervalSeconds <= 0) return

		const self = this
		this._intervalTimer = setTimeout(function() {
			if (!self._running) return
			console.log(TAG, 'TimeoutInterval 超时', intervalSeconds, '秒，强制记录一个点')
			self._forceRecordPoint()
		}, intervalSeconds * 1000)
	},

	/**
	 * 重启 TimeoutInterval 定时器（每次成功记录点位后调用）
	 */
	_restartIntervalTimer() {
		this._startIntervalTimer()
	},

	/**
	 * 启动 TimeoutThreshold 定时器（W秒后强制上传缓冲区）
	 */
	_startThresholdTimer() {
		this._clearThresholdTimer()

		const config = getConfig()
		const thresholdSeconds = Number(config.TimeoutThreshold) || 0
		if (thresholdSeconds <= 0) return

		const self = this
		this._thresholdTimer = setTimeout(function() {
			if (!self._running) return
			console.log(TAG, 'TimeoutThreshold 超时', thresholdSeconds, '秒，强制上传')
			if (self._buffer.length > 0) {
				self._doUpload()
			}
		}, thresholdSeconds * 1000)
	},

	/**
	 * 重启 TimeoutThreshold 定时器（上传成功后调用）
	 */
	_restartThresholdTimer() {
		this._clearThresholdTimer()

		const config = getConfig()
		const thresholdSeconds = Number(config.TimeoutThreshold) || 0
		if (thresholdSeconds <= 0) return

		const self = this
		this._thresholdTimer = setTimeout(function() {
			if (!self._running) return
			console.log(TAG, 'TimeoutThreshold 超时', thresholdSeconds, '秒，强制上传')
			if (self._buffer.length > 0) {
				self._doUpload()
			}
		}, thresholdSeconds * 1000)
	},

	/**
	 * 强制记录当前 GPS 位置（超时触发）
	 * 如果 GPS 有最新回调的数据（_lastPos），用其构造点位；
	 * 否则尝试获取一次位置后记录。
	 */
	_forceRecordPoint() {
		// 使用当前缓存的最后位置强制生成一个点位
		// 注意：这里没有新的 res，只能用 lastPos 和默认值
		if (!this._lastPos) {
			console.log(TAG, '无上次位置信息，无法强制记录')
			return
		}

		const point = {
			location: this._lastPos.longitude + ',' + this._lastPos.latitude,
			locatetime: Date.now(),
			speed: 0,
			direction: Number(this._lastBearing.toFixed(4)),
			height: 0,
			accuracy: 0,
		}

		this._buffer.push(point)

		console.log(TAG, '强制记录点位', JSON.stringify({
			bufferSize: this._buffer.length,
		}))

		// 重置定时器
		this._restartIntervalTimer()

		// 检查是否需要上传
		const config = getConfig()
		const batchCount = Number(config.BatchSendCount) || 0
		if (batchCount > 0 && this._buffer.length >= batchCount) {
			this._doUpload()
		}
	},

	/**
	 * 清除 IntervalTimer
	 */
	_clearIntervalTimer() {
		if (this._intervalTimer) {
			clearTimeout(this._intervalTimer)
			this._intervalTimer = null
		}
	},

	/**
	 * 清除 ThresholdTimer
	 */
	_clearThresholdTimer() {
		if (this._thresholdTimer) {
			clearTimeout(this._thresholdTimer)
			this._thresholdTimer = null
		}
	},

	/**
	 * 清除所有定时器
	 */
	_clearAllTimers() {
		this._clearIntervalTimer()
		this._clearThresholdTimer()
	},

	// ==================== 上传逻辑 ====================

	/**
	 * 执行上传
	 */
	async _doUpload() {
		if (this._buffer.length === 0) return

		// 上传前刷新配置，获取最新 OnwayList
		const store = useLocationStore()
		await store.refreshLocationConfig()

		const config = getConfig()
		const onwayList = config.OnwayList || []

		// OnwayList 为空，停止追踪
		if (onwayList.length === 0) {
			console.log(TAG, 'OnwayList 为空，停止追踪')
			this.stop()
			return
		}

		// 从 buffer 取出待上传的点位
		const points = this._buffer.splice(0)

		// 构建 onways 数组
		// OnwayList 的字段名是 Id, SupplyId, OnwayCode
		// onways 需要的是 OnwayId, SupplyId, OnwayCode
		const onways = onwayList.map(function(item) {
			return {
				OnwayId: item.Id,
				SupplyId: item.SupplyId,
				OnwayCode: item.OnwayCode,
			}
		})

		const data = {
			points: points,
			onways: onways,
		}

		console.log(TAG, '上传', points.length, '个点位')

		const self = this
		UploadTrackPoint(data).then(function() {
			self._lastUploadTime = Date.now()
			console.log(TAG, '上传成功', points.length, '个点位')
			self._restartThresholdTimer()
		}).catch(function(err) {
			// 上传失败：把点位放回缓冲区头部，停止追踪
			self._buffer = points.concat(self._buffer)
			console.error(TAG, '上传失败，缓冲区回滚', points.length, '个点位', JSON.stringify(err))
			self.stop()
		})
	},
}

export { locationTracker }

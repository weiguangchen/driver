<template>
	<view class="container">
		<!-- 模式切换 -->
		<view class="mode-switch">
			<view class="mode-btn" :class="{ active: mode === 'continuous' }" @click="switchMode('continuous')">
				持续监听
			</view>
			<view class="mode-btn" :class="{ active: mode === 'startstop' }" @click="switchMode('startstop')">
				启停策略
			</view>
		</view>

		<!-- 状态栏 -->
		<view class="status-bar">
			<view class="status-item">
				<text class="label">定位状态</text>
				<text :class="['value', updateActive ? 'active' : 'inactive']">
					{{ updateActive ? '监听中' : (mode === 'startstop' ? '等待中' : '关闭') }}
				</text>
			</view>
			<view class="status-item">
				<text class="label">运动状态</text>
				<text :class="['value', !isStationary ? 'active' : '']">
					{{ isStationary ? '静止' : '运动中' }}
				</text>
			</view>
			<view class="status-item">
				<text class="label">前后台</text>
				<text :class="['value', appState === 'foreground' ? 'active' : 'inactive']">
					{{ appState === 'foreground' ? '前台' : '后台' }}
				</text>
			</view>
		</view>

		<!-- 实时数据 -->
		<view class="realtime-panel">
			<view class="panel-title">实时数据</view>
			<view class="data-row">
				<text class="label">经度</text>
				<text class="value">{{ latestData.longitude }}</text>
			</view>
			<view class="data-row">
				<text class="label">纬度</text>
				<text class="value">{{ latestData.latitude }}</text>
			</view>
			<view class="data-row">
				<text class="label">速度(speed)</text>
				<text class="value">{{ latestData.speed }} m/s ({{ computedSpeed }} km/h)</text>
			</view>
			<view class="data-row">
				<text class="label">计算速度</text>
				<text class="value">{{ calcSpeedDisplay }} km/h</text>
			</view>
			<view class="data-row">
				<text class="label">精度(accuracy)</text>
				<text class="value">{{ latestData.accuracy }}m</text>
			</view>
			<view class="data-row">
				<text class="label">方向(bearing)</text>
				<text class="value">{{ bearingDisplay }}</text>
			</view>
			<view class="data-row">
				<text class="label">距上次距离</text>
				<text class="value">{{ distanceDisplay }}</text>
			</view>
			<view class="data-row">
				<text class="label">连续静止次数</text>
				<text class="value">{{ stationaryCount }}</text>
			</view>
			<view class="data-row">
				<text class="label">海拔(altitude)</text>
				<text class="value">{{ latestData.altitude }}m</text>
			</view>
			<view class="data-row">
				<text class="label">水平精度</text>
				<text class="value">{{ latestData.horizontalAccuracy }}m</text>
			</view>
			<view class="data-row">
				<text class="label">垂直精度</text>
				<text class="value">{{ latestData.verticalAccuracy }}m</text>
			</view>
			<view class="data-row">
				<text class="label">回调时间</text>
				<text class="value">{{ latestData.time }}</text>
			</view>
			<view class="data-row">
				<text class="label">回调间隔</text>
				<text class="value">{{ latestData.interval }}ms</text>
			</view>
		</view>

		<!-- 启停日志 -->
		<view class="log-panel">
			<view class="panel-title">
				启停日志
				<text class="clear-btn" @click="logs = []">清空</text>
			</view>
			<view class="log-item" v-for="(log, index) in logs" :key="index">
				<text :class="['log-tag', log.type]">{{ log.tag }}</text>
				<text class="log-msg">{{ log.msg }}</text>
				<text class="log-time">{{ log.time }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'

// ========== 配置 ==========
const CONFIG = {
	MIN_DISTANCE: 2,          // 低于此距离视为静止（米）—— 室内测试调小，正式环境改回 5
	MIN_INTERVAL: 1000,       // 计算速度时的最小回调间隔（毫秒），低于此值计算速度不可靠
	MAX_ACCURACY: 200,        // 精度差于此值的数据丢弃（米）—— 室内测试调大，正式环境改回 100
	INTERVAL_MOVING: 3000,    // 运动中重启间隔（毫秒）—— 室内测试缩短，正式环境改回 5000
	INTERVAL_STATIONARY: 10000, // 短暂停留重启间隔
	INTERVAL_LONG_STILL: 30000, // 长时间静止重启间隔
	STATIONARY_THRESHOLD: 3,  // 连续静止超过此次数 → 切换长间隔
}

// ========== 状态 ==========
const mode = ref('continuous') // 'continuous' 持续监听 | 'startstop' 启停策略
const updateActive = ref(false)
const isStationary = ref(true)
const stationaryCount = ref(0)
const restartInterval = ref(0)
const appState = ref('foreground') // 'foreground' | 'background'

const latestData = ref({
	latitude: '--',
	longitude: '--',
	speed: 0,
	accuracy: 0,
	altitude: 0,
	horizontalAccuracy: 0,
	verticalAccuracy: 0,
	time: '--',
	interval: '--',
})

const logs = ref([])

// ========== 内部变量 ==========
let lastPos = null
let lastCallbackTime = 0
let restartTimer = null

// 需要在模板中展示的变量，必须用 ref 才有响应式
const lastValidBearing = ref(0)
const lastDistance = ref(0)
const lastCalcSpeed = ref(0)

// ========== 工具函数 ==========

// Haversine 公式计算两点距离（米）
function getDistance(p1, p2) {
	const R = 6371000
	const toRad = (deg) => deg * Math.PI / 180
	const dLat = toRad(p2.latitude - p1.latitude)
	const dLng = toRad(p2.longitude - p1.longitude)
	const a = Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(p1.latitude)) * Math.cos(toRad(p2.latitude)) * Math.sin(dLng / 2) ** 2
	return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// 方位角计算（0~360，正北为 0，顺时针）
function calcBearing(lat1, lng1, lat2, lng2) {
	const toRad = (deg) => deg * Math.PI / 180
	const toDeg = (rad) => rad * 180 / Math.PI
	const dLng = toRad(lng2 - lng1)
	const y = Math.sin(dLng) * Math.cos(toRad(lat2))
	const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
		Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng)
	return (toDeg(Math.atan2(y, x)) + 360) % 360
}

// 方向角转文字
function bearingToText(bearing) {
	if (bearing >= 337.5 || bearing < 22.5) return '北'
	if (bearing >= 22.5 && bearing < 67.5) return '东北'
	if (bearing >= 67.5 && bearing < 112.5) return '东'
	if (bearing >= 112.5 && bearing < 157.5) return '东南'
	if (bearing >= 157.5 && bearing < 202.5) return '南'
	if (bearing >= 202.5 && bearing < 247.5) return '西南'
	if (bearing >= 247.5 && bearing < 292.5) return '西'
	return '西北'
}

function formatTime(date) {
	const h = String(date.getHours()).padStart(2, '0')
	const m = String(date.getMinutes()).padStart(2, '0')
	const s = String(date.getSeconds()).padStart(2, '0')
	const ms = String(date.getMilliseconds()).padStart(3, '0')
	return `${h}:${m}:${s}.${ms}`
}

function addLog(type, tag, msg) {
	logs.value.unshift({
		type,
		tag,
		msg,
		time: formatTime(new Date()),
	})
	if (logs.value.length > 50) logs.value.length = 50
}

// ========== GPS 启停控制 ==========

function startUpdate() {
	if (updateActive.value) return
	updateActive.value = true

	if (appState.value === 'background') {
		// 后台：使用 startLocationUpdateBackground
		addLog('start', 'START', '启动后台定位')
		wx.startLocationUpdateBackground({
			isHighAccuracy: true,
			highAccuracyExpireTime: 3000,
			success: () => {
				addLog('start', 'START', 'startLocationUpdateBackground 成功')
			},
			fail: (err) => {
				addLog('error', 'ERROR', `startLocationUpdateBackground 失败: ${JSON.stringify(err)}`)
				updateActive.value = false
			},
		})
	} else {
		// 前台：使用 startLocationUpdate
		addLog('start', 'START', '启动前台定位')
		wx.startLocationUpdate({
			isHighAccuracy: true,
			highAccuracyExpireTime: 3000,
			success: () => {
				addLog('start', 'START', 'startLocationUpdate 成功')
			},
			fail: (err) => {
				addLog('error', 'ERROR', `startLocationUpdate 失败: ${JSON.stringify(err)}`)
				updateActive.value = false
			},
		})
	}
}

function stopUpdate() {
	if (!updateActive.value) return
	updateActive.value = false
	wx.stopLocationUpdate()
	addLog('stop', 'STOP', '停止定位')
}

function scheduleRestart(delay) {
	clearTimeout(restartTimer)
	restartInterval.value = delay / 1000
	addLog('info', 'SCHEDULE', `${delay / 1000}s 后重启定位`)
	restartTimer = setTimeout(() => {
		startUpdate()
	}, delay)
}

function clearRestart() {
	clearTimeout(restartTimer)
	restartTimer = null
	restartInterval.value = 0
}

// ========== onLocationChange 回调 ==========

const _locationChangeFn = function(res) {
	const now = Date.now()
	const callbackInterval = lastCallbackTime ? (now - lastCallbackTime) : 0
	lastCallbackTime = now

	// 精度过滤
	if (res.accuracy > CONFIG.MAX_ACCURACY) {
		addLog('filter', 'FILTER', `精度 ${res.accuracy.toFixed(1)}m > ${CONFIG.MAX_ACCURACY}m，丢弃`)
		return
	}

	// 计算距离和方向
	let distance = 0
	let bearing = lastValidBearing.value
	let moved = false

	if (lastPos) {
		distance = getDistance(lastPos, res)

		if (distance >= CONFIG.MIN_DISTANCE) {
			moved = true
			bearing = calcBearing(lastPos.latitude, lastPos.longitude, res.latitude, res.longitude)
			lastValidBearing.value = bearing
			lastDistance.value = distance
			// 计算速度（间隔太短时不可靠，不更新）
			if (callbackInterval >= CONFIG.MIN_INTERVAL) {
				lastCalcSpeed.value = (distance / callbackInterval * 1000) * 3.6 // km/h
			}
			stationaryCount.value = 0
		} else {
			stationaryCount.value++
		}
	} else {
		// 首次定位
		lastDistance.value = 0
	}

	isStationary.value = !moved

	// 更新界面数据
	latestData.value = {
		latitude: res.latitude.toFixed(6),
		longitude: res.longitude.toFixed(6),
		speed: res.speed ? res.speed.toFixed(2) : 0,
		accuracy: res.accuracy ? res.accuracy.toFixed(1) : 0,
		altitude: res.altitude ? res.altitude.toFixed(1) : 0,
		horizontalAccuracy: res.horizontalAccuracy ? res.horizontalAccuracy.toFixed(1) : 0,
		verticalAccuracy: res.verticalAccuracy ? res.verticalAccuracy.toFixed(1) : 0,
		time: formatTime(new Date()),
		interval: callbackInterval || '--',
	}

	// 更新内部变量
	lastPos = { latitude: res.latitude, longitude: res.longitude }

	addLog(
		moved ? 'move' : 'still',
		moved ? 'MOVE' : 'STILL',
		`距离: ${distance.toFixed(1)}m 方向: ${bearing.toFixed(1)}° (${bearingToText(bearing)}) 静止计数: ${stationaryCount.value}`
	)

	// --- 启停策略（仅在 startstop 模式下生效）---
	if (mode.value === 'startstop') {
		stopUpdate()

		if (!moved && stationaryCount.value > CONFIG.STATIONARY_THRESHOLD) {
			// 长时间静止
			scheduleRestart(CONFIG.INTERVAL_LONG_STILL)
		} else if (!moved) {
			// 短暂停留
			scheduleRestart(CONFIG.INTERVAL_STATIONARY)
		} else {
			// 运动中
			scheduleRestart(CONFIG.INTERVAL_MOVING)
		}
	}
}

// ========== 模式切换 ==========

function switchMode(newMode) {
	if (mode.value === newMode) return
	mode.value = newMode
	addLog('info', 'MODE', `切换为${newMode === 'continuous' ? '持续监听' : '启停策略'}模式`)

	if (newMode === 'continuous') {
		// 切到持续监听：清掉重启定时器，直接启动持续定位
		clearRestart()
		startUpdate()
	} else {
		// 切到启停策略：先停掉当前监听，走启停逻辑
		wx.stopLocationUpdate()
		updateActive.value = false
		// 重置内部状态
		lastPos = null
		stationaryCount.value = 0
		lastValidBearing.value = 0
		lastDistance.value = 0
		lastCalcSpeed.value = 0
		startUpdate()
	}
}

// ========== 计算属性 ==========

const computedSpeed = computed(() => {
	const spd = parseFloat(latestData.value.speed) || 0
	return (spd * 3.6).toFixed(1)
})

const calcSpeedDisplay = computed(() => {
	return lastCalcSpeed.value.toFixed(1)
})

const bearingDisplay = computed(() => {
	return `${lastValidBearing.value.toFixed(1)}° (${bearingToText(lastValidBearing.value)})`
})

const distanceDisplay = computed(() => {
	return `${lastDistance.value.toFixed(2)}m`
})

// ========== 生命周期 ==========

onLoad(() => {
	addLog('info', 'INIT', '页面加载，开始定位（持续监听模式）')
	wx.onLocationChange(_locationChangeFn)
	startUpdate()

	// 监听前后台切换
	wx.onAppHide(() => {
		appState.value = 'background'
		addLog('info', 'APP', '切到后台')

		// 停掉前台的启停策略（setTimeout 在后台不可靠）
		clearRestart()
		stopUpdate()

		// 后台统一用持续监听模式
		startUpdate()
	})

	wx.onAppShow(() => {
		appState.value = 'foreground'
		addLog('info', 'APP', '切回前台')

		// 停掉后台持续监听
		stopUpdate()

		// 恢复用户选择的模式
		if (mode.value === 'startstop') {
			// 启停策略：重新走 startUpdate 逻辑
			lastPos = null
			stationaryCount.value = 0
			startUpdate()
		} else {
			// 持续监听：直接启动前台定位
			startUpdate()
		}
	})
})

onUnload(() => {
	clearRestart()
	stopUpdate()
	wx.stopLocationUpdate()
	wx.offLocationChange(_locationChangeFn)
	wx.offAppHide()
	wx.offAppShow()
	addLog('info', 'DESTROY', '页面卸载，清理定位')
})
</script>

<style scoped>
.container {
	padding: 20rpx;
	background: #f5f5f5;
	min-height: 100vh;
}

/* 模式切换 */
.mode-switch {
	display: flex;
	background: #fff;
	border-radius: 16rpx;
	padding: 12rpx;
	margin-bottom: 20rpx;
	gap: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.mode-btn {
	flex: 1;
	text-align: center;
	padding: 16rpx 0;
	font-size: 28rpx;
	color: #666;
	border-radius: 12rpx;
	background: #f5f5f5;
	transition: all 0.2s;
}

.mode-btn.active {
	color: #fff;
	background: #07c160;
	font-weight: bold;
}

/* 状态栏 */
.status-bar {
	display: flex;
	justify-content: space-around;
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx 0;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.status-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.status-item .label {
	font-size: 24rpx;
	color: #999;
}

.status-item .value {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
}

.status-item .value.active {
	color: #07c160;
}

.status-item .value.inactive {
	color: #fa5151;
}

/* 面板 */
.realtime-panel,
.log-panel {
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.panel-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 16rpx;
	padding-bottom: 12rpx;
	border-bottom: 2rpx solid #eee;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

/* 数据行 */
.data-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.data-row .label {
	font-size: 26rpx;
	color: #666;
}

.data-row .value {
	font-size: 26rpx;
	color: #333;
	font-family: Menlo, Monaco, monospace;
}

/* 日志 */
.clear-btn {
	font-size: 24rpx;
	color: #576b95;
	font-weight: normal;
}

.log-item {
	display: flex;
	align-items: center;
	padding: 8rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
	gap: 12rpx;
}

.log-tag {
	font-size: 20rpx;
	padding: 2rpx 10rpx;
	border-radius: 6rpx;
	color: #fff;
	font-weight: bold;
	flex-shrink: 0;
}

.log-tag.start {
	background: #07c160;
}

.log-tag.stop {
	background: #fa5151;
}

.log-tag.move {
	background: #10aeff;
}

.log-tag.still {
	background: #ff9800;
}

.log-tag.filter {
	background: #999;
}

.log-tag.info {
	background: #576b95;
}

.log-tag.error {
	background: #e64340;
}

.log-tag.SCHEDULE {
	background: #8b5cf6;
}

.log-msg {
	font-size: 22rpx;
	color: #666;
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.log-time {
	font-size: 20rpx;
	color: #bbb;
	flex-shrink: 0;
	font-family: Menlo, Monaco, monospace;
}
</style>

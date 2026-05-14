# 全局定位轨迹采集与上传 - 实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现全局定位轨迹采集与批量上传功能，司机登录后自动按后端配置策略采集 GPS 点位并上传。

**Architecture:** 新建 `utils/locationTracker.js` 纯逻辑单例模块，负责 GPS 监听、点位缓冲、批量上传。`stores/location.js` 管理配置和状态。首页 `onShow` 启动，退出登录停止。

**Tech Stack:** uni-app (Vue 3), 微信小程序 wx API, Pinia store

**注意：** 项目无测试框架，使用 HBuilderX 运行到微信开发者工具手动验证。

---

### Task 1: 新增 UploadTrackPoint API 接口

**Files:**
- Modify: `api/index.js:206` (文件末尾追加)

**Step 1: 在 api/index.js 末尾添加接口**

在文件最后一行空行前追加：

```js
/**
 * 上传定位轨迹点
 */
export function UploadTrackPoint(data) {
  return request.post("/api/Wechat/TrackPosition/UploadTrackPoint", data);
}
```

**Step 2: 验证**

在 HBuilderX 中编译确认无语法错误。

**Step 3: Commit**

```bash
git add api/index.js
git commit -m "feat(api): 新增上传定位轨迹接口 UploadTrackPoint"
```

---

### Task 2: 新建 locationTracker 核心模块

**Files:**
- Create: `utils/locationTracker.js`
- Reference: `pages/locationTest/locationTest.vue` (迁移 Haversine、GPS 启停、前后台切换逻辑)
- Reference: `stores/location.js` (读取 locationConfig)
- Reference: `api/index.js` (UploadTrackPoint)

**Step 1: 创建 utils/locationTracker.js**

```js
import { useLocationStore } from '@/stores/location.js'
import { UploadTrackPoint } from '@/api/index.js'

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

// 精度过滤阈值（米）
const MAX_ACCURACY = 200

// ========== 单例模块 ==========

const locationTracker = {
  // 内部状态
  _running: false,
  _buffer: [],           // 待上传点位缓冲区
  _lastPos: null,         // 上一个记录的点位
  _intervalTimer: null,   // TimeoutInterval 定时器（T秒强制记录）
  _thresholdTimer: null,  // TimeoutThreshold 定时器（W秒强制上传）
  _lastUploadTime: 0,     // 上次上传时间戳
  _appHideHandler: null,
  _appShowHandler: null,
  _locationChangeFn: null,
  _appState: 'foreground',

  // ========== 对外属性 ==========

  get isRunning() {
    return this._running
  },

  get bufferSize() {
    return this._buffer.length
  },

  // ========== 启动 ==========

  start() {
    if (this._running) return

    const store = useLocationStore()
    const config = store.locationConfig

    // 判断是否需要启动
    const switchValue = config.LocationSwitch
    if (switchValue === 'C' || switchValue === 'D') {
      console.log('[locationTracker] LocationSwitch 为', switchValue, '，不启动追踪')
      return
    }
    if (!config.OnwayList || config.OnwayList.length === 0) {
      console.log('[locationTracker] OnwayList 为空，不启动追踪')
      return
    }

    console.log('[locationTracker] 启动追踪，配置：', {
      DistanceTriggerStep: config.DistanceTriggerStep,
      TimeoutInterval: config.TimeoutInterval,
      BatchSendCount: config.BatchSendCount,
      TimeoutThreshold: config.TimeoutThreshold,
    })

    this._running = true
    this._buffer = []
    this._lastPos = null
    this._lastUploadTime = Date.now()

    // 注册 onLocationChange 回调
    this._locationChangeFn = this._onLocationChange.bind(this)
    wx.onLocationChange(this._locationChangeFn)

    // 启动 GPS
    this._startGPS()

    // 注册前后台切换
    this._appHideHandler = () => {
      this._appState = 'background'
      console.log('[locationTracker] 切到后台')
      this._stopGPS()
      this._startGPS()
    }
    this._appShowHandler = () => {
      this._appState = 'foreground'
      console.log('[locationTracker] 切回前台')
      this._stopGPS()
      this._startGPS()
    }
    wx.onAppHide(this._appHideHandler)
    wx.onAppShow(this._appShowHandler)
  },

  // ========== 停止 ==========

  stop() {
    if (!this._running) return

    console.log('[locationTracker] 停止追踪，缓冲区剩余', this._buffer.length, '个点')

    this._running = false

    // 停止 GPS
    this._stopGPS()

    // 清除定时器
    clearTimeout(this._intervalTimer)
    clearTimeout(this._thresholdTimer)
    this._intervalTimer = null
    this._thresholdTimer = null

    // 移除回调
    if (this._locationChangeFn) {
      wx.offLocationChange(this._locationChangeFn)
      this._locationChangeFn = null
    }
    if (this._appHideHandler) {
      wx.offAppHide(this._appHideHandler)
      this._appHideHandler = null
    }
    if (this._appShowHandler) {
      wx.offAppShow(this._appShowHandler)
      this._appShowHandler = null
    }

    // 上传剩余缓冲
    if (this._buffer.length > 0) {
      this._upload()
    }

    this._buffer = []
    this._lastPos = null
  },

  // ========== GPS 启停 ==========

  _startGPS() {
    const opts = {
      isHighAccuracy: true,
      highAccuracyExpireTime: 3000,
      success: () => {
        console.log('[locationTracker] GPS 启动成功（' + this._appState + '）')
      },
      fail: (err) => {
        console.error('[locationTracker] GPS 启动失败：', err)
        this._running = false
      },
    }

    if (this._appState === 'background') {
      wx.startLocationUpdateBackground(opts)
    } else {
      wx.startLocationUpdate(opts)
    }
  },

  _stopGPS() {
    wx.stopLocationUpdate()
  },

  // ========== 定位回调 ==========

  _onLocationChange(res) {
    if (!this._running) return

    // 精度过滤
    if (res.accuracy > MAX_ACCURACY) {
      console.log('[locationTracker] 精度', res.accuracy.toFixed(1), 'm > ', MAX_ACCURACY, 'm，丢弃')
      return
    }

    // 更新 store 中的当前位置
    const store = useLocationStore()
    store.setLocation({
      latitude: res.latitude,
      longitude: res.longitude,
      speed: res.speed,
      accuracy: res.accuracy,
      altitude: res.altitude,
    })

    // 计算与上一个记录点的距离
    const config = store.locationConfig
    const distanceStep = Number(config.DistanceTriggerStep) || 5
    let distance = 0

    if (this._lastPos) {
      distance = getDistance(this._lastPos, res)
    }

    if (distance >= distanceStep || !this._lastPos) {
      // 首次定位 或 移动距离达标 → 记录点位
      this._recordPoint(res)
      this._lastPos = { latitude: res.latitude, longitude: res.longitude }

      // 重置 TimeoutInterval 定时器
      this._resetIntervalTimer()
    }
    // 距离不够 → 什么都不做，等 TimeoutInterval 定时器触发
  },

  // ========== 记录点位 ==========

  _recordPoint(res) {
    const point = {
      location: `${res.longitude},${res.latitude}`,
      locatetime: Date.now(),
      speed: res.speed ? parseFloat((res.speed * 3.6).toFixed(3)) : 0,  // m/s → km/h
      direction: res.accuracy ? parseFloat(0 .toFixed(4)) : 0,  // 微信不直接返回方向角，暂填 0
      height: res.altitude ? parseFloat(res.altitude.toFixed(3)) : 0,
      accuracy: res.accuracy ? parseFloat(res.accuracy.toFixed(3)) : 0,
    }

    this._buffer.push(point)
    console.log('[locationTracker] 记录点位，缓冲区', this._buffer.length, '个')

    const store = useLocationStore()
    const config = store.locationConfig
    const batchSendCount = Number(config.BatchSendCount) || 5

    // 缓冲区达到批量上传数量 → 上传
    if (this._buffer.length >= batchSendCount) {
      this._upload()
    } else {
      // 启动/重置 TimeoutThreshold 定时器（W秒强制上传）
      this._resetThresholdTimer()
    }
  },

  // ========== 定时器管理 ==========

  _resetIntervalTimer() {
    clearTimeout(this._intervalTimer)
    const store = useLocationStore()
    const config = store.locationConfig
    const timeoutInterval = (Number(config.TimeoutInterval) || 30) * 1000

    this._intervalTimer = setTimeout(() => {
      if (!this._running) return
      console.log('[locationTracker] TimeoutInterval 超时，强制记录当前点')

      // 获取当前位置强制记录
      uni.getLocation({
        type: 'gcj02',
        isHighAccuracy: true,
        success: (res) => {
          this._recordPoint(res)
          this._lastPos = { latitude: res.latitude, longitude: res.longitude }
          this._resetIntervalTimer()
        },
        fail: () => {
          // 获取失败也重置定时器，下次继续尝试
          this._resetIntervalTimer()
        },
      })
    }, timeoutInterval)
  },

  _resetThresholdTimer() {
    clearTimeout(this._thresholdTimer)
    const store = useLocationStore()
    const config = store.locationConfig
    const timeoutThreshold = (Number(config.TimeoutThreshold) || 60) * 1000

    this._thresholdTimer = setTimeout(() => {
      if (!this._running) return
      if (this._buffer.length === 0) return

      console.log('[locationTracker] TimeoutThreshold 超时，强制上传', this._buffer.length, '个点')
      this._upload()
    }, timeoutThreshold)
  },

  // ========== 上传 ==========

  async _upload() {
    if (this._buffer.length === 0) return

    const store = useLocationStore()
    const config = store.locationConfig

    // 从 OnwayList 构建 onways
    const onways = (config.OnwayList || []).map(item => ({
      SupplyId: item.SupplyId,
      OnwayId: item.Id,
      OnwayCode: item.OnwayCode,
    }))

    // 取出缓冲区数据
    const points = [...this._buffer]
    this._buffer = []
    clearTimeout(this._thresholdTimer)

    try {
      await UploadTrackPoint({ points, onways })
      this._lastUploadTime = Date.now()
      console.log('[locationTracker] 上传成功', points.length, '个点')
    } catch (err) {
      // 上传失败：把点放回缓冲区头部，下次继续
      console.error('[locationTracker] 上传失败：', err)
      this._buffer = [...points, ...this._buffer]
    }
  },
}

export { locationTracker }
```

**Step 2: 验证**

在 HBuilderX 中编译确认无语法错误。检查 import 路径是否正确。

**Step 3: Commit**

```bash
git add utils/locationTracker.js
git commit -m "feat(location): 新建 locationTracker 核心追踪模块"
```

---

### Task 3: 修改 stores/location.js 新增 isTracking 状态

**Files:**
- Modify: `stores/location.js:8-24` (state 部分)

**Step 1: 在 state 中新增 isTracking**

在 `state()` 返回对象中的 `locationConfig` 之后添加：

```js
// 是否正在追踪定位
isTracking: false,
```

**Step 2: 验证**

编译确认无错误。

**Step 3: Commit**

```bash
git add stores/location.js
git commit -m "feat(location): store 新增 isTracking 状态"
```

---

### Task 4: 修改首页接入 locationTracker

**Files:**
- Modify: `pages/index/index.vue:273` (import 区域)
- Modify: `pages/index/index.vue:343-368` (onShow 回调)

**Step 1: 在 import 区域添加 locationTracker 引用**

在 `import { getWxSetting, getLocationInfo, getBackgroundLocationAuth } from "@/utils/authorize.js";` 之后添加：

```js
import { locationTracker } from "@/utils/locationTracker.js";
```

**Step 2: 在 onShow 回调的 finally 块中启动 tracker**

将 onShow 中 finally 块改为：

```js
finally {
  console.log('finally')
  // 获取用户车辆列表
  userStore.getCarList();
  // 获取当前进行中的运单数量
  getProcess();
  // 启动定位追踪
  locationTracker.start();
}
```

**Step 3: 验证**

编译后运行到微信开发者工具，确认首页加载时控制台输出 `[locationTracker]` 相关日志。

**Step 4: Commit**

```bash
git add pages/index/index.vue
git commit -m "feat(location): 首页 onShow 启动定位追踪"
```

---

### Task 5: 修改退出登录停止 tracker

**Files:**
- Modify: `stores/user.js:1-2` (import 区域)
- Modify: `stores/user.js:44-48` (logout 方法)

**Step 1: 添加 locationTracker import**

在 `import { loginByMobile, getCarList } from "@/api/index.js";` 之后添加：

```js
import { locationTracker } from "@/utils/locationTracker.js";
```

**Step 2: 在 logout 方法中调用 stop**

将 logout 方法改为：

```js
logout() {
  locationTracker.stop();
  removeToken();
  this.setUserInfo({});
  this.carList = [];
},
```

**Step 3: 验证**

编译确认无错误。

**Step 4: Commit**

```bash
git add stores/user.js
git commit -m "feat(location): 退出登录时停止定位追踪"
```

---

### Task 6: 端到端验证与调试

**验证清单：**

1. **启动追踪**：登录后进入首页，检查控制台是否输出 `[locationTracker] 启动追踪` 和 `GPS 启动成功`
2. **点位采集**：移动设备或模拟位置变化，检查是否输出 `记录点位` 日志
3. **批量上传**：移动足够距离，检查是否触发 `上传成功` 日志和网络请求
4. **前后台切换**：将小程序切到后台再切回，检查 GPS 是否正确切换 API
5. **超时上传**：静止不动等待超时，检查是否触发 TimeoutInterval 和 TimeoutThreshold
6. **退出登录**：退出登录后检查是否输出 `停止追踪`
7. **无运单场景**：当 OnwayList 为空时，确认不会启动追踪

**Step 1: 在微信开发者工具中逐项验证上述清单**

**Step 2: 修复发现的问题**

**Step 3: Commit**

```bash
git add -A
git commit -m "feat(location): 完成全局定位轨迹采集与上传功能"
```

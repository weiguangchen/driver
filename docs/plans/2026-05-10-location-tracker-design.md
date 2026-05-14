# 全局定位轨迹采集与上传 - 设计文档

## 概述

为司机端微信小程序新增全局定位轨迹采集功能，实时记录司机位置并按策略批量上传到后端，用于运单轨迹追踪。

## 接口信息

- **路径**: `POST /api/Wechat/TrackPosition/UploadTrackPoint`
- **请求参数**:
```json
{
  "points": [
    {
      "location": "117.287550,39.055540",
      "locatetime": 1715286400000,
      "speed": 60.123,
      "direction": 180.1234,
      "height": 15.123,
      "accuracy": 10.123
    }
  ],
  "onways": [
    {
      "SupplyId": "xxx",
      "OnwayId": "xxx",
      "OnwayCode": "xxx"
    }
  ]
}
```
- `location`: 经度,纬度
- `locatetime`: unix 时间戳（毫秒）
- `speed`: km/h，最多 3 位小数
- `direction`: 方向角，最多 4 位小数
- `height`: 海拔，最多 3 位小数
- `accuracy`: 精度，最多 3 位小数
- `onways` 数据来源: `locationConfig.OnwayList`

## 采集策略（来自后端配置）

| 参数 | 说明 |
|------|------|
| `DistanceTriggerStep` (D米) | 每移动 D 米记录一个点 |
| `TimeoutInterval` (T秒) | 超过 T 秒未移动 D 米，强制记录一个点 |
| `BatchSendCount` (X个) | 每记够 X 个点上传一次 |
| `TimeoutThreshold` (W秒) | 不够 X 个但距上次上传超 W 秒，强制上传 |

## 架构设计：方案 B（独立工具模块 + Store 配置）

### 模块职责

```
stores/location.js          ← 配置管理、当前坐标、启动/停止控制
utils/locationTracker.js    ← 纯逻辑：GPS 监听、点位采集、缓冲、批量上传
api/index.js                ← 新增 UploadTrackPoint 接口
```

### 数据流

```
wx.onLocationChange 回调
  → 精度过滤
  → Haversine 计算距离
  → 距离 >= D 米 或 超时 T 秒 → 记录点位到 buffer
  → buffer 达到 X 个 或 超时 W 秒 → 调用 UploadTrackPoint 上传
```

### 核心模块：utils/locationTracker.js

单例模块，暴露以下 API：

```js
locationTracker.start()              // 启动追踪（自动从 store 读配置）
locationTracker.stop()               // 停止追踪
locationTracker.isRunning            // 是否运行中
locationTracker.bufferSize           // 当前缓冲区点位数
```

#### 内部实现要点

1. **GPS 启动**：前台用 `wx.startLocationUpdate`，后台用 `wx.startLocationUpdateBackground`
2. **前后台切换**：`wx.onAppHide` / `wx.onAppShow` 自动切换 API
3. **距离计算**：Haversine 公式（从 locationTest 迁移）
4. **精度过滤**：accuracy 超阈值的数据丢弃
5. **点位格式化**：location 拼为 `经度,纬度` 字符串，speed 从 m/s 转 km/h，各字段保留对应小数位
6. **缓冲上传**：维护 points 数组 + batchTimer + thresholdTimer 两个定时器
7. **上传失败**：保留 buffer 不清空，下次继续
8. **配置读取**：每次 start() 从 `useLocationStore().locationConfig` 读取策略参数和 onways

### 使用方式

```js
// 首页 onShow - 启动（一行）
import { locationTracker } from '@/utils/locationTracker'
locationTracker.start()

// 退出登录 - 停止（一行）
locationTracker.stop()
```

### 边界处理

| 场景 | 处理方式 |
|------|----------|
| OnwayList 为空 | 不启动追踪 |
| LocationSwitch 为 C 或 D | 不启动追踪 |
| 网络上传失败 | 保留缓冲区，下次继续 |
| 登录态失效（响应 600） | 停止追踪，触发登录过期流程 |
| 定位权限被关闭 | onLocationChange 报错时停止 |
| GPS 精度差 | accuracy > 200m 的数据丢弃 |
| 重复调用 start | 幂等，已运行则跳过 |

## 修改文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `api/index.js` | 修改 | 新增 `UploadTrackPoint` 接口 |
| `utils/locationTracker.js` | 新建 | 核心追踪模块 |
| `stores/location.js` | 修改 | 新增 `isTracking` 状态 |
| `pages/index/index.vue` | 修改 | onShow 中调用 `locationTracker.start()` |
| `stores/user.js` | 修改 | logout 中调用 `locationTracker.stop()` |
| `pages/locationTest/locationTest.vue` | 保留 | 开发调试用，不上线 |

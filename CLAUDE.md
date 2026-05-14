# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

华通物流司机端微信小程序，基于 **uni-app (Vue 3 + Composition API `<script setup>`)**，使用 HBuilderX 内置编译器构建。目标平台为微信小程序。

## 开发命令

项目通过 HBuilderX 运行和编译，没有 npm 构建脚本。在 HBuilderX 中通过"自定义运行脚本"切换环境：

| 脚本名 | 环境 | BASE_URL | TOKEN_KEY |
|--------|------|----------|-----------|
| mp-weixin-test | 司机端测试 | https://www.wwwxapp.cn:28064 | test-driver-token |
| mp-weixin-test:wanning | 万宁测试 | https://www.wnlsjc.com:8029 | test-driver-token:wanning |
| mp-weixin-prod | 司机端生产 | https://www.wwwxapp.cn:28063 | driver-token |
| mp-weixin-prod:wanning | 万宁生产 | https://www.wnlsjc.com:8023 | driver-token:wanning |

无测试框架、无 ESLint/Prettier、无 TypeScript。

## 架构

### 路由与页面

- `pages.json` 声明式路由，三个 Tab 页：首页、运单、我的
- 自定义 TabBar（`my-tabbar` 组件），`pages.json` 中 `"custom": true`
- 页面导航使用 `uni.navigateTo`、`uni.switchTab`、`uni.reLaunch`

### 状态管理

Pinia，三个 store（Options API 风格）：
- `stores/user.js` — 用户登录登出、车辆列表
- `stores/app.js` — TabBar 状态、运单查询参数
- `stores/location.js` — GPS 定位数据

组件中通过 `storeToRefs` 解构响应式数据。

### 组件约定

- 全局组件以 `my-` 前缀命名，目录结构 `components/my-{name}/my-{name}.vue`
- easycom 自动导入：`my-xxx` 组件无需手动 import 即可直接使用
- 页面专用子组件放在 `pages/{page}/components/` 下，需手动导入
- UI 组件库为 `uni_modules/` 下的 **uv-ui**

### 事件通信

使用 `uni.$on` / `uni.$emit` / `uni.$off`，事件命名遵循 `{页面名}:{动作}` 模式（如 `waybill:reload`）。在 `onLoad` 注册、`onUnload` 注销。

### API 层

- 所有接口集中在 `api/index.js`，全部 POST 请求
- API 路径格式：`/api/permission/WechatApi/{方法名}`
- 请求封装 `utils/request.js`：自动附加 Bearer Token 和 `driverId`，响应码 200 返回 data，600 触发登录过期
- 环境变量 `process.env.BASE_URL` 和 `process.env.TOKEN_KEY` 由 HBuilderX 注入

### 核心 Hook

`hooks/useList.js` — 分页列表通用 hook，支持竞态处理（`lastFetchId` 机制）。列表项通过 `_isShow` 字段控制前端显隐。

## 样式约定

- SCSS，单位使用 `rpx`（微信小程序响应式单位）
- CSS 变量定义在 `styles/public.scss`：`--main-color` (#31ce57)、`--title-color`、`--content-color` 等
- 全局 SCSS 变量在 `uni.scss`
- 字体 MiSans（网络加载 400/500/600 weight）
- 安全区域通过 CSS 变量 `--safe-area-inset-bottom` 和 `--safe-bottom` 处理

## 多环境与多租户

支持标准版和万宁版两个租户，各有独立的测试/生产环境。通过不同的 `TOKEN_KEY` 实现数据隔离。Storage 键名格式为 `{TOKEN_KEY}:{key}`。

## 关键依赖

- **big.js** — 高精度数值运算
- **dayjs** — 日期处理
- **js-base64** — Base64 编解码
- **luch-request** — HTTP 请求封装（`js_sdk/` 目录下）

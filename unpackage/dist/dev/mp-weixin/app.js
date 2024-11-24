"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const uni_modules_uvUiTools_index = require("./uni_modules/uv-ui-tools/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/waybill/waybill.js";
  "./pages/mine/mine.js";
  "./pages/carList/carList.js";
  "./pages/addCar/addCar.js";
  "./pages/feedback/feedback.js";
  "./pages/feedback/result.js";
  "./pages/billDetail/billDetail.js";
  "./pages/guide/guide.js";
  "./pages/setting/setting.js";
  "./pages/statistics/statistics.js";
  "./pages/webview/webview.js";
  "./pages/agreement/agreement.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.use(common_vendor.createPinia());
  app.use(uni_modules_uvUiTools_index.uvUI);
  return {
    app,
    Pinia: common_vendor.Pinia
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;

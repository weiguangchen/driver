"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_token = require("./utils/token.js");
const stores_user = require("./stores/user.js");
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
  "./pages/wayBillDetail/wayBillDetail.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    common_vendor.onLaunch(async () => {
      var _a;
      console.log("App Launch");
      userStore.setUserInfo(utils_token.getToken() ? (_a = utils_token.getToken()) == null ? void 0 : _a.userInfo : {});
    });
    return () => {
    };
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

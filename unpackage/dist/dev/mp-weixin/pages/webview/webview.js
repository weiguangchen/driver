"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "webview",
  setup(__props) {
    const src = common_vendor.ref();
    common_vendor.onLoad((options) => {
      console.log("src", decodeURIComponent(options.src));
      src.value = decodeURIComponent(options.src);
    });
    return (_ctx, _cache) => {
      return {
        a: src.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/webview/webview.vue"]]);
wx.createPage(MiniProgramPage);

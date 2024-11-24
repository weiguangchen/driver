"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {};
if (!Array) {
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  (_easycom_uv_image2 + _easycom_uv_button2)();
}
const _easycom_uv_image = () => "../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_uv_image + _easycom_uv_button)();
}
function _sfc_render(_ctx, _cache) {
  return {
    a: common_vendor.p({
      src: "/static/images/feedback.png",
      width: "176rpx",
      height: "176rpx",
      ["custom-style"]: {
        marginBottom: "64rpx"
      }
    }),
    b: common_vendor.p({
      text: "好的",
      color: "linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/wei/driver/pages/feedback/result.vue"]]);
wx.createPage(MiniProgramPage);

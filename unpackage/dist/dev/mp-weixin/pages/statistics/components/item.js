"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {};
if (!Array) {
  const _easycom_uv_line2 = common_vendor.resolveComponent("uv-line");
  _easycom_uv_line2();
}
const _easycom_uv_line = () => "../../../uni_modules/uv-line/components/uv-line/uv-line.js";
if (!Math) {
  _easycom_uv_line();
}
function _sfc_render(_ctx, _cache) {
  return {
    a: common_vendor.p({
      direction: "col",
      color: "var(--divider)",
      length: "56rpx"
    }),
    b: common_vendor.p({
      direction: "col",
      color: "var(--divider)",
      length: "56rpx"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-aebf7944"], ["__file", "/Users/wei/driver/pages/statistics/components/item.vue"]]);
wx.createComponent(Component);

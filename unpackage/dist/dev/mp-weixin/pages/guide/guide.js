"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uv_tabs2 = common_vendor.resolveComponent("uv-tabs");
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  (_easycom_uv_tabs2 + _easycom_uv_image2)();
}
const _easycom_uv_tabs = () => "../../uni_modules/uv-tabs/components/uv-tabs/uv-tabs.js";
const _easycom_uv_image = () => "../../uni_modules/uv-image/components/uv-image/uv-image.js";
if (!Math) {
  (_easycom_uv_tabs + _easycom_uv_image)();
}
const _sfc_main = {
  __name: "guide",
  setup(__props) {
    const list = common_vendor.ref([
      {
        name: "问题类型"
      },
      {
        name: "问题类型"
      },
      {
        name: "问题类型"
      }
    ]);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          scrollable: false,
          list: list.value,
          ["active-style"]: {
            fontWeight: "bold",
            color: "var(--title-color)"
          },
          ["inactive-style"]: {
            color: "var(--sub-color)"
          },
          ["custom-style"]: {
            background: "#ffffff"
          },
          lineWidth: "32rpx",
          lineHeight: "8rpx",
          ["line-color"]: "var(--main-color)"
        }),
        b: common_vendor.p({
          src: "/static/images/arrow.png",
          width: "24rpx",
          height: "24rpx",
          duration: 0
        }),
        c: common_vendor.p({
          src: "/static/images/arrow.png",
          width: "24rpx",
          height: "24rpx",
          duration: 0
        }),
        d: common_vendor.p({
          src: "/static/images/arrow.png",
          width: "24rpx",
          height: "24rpx",
          duration: 0
        }),
        e: common_vendor.p({
          src: "/static/images/arrow.png",
          width: "24rpx",
          height: "24rpx",
          duration: 0
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/guide/guide.vue"]]);
wx.createPage(MiniProgramPage);

"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uv_navbar2 = common_vendor.resolveComponent("uv-navbar");
  const _easycom_uv_load_more2 = common_vendor.resolveComponent("uv-load-more");
  (_easycom_uv_navbar2 + _easycom_uv_load_more2)();
}
const _easycom_uv_navbar = () => "../../uni_modules/uv-navbar/components/uv-navbar/uv-navbar.js";
const _easycom_uv_load_more = () => "../../uni_modules/uv-load-more/components/uv-load-more/uv-load-more.js";
if (!Math) {
  (FilterDrawer + _easycom_uv_navbar + Item + _easycom_uv_load_more)();
}
const FilterDrawer = () => "./components/my-filter-drawer.js";
const Item = () => "./components/item.js";
const _sfc_main = {
  __name: "statistics",
  setup(__props) {
    const navbarPad = common_vendor.ref(0);
    common_vendor.onLoad(() => {
      let menuButtonInfo = common_vendor.index.getMenuButtonBoundingClientRect();
      navbarPad.value = menuButtonInfo.width + 20;
    });
    function leftClick() {
      common_vendor.index.navigateBack();
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.sr("filter", "5b68762e-1,5b68762e-0"),
        b: common_vendor.o(_ctx.changeFilter),
        c: `${navbarPad.value}px`,
        d: common_vendor.o(leftClick),
        e: common_vendor.p({
          placeholder: true
        }),
        f: common_vendor.f(30, (item, k0, i0) => {
          return {
            a: "5b68762e-2-" + i0
          };
        }),
        g: common_vendor.p({
          status: "nomore",
          color: "#B0BECC"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/statistics/statistics.vue"]]);
wx.createPage(MiniProgramPage);

"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_app = require("../../stores/app.js");
if (!Array) {
  const _easycom_uv_tabbar_item2 = common_vendor.resolveComponent("uv-tabbar-item");
  const _easycom_uv_tabbar2 = common_vendor.resolveComponent("uv-tabbar");
  (_easycom_uv_tabbar_item2 + _easycom_uv_tabbar2)();
}
const _easycom_uv_tabbar_item = () => "../../uni_modules/uv-tabbar/components/uv-tabbar-item/uv-tabbar-item.js";
const _easycom_uv_tabbar = () => "../../uni_modules/uv-tabbar/components/uv-tabbar/uv-tabbar.js";
if (!Math) {
  (_easycom_uv_tabbar_item + _easycom_uv_tabbar)();
}
const _sfc_main = {
  __name: "my-tabbar",
  setup(__props) {
    const appStore = stores_app.useAppStore();
    const { tabbarList, tabbarValue } = common_vendor.storeToRefs(appStore);
    function change(index) {
      console.log("index", index);
      common_vendor.index.switchTab({
        url: tabbarList.value[index].pagePath,
        success() {
          tabbarValue.value = index;
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(tabbarList), (item, k0, i0) => {
          return {
            a: item.selectedIconPath,
            b: item.iconPath,
            c: item.text,
            d: "131ef261-1-" + i0 + ",131ef261-0",
            e: common_vendor.p({
              text: item.text
            })
          };
        }),
        b: common_vendor.o(change),
        c: common_vendor.p({
          activeColor: "var(--main-color)",
          inactiveColor: "var(--sub-color)",
          value: common_vendor.unref(tabbarValue)
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/components/my-tabbar/my-tabbar.vue"]]);
wx.createComponent(Component);

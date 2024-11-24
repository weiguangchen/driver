"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uv_line2 = common_vendor.resolveComponent("uv-line");
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_my_drawer2 = common_vendor.resolveComponent("my-drawer");
  (_easycom_uv_line2 + _easycom_uv_image2 + _easycom_uv_button2 + _easycom_my_drawer2)();
}
const _easycom_uv_line = () => "../../../uni_modules/uv-line/components/uv-line/uv-line.js";
const _easycom_uv_image = () => "../../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_uv_button = () => "../../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_my_drawer = () => "../../../components/my-drawer/my-drawer.js";
if (!Math) {
  (_easycom_uv_line + _easycom_uv_image + _easycom_uv_button + _easycom_my_drawer)();
}
const _sfc_main = {
  __name: "MapDrawer",
  setup(__props, { expose: __expose }) {
    const { ctx } = common_vendor.getCurrentInstance();
    const drawer = common_vendor.ref();
    const mapContext = common_vendor.ref();
    common_vendor.onMounted(() => {
      mapContext.value = common_vendor.index.createMapContext("map", ctx);
      mapContext.value.moveToLocation({
        longitude: 117.216188,
        latitude: 39.113613
      });
    });
    function makePhone() {
      common_vendor.index.openLocation({
        longitude: 117.216188,
        latitude: 39.113613
      });
    }
    function openApp() {
      mapContext.value.openMapApp({
        longitude: 117.216188,
        latitude: 39.113613,
        destination: "天津国贸购物中心"
      });
    }
    function open() {
      drawer.value.popup.open();
    }
    __expose({
      open
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          color: "#E3E9EF",
          margin: "28rpx 0 32rpx"
        }),
        b: common_vendor.p({
          src: "/static/images/phone.png",
          width: "40rpx",
          height: "40rpx",
          duration: 0,
          ["custom-style"]: {
            marginRight: "4rpx"
          }
        }),
        c: common_vendor.o(makePhone),
        d: common_vendor.p({
          color: "#E7F9E9",
          ["custom-style"]: {
            height: "96rpx",
            border: "1px solid var(--main-color)",
            borderRadius: "16rpx",
            color: "var(--main-color)"
          }
        }),
        e: common_vendor.p({
          src: "/static/images/location.png",
          width: "40rpx",
          height: "40rpx",
          duration: 0,
          ["custom-style"]: {
            marginRight: "4rpx"
          }
        }),
        f: common_vendor.o(openApp),
        g: common_vendor.p({
          color: "linear-gradient( 270deg, #31CE57 0%, #07B130 100%)",
          ["custom-style"]: {
            height: "96rpx",
            borderRadius: "16rpx"
          }
        }),
        h: common_vendor.sr(drawer, "a251a19b-0", {
          "k": "drawer"
        }),
        i: common_vendor.p({
          showTitle: false,
          bgColor: "#FFFFFF",
          round: "12px"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a251a19b"], ["__file", "/Users/wei/driver/pages/billDetail/components/MapDrawer.vue"]]);
wx.createComponent(Component);

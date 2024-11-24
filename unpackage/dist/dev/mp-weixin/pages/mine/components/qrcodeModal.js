"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_uv_qrcode2 = common_vendor.resolveComponent("uv-qrcode");
  const _easycom_my_popup2 = common_vendor.resolveComponent("my-popup");
  (_easycom_uv_image2 + _easycom_uv_qrcode2 + _easycom_my_popup2)();
}
const _easycom_uv_image = () => "../../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_uv_qrcode = () => "../../../uni_modules/uv-qrcode/components/uv-qrcode/uv-qrcode.js";
const _easycom_my_popup = () => "../../../components/my-popup/my-popup.js";
if (!Math) {
  (_easycom_uv_image + _easycom_uv_qrcode + _easycom_my_popup)();
}
const _sfc_main = {
  __name: "qrcodeModal",
  setup(__props, { expose: __expose }) {
    const popup = common_vendor.ref();
    const qrcode = common_vendor.ref();
    function open() {
      popup.value.open();
    }
    const init = common_vendor.ref(false);
    function change({ show }) {
      if (show && !init.value) {
        qrcode.value.make({
          success() {
            init.value = true;
          }
        });
      }
    }
    __expose({
      open
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          src: "/static/images/mine/avatar.png",
          width: "120rpx",
          height: "120rpx",
          duration: 0,
          ["custom-style"]: {
            marginRight: "24rpx"
          }
        }),
        b: common_vendor.sr(qrcode, "811b4f34-2,811b4f34-0", {
          "k": "qrcode"
        }),
        c: common_vendor.p({
          start: false,
          size: "430rpx",
          value: "https://h5.uvui.cn"
        }),
        d: common_vendor.sr(popup, "811b4f34-0", {
          "k": "popup"
        }),
        e: common_vendor.o(change),
        f: common_vendor.p({
          mode: "center",
          ["custom-style"]: {
            minHeight: "300rpx"
          },
          bgColor: "none",
          duration: 0
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-811b4f34"], ["__file", "/Users/wei/driver/pages/mine/components/qrcodeModal.vue"]]);
wx.createComponent(Component);

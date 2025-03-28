"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uv_input2 = common_vendor.resolveComponent("uv-input");
  const _easycom_my_modal2 = common_vendor.resolveComponent("my-modal");
  (_easycom_uv_input2 + _easycom_my_modal2)();
}
const _easycom_uv_input = () => "../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_my_modal = () => "../my-modal/my-modal.js";
if (!Math) {
  (_easycom_uv_input + _easycom_my_modal)();
}
const _sfc_main = {
  __name: "nickname-modal",
  props: {
    closeOnClickOverlay: {
      type: Boolean,
      default: false
    },
    showCancelButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ["success"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emits = __emit;
    const modal = common_vendor.ref();
    const nickname = common_vendor.ref();
    function open(name = "") {
      nickname.value = name;
      modal.value.open();
    }
    function submit() {
      emits("success", nickname.value);
    }
    function close() {
      modal.value.close();
    }
    function closeLoading() {
      modal.value.closeLoading();
    }
    __expose({
      open,
      close,
      closeLoading
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => nickname.value = $event),
        b: common_vendor.p({
          ["input-align"]: "center",
          placeholder: "限 6 个字以内",
          border: "none",
          customStyle: {
            width: "100%",
            height: "88rpx",
            background: "var(--page-bg)"
          },
          maxlength: "6",
          modelValue: nickname.value
        }),
        c: common_vendor.sr(modal, "054d9225-0", {
          "k": "modal"
        }),
        d: common_vendor.o(submit),
        e: common_vendor.p({
          title: "请填写您的称呼",
          ["show-cancel-button"]: __props.showCancelButton,
          ["async-close"]: true,
          ["close-on-click-overlay"]: __props.closeOnClickOverlay
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/components/my-login-drawer/nickname-modal.vue"]]);
wx.createComponent(Component);

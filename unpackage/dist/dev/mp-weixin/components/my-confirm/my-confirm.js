"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_my_modal2 = common_vendor.resolveComponent("my-modal");
  _easycom_my_modal2();
}
const _easycom_my_modal = () => "../my-modal/my-modal.js";
if (!Math) {
  _easycom_my_modal();
}
const _sfc_main = {
  __name: "my-confirm",
  emits: ["confirm", "cancel", "close"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emits = __emit;
    const modal = common_vendor.ref();
    const innerTitle = common_vendor.ref();
    const innerContent = common_vendor.ref();
    const innerShowCancelButton = common_vendor.ref();
    const innerCancelText = common_vendor.ref();
    const innerCancelColor = common_vendor.ref();
    const innerShowConfirmButton = common_vendor.ref();
    const innerConfirmText = common_vendor.ref();
    const innerConfirmColor = common_vendor.ref();
    const innerConfirmBgColor = common_vendor.ref();
    const innerButtonReverse = common_vendor.ref();
    const innerAsyncClose = common_vendor.ref();
    const innerCloseOnClickOverlay = common_vendor.ref();
    const confirmFn = common_vendor.ref();
    const cancelFn = common_vendor.ref();
    const closeFn = common_vendor.ref();
    function confirm({
      title,
      content,
      showCancelButton,
      cancelText,
      cancelColor,
      showConfirmButton,
      confirmText,
      confirmColor,
      confirmBgColor,
      buttonReverse,
      asyncClose,
      closeOnClickOverlay,
      confirm: confirm2,
      cancel,
      close: close2
    }) {
      innerTitle.value = title;
      innerContent.value = content;
      innerShowCancelButton.value = showCancelButton ?? true;
      innerCancelText.value = cancelText ?? "取消";
      innerCancelColor.value = cancelColor;
      innerShowConfirmButton.value = showConfirmButton ?? true;
      innerConfirmText.value = confirmText ?? "好的";
      innerConfirmColor.value = confirmColor;
      innerConfirmBgColor.value = confirmBgColor ?? "#F15948";
      innerButtonReverse.value = buttonReverse ?? false;
      innerAsyncClose.value = asyncClose ?? false;
      innerCloseOnClickOverlay.value = closeOnClickOverlay ?? true;
      confirmFn.value = confirm2;
      cancelFn.value = cancel;
      closeFn.value = close2;
      modal.value.open();
    }
    function close() {
      modal.value.close();
    }
    function closeLoading() {
      modal.value.closeLoading();
    }
    function confirmHandler() {
      emits("confirm");
      if (confirmFn.value) {
        confirmFn.value();
      }
    }
    function cancelHandler() {
      emits("cancel");
      if (cancelFn.value) {
        cancelFn.value();
      }
    }
    function closeHandler() {
      emits("close");
      if (closeFn.value) {
        closeFn.value();
      }
    }
    __expose({
      confirm,
      close,
      closeLoading
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.sr(modal, "5157ea7e-0", {
          "k": "modal"
        }),
        b: common_vendor.o(confirmHandler),
        c: common_vendor.o(cancelHandler),
        d: common_vendor.o(closeHandler),
        e: common_vendor.p({
          title: innerTitle.value,
          content: innerContent.value,
          ["show-cancel-button"]: innerShowCancelButton.value,
          ["cancel-text"]: innerCancelText.value,
          ["cancel-color"]: innerCancelColor.value,
          ["show-confirm-button"]: innerShowConfirmButton.value,
          ["confirm-text"]: innerConfirmText.value,
          ["confirm-color"]: innerConfirmColor.value,
          ["confirm-bg-color"]: innerConfirmBgColor.value,
          ["button-reverse"]: innerButtonReverse.value,
          ["async-close"]: innerAsyncClose.value,
          ["close-on-click-overlay"]: innerCloseOnClickOverlay.value
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/components/my-confirm/my-confirm.vue"]]);
wx.createComponent(Component);

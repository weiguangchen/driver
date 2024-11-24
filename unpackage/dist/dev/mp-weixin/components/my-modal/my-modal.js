"use strict";
var _a, _b;
const common_vendor = require("../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../uni_modules/uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../uni_modules/uv-ui-tools/libs/mixin/mixin.js");
require("../../uni_modules/uv-modal/components/uv-modal/props.js");
const _sfc_main = {
  name: "uv-modal",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin],
  props: {
    // 标题
    title: {
      type: [String],
      default: ""
    },
    // 弹窗内容
    content: {
      type: String,
      default: ""
    },
    // 确认文案
    confirmText: {
      type: String,
      default: "确认"
    },
    // 取消文案
    cancelText: {
      type: String,
      default: "取消"
    },
    // 是否显示确认按钮
    showConfirmButton: {
      type: Boolean,
      default: true
    },
    // 是否显示取消按钮
    showCancelButton: {
      type: Boolean,
      default: true
    },
    // 确认按钮颜色
    confirmColor: {
      type: String,
      default: "#FFFFFF"
    },
    // 确认按钮背景颜色
    confirmBgColor: {
      type: String,
      default: "#31CE57"
    },
    // 取消文字颜色
    cancelColor: {
      type: String,
      default: "#73838E"
    },
    // 对调确认和取消的位置
    buttonReverse: {
      type: Boolean,
      default: false
    },
    // 是否开启缩放效果
    zoom: {
      type: Boolean,
      default: true
    },
    // 层级
    zIndex: {
      type: [String, Number],
      default: 10075
    },
    // 是否异步关闭，只对确定按钮有效
    asyncClose: {
      type: Boolean,
      default: false
    },
    // 是否允许点击遮罩关闭modal
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    },
    // 给一个负的margin-top，往上偏移，避免和键盘重合的情况
    negativeTop: {
      type: [String, Number],
      default: 50
    },
    // modal宽度，不支持百分比，可以数值，px，rpx单位
    width: {
      type: [String, Number],
      default: "650rpx"
    },
    // 文本对齐方式，默认left
    align: {
      type: String,
      default: "center"
    },
    // 文本自定义样式
    textStyle: {
      type: [Object, String],
      default: ""
    },
    ...(_b = (_a = common_vendor.index.$uv) == null ? void 0 : _a.props) == null ? void 0 : _b.modal
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    nvueStyle() {
      const style = {};
      return style;
    }
  },
  methods: {
    open() {
      this.$refs.modalPopup.open();
      if (this.loading)
        this.loading = false;
    },
    close() {
      this.$refs.modalPopup.close();
    },
    popupChange(e) {
      if (!e.show)
        this.$emit("close");
    },
    // 点击确定按钮
    confirmHandler() {
      if (!this.loading) {
        this.$emit("confirm");
      }
      if (this.asyncClose) {
        this.loading = true;
      } else {
        this.close();
      }
    },
    // 点击取消按钮
    cancelHandler() {
      this.$emit("cancel");
      this.close();
    },
    closeLoading() {
      this.$nextTick(() => {
        this.loading = false;
      });
    }
  }
};
if (!Array) {
  const _easycom_uv_loading_icon2 = common_vendor.resolveComponent("uv-loading-icon");
  const _easycom_uv_popup2 = common_vendor.resolveComponent("uv-popup");
  (_easycom_uv_loading_icon2 + _easycom_uv_popup2)();
}
const _easycom_uv_loading_icon = () => "../../uni_modules/uv-loading-icon/components/uv-loading-icon/uv-loading-icon.js";
const _easycom_uv_popup = () => "../../uni_modules/uv-popup/components/uv-popup/uv-popup.js";
if (!Math) {
  (_easycom_uv_loading_icon + _easycom_uv_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.title
  }, $props.title ? {
    b: common_vendor.t($props.title)
  } : {}, {
    c: common_vendor.t($props.content),
    d: common_vendor.s({
      textAlign: $props.align
    }),
    e: common_vendor.s($options.nvueStyle),
    f: common_vendor.s(_ctx.$uv.addStyle($props.textStyle)),
    g: $props.showConfirmButton || $props.showCancelButton
  }, $props.showConfirmButton || $props.showCancelButton ? common_vendor.e({
    h: $props.showCancelButton
  }, $props.showCancelButton ? {
    i: common_vendor.t($props.cancelText),
    j: $props.cancelColor,
    k: $props.showCancelButton && $props.showConfirmButton ? "22rpx" : "0rpx",
    l: common_vendor.n($props.showCancelButton && !$props.showConfirmButton && "uv-modal__button-group__wrapper--only-cancel"),
    m: common_vendor.o((...args) => $options.cancelHandler && $options.cancelHandler(...args))
  } : {}, {
    n: $props.showConfirmButton
  }, $props.showConfirmButton ? common_vendor.e({
    o: $data.loading
  }, $data.loading ? {
    p: common_vendor.p({
      color: "#ffffff"
    })
  } : {
    q: common_vendor.t($props.confirmText),
    r: $props.confirmColor
  }, {
    s: common_vendor.n(!$props.showCancelButton && $props.showConfirmButton && "uv-modal__button-group__wrapper--only-confirm"),
    t: $props.confirmBgColor,
    v: common_vendor.o((...args) => $options.confirmHandler && $options.confirmHandler(...args))
  }) : {}, {
    w: $props.buttonReverse ? "row-reverse" : "row"
  }) : {}, {
    x: _ctx.$uv.addUnit($props.width),
    y: common_vendor.sr("modalPopup", "76772815-0"),
    z: common_vendor.o($options.popupChange),
    A: common_vendor.p({
      mode: "center",
      zoom: $props.zoom,
      zIndex: $props.zIndex,
      customStyle: {
        borderRadius: "6px",
        overflow: "hidden",
        marginTop: `-${_ctx.$uv.addUnit($props.negativeTop)}`
      },
      closeOnClickOverlay: $props.closeOnClickOverlay,
      safeAreaInsetBottom: false,
      duration: 0
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-76772815"], ["__file", "/Users/wei/driver/components/my-modal/my-modal.vue"]]);
wx.createComponent(Component);

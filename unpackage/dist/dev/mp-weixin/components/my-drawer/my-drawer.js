"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_uv_popup2 = common_vendor.resolveComponent("uv-popup");
  (_easycom_uv_button2 + _easycom_uv_popup2)();
}
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_uv_popup = () => "../../uni_modules/uv-popup/components/uv-popup/uv-popup.js";
if (!Math) {
  (_easycom_uv_button + _easycom_uv_popup)();
}
const _sfc_main = {
  __name: "my-drawer",
  props: {
    showTitle: {
      default: true,
      type: Boolean
    },
    title: {
      default: ""
    },
    height: {
      default: 440
    },
    // 动画时长，单位ms
    duration: {
      type: [String, Number],
      default: 300
    },
    // 层级
    zIndex: {
      type: [String, Number],
      default: 10075
    },
    // 是否显示遮罩
    overlay: {
      type: Boolean,
      default: true
    },
    // 点击遮罩是否关闭弹窗
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    },
    // 遮罩的透明度，0-1之间
    overlayOpacity: {
      type: [Number, String],
      default: 0.4
    },
    // 自定义遮罩的样式
    overlayStyle: {
      type: [Object, String],
      default: ""
    },
    round: {
      type: [Number, String],
      default: 12
    },
    // 是否显示关闭图标
    closeable: {
      type: Boolean,
      default: true
    },
    // 自定义关闭图标位置，top-left为左上角，top-right为右上角，bottom-left为左下角，bottom-right为右下角
    closeIconPos: {
      type: String,
      default: "top-right"
    },
    bgColor: {
      type: String,
      default: "#F2F4F7"
    },
    showConfirmButton: {
      type: Boolean,
      default: false
    },
    confirmText: {
      default: "确认",
      type: String
    },
    asyncClose: {
      type: Boolean,
      default: false
    }
  },
  emits: ["maskClick", "change", "confirm"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const {
      ctx
    } = common_vendor.getCurrentInstance();
    const props = __props;
    const emits = __emit;
    const popup = common_vendor.ref(null);
    const scrollHeight = common_vendor.computed(() => {
      return contentHeight.value < props.height ? contentHeight.value : props.height;
    });
    const contentHeight = common_vendor.ref(0);
    async function change(show) {
      await common_vendor.nextTick$1();
      emits("change", show);
      if (show.show) {
        resize();
      }
    }
    async function resize() {
      let rectInfo = await ctx.$uv.getRect(".scroll-view-wrapper");
      contentHeight.value = rectInfo.height;
    }
    const loading = common_vendor.ref(false);
    function confirm() {
      if (props.asyncClose) {
        loading.value = true;
      } else {
        popup.value.close();
      }
      emits("confirm");
    }
    function closeLoading() {
      loading.value = false;
    }
    __expose({
      resize,
      popup,
      closeLoading
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.showTitle
      }, __props.showTitle ? common_vendor.e({
        b: _ctx.$slots.title
      }, _ctx.$slots.title ? {} : {
        c: common_vendor.t(__props.title)
      }) : {}, {
        d: `${scrollHeight.value}px`,
        e: __props.showConfirmButton || _ctx.$slots.footer
      }, __props.showConfirmButton || _ctx.$slots.footer ? {
        f: common_vendor.o(confirm),
        g: common_vendor.p({
          text: __props.confirmText,
          color: "linear-gradient( 270deg, #31CE57 0%, #07B130 100%);",
          loading: loading.value,
          ["custom-style"]: {
            borderRadius: "16rpx",
            height: "96rpx",
            fontWeight: "bold",
            fontSize: "30rpx"
          }
        })
      } : {}, {
        h: common_vendor.sr(popup, "57195a82-0", {
          "k": "popup"
        }),
        i: common_vendor.o(change),
        j: common_vendor.p({
          mode: "bottom",
          ["custom-style"]: {
            minHeight: "100rpx"
          },
          duration: __props.duration,
          overlay: __props.overlay,
          bgColor: __props.bgColor,
          zIndex: __props.zIndex,
          overlayOpacity: __props.overlayOpacity,
          overlayStyle: __props.overlayStyle,
          closeOnClickOverlay: __props.closeOnClickOverlay,
          closeable: __props.closeable,
          closeIconPos: __props.closeIconPos,
          round: __props.round,
          safeAreaInsetBottom: true
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-57195a82"], ["__file", "/Users/wei/driver/components/my-drawer/my-drawer.vue"]]);
wx.createComponent(Component);

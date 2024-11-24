"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  (_easycom_uv_image2 + _easycom_uv_button2)();
}
const _easycom_uv_image = () => "../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_uv_image + _easycom_uv_button)();
}
const __default__ = {
  options: {
    virtualHost: true
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "my-empty",
  props: {
    img: {
      default: "/static/images/empty/bill.png"
    },
    text: {
      default: "暂无内容"
    },
    showButton: {
      default: false
    },
    buttonText: {
      default: "登录"
    },
    height: {
      default: ""
    },
    bgColor: {
      default: ""
    }
  },
  emits: ["confirm"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    function confirm() {
      emits("confirm");
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          src: __props.img,
          width: "176rpx",
          height: "176rpx",
          duration: 0,
          ["custom-style"]: {
            marginBottom: "28rpx"
          }
        }),
        b: common_vendor.t(__props.text),
        c: __props.showButton
      }, __props.showButton ? {
        d: common_vendor.o(confirm),
        e: common_vendor.p({
          text: __props.buttonText,
          color: "linear-gradient( 270deg, #31CE57 0%, #07B130 100%);",
          ["custom-style"]: {
            width: "268rpx",
            height: "72rpx"
          },
          customTextStyle: {
            fontSize: "28rpx"
          },
          shape: "circle"
        })
      } : {}, {
        f: __props.height,
        g: __props.bgColor
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/components/my-empty/my-empty.vue"]]);
wx.createComponent(Component);

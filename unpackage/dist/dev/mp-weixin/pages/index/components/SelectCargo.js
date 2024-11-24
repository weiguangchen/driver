"use strict";
const common_vendor = require("../../../common/vendor.js");
require("../../../utils/request.js");
const stores_user = require("../../../stores/user.js");
if (!Array) {
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_my_drawer2 = common_vendor.resolveComponent("my-drawer");
  (_easycom_uv_image2 + _easycom_my_drawer2)();
}
const _easycom_uv_image = () => "../../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_my_drawer = () => "../../../components/my-drawer/my-drawer.js";
if (!Math) {
  (_easycom_uv_image + _easycom_my_drawer)();
}
const _sfc_main = {
  __name: "SelectCargo",
  props: {
    modelValue: {
      default: ""
    },
    options: {
      default: () => [],
      type: Array
    }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const userStore = stores_user.useUserStore();
    common_vendor.storeToRefs(userStore);
    const {
      ctx
    } = common_vendor.getCurrentInstance();
    const props = __props;
    const emits = __emit;
    const text = common_vendor.ref();
    common_vendor.watchEffect(() => {
      const find = props.options.find((m) => m.value === props.modelValue);
      if (find) {
        text.value = find.label;
      }
    });
    const drawer = common_vendor.ref();
    function showDrawer() {
      drawer.value.popup.open();
    }
    function select(item) {
      emits("update:modelValue", item.value);
      emits("change", item);
      ctx.$uv.formValidate(ctx, "change");
      drawer.value.popup.close();
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(text.value),
        b: common_vendor.p({
          src: "/static/images/all.png",
          width: "24rpx",
          height: "24rpx",
          ["custom-style"]: {
            marginLeft: "4rpx",
            flex: "none"
          },
          duration: 0
        }),
        c: common_vendor.o(showDrawer),
        d: common_vendor.f(__props.options, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.label),
            b: __props.modelValue === item.value
          }, __props.modelValue === item.value ? {
            c: "88e9ea94-2-" + i0 + ",88e9ea94-1",
            d: common_vendor.p({
              src: "/static/images/check.png",
              duration: 0,
              width: "32rpx",
              height: "32rpx"
            })
          } : {}, {
            e: __props.modelValue === item.value ? 1 : "",
            f: common_vendor.o(($event) => select(item))
          });
        }),
        e: common_vendor.sr(drawer, "88e9ea94-1", {
          "k": "drawer"
        }),
        f: common_vendor.p({
          title: "选择货主"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-88e9ea94"], ["__file", "/Users/wei/driver/pages/index/components/SelectCargo.vue"]]);
wx.createComponent(Component);

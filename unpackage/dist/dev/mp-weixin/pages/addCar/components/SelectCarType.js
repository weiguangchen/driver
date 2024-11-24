"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_dict = require("../../../utils/dict.js");
if (!Array) {
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_uv_input2 = common_vendor.resolveComponent("uv-input");
  const _easycom_my_drawer2 = common_vendor.resolveComponent("my-drawer");
  (_easycom_uv_image2 + _easycom_uv_input2 + _easycom_my_drawer2)();
}
const _easycom_uv_image = () => "../../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_uv_input = () => "../../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_my_drawer = () => "../../../components/my-drawer/my-drawer.js";
if (!Math) {
  (_easycom_uv_image + _easycom_uv_input + _easycom_my_drawer)();
}
const _sfc_main = {
  __name: "SelectCarType",
  props: {
    modelValue: {
      default: ""
    }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const {
      ctx
    } = common_vendor.getCurrentInstance();
    const props = __props;
    const emits = __emit;
    const options = common_vendor.ref(utils_dict.CarTypeDict);
    const text = common_vendor.ref();
    common_vendor.watchEffect(() => {
      const find = options.value.find((m) => m.value === props.modelValue);
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
        a: common_vendor.p({
          src: "/static/images/arrow.png",
          width: "18rpx",
          height: "18rpx",
          duration: 0
        }),
        b: common_vendor.p({
          value: text.value,
          ["input-align"]: "right",
          placeholder: "请选择",
          readonly: true,
          border: "none",
          ["placeholder-style"]: "color:var(--intr-color);"
        }),
        c: common_vendor.o(showDrawer),
        d: common_vendor.f(options.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.value === "自卸车"
          }, item.value === "自卸车" ? {
            b: "32163c27-3-" + i0 + ",32163c27-2",
            c: common_vendor.p({
              src: "/static/images/carType/car1.png",
              width: "100%",
              height: "100%",
              duration: 0
            })
          } : {}, {
            d: item.value === "半挂车"
          }, item.value === "半挂车" ? {
            e: "32163c27-4-" + i0 + ",32163c27-2",
            f: common_vendor.p({
              src: "/static/images/carType/car2.png",
              width: "100%",
              height: "100%",
              duration: 0
            })
          } : {}, {
            g: item.value === "罐车"
          }, item.value === "罐车" ? {
            h: "32163c27-5-" + i0 + ",32163c27-2",
            i: common_vendor.p({
              src: "/static/images/carType/car3.png",
              width: "100%",
              height: "100%",
              duration: 0
            })
          } : {}, {
            j: common_vendor.t(item.label),
            k: __props.modelValue === item.value
          }, __props.modelValue === item.value ? {
            l: "32163c27-6-" + i0 + ",32163c27-2",
            m: common_vendor.p({
              src: "/static/images/check.png",
              duration: 0,
              width: "32rpx",
              height: "32rpx"
            })
          } : {}, {
            n: __props.modelValue === item.value ? 1 : "",
            o: common_vendor.o(($event) => select(item))
          });
        }),
        e: common_vendor.sr(drawer, "32163c27-2", {
          "k": "drawer"
        }),
        f: common_vendor.p({
          title: "选择车辆类型"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-32163c27"], ["__file", "/Users/wei/driver/pages/addCar/components/SelectCarType.vue"]]);
wx.createComponent(Component);

"use strict";
const utils_dict = require("../../../utils/dict.js");
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "select-color",
  data() {
    return {
      ColorDict: utils_dict.ColorDict,
      text: ""
    };
  },
  props: {
    modelValue: {
      default: ""
    }
  },
  watch: {
    modelValue: {
      handler() {
        const find = utils_dict.ColorDict.find((m) => m.value === this.modelValue);
        console.log("find", find);
        if (find) {
          this.text = find.label;
        }
      },
      immediate: true
    }
  },
  methods: {
    showDrawer() {
      this.$refs.drawer.popup.open();
    },
    select(item) {
      this.$emit("change", item);
      this.$emit("update:modelValue", item.value);
      this.$nextTick(() => {
        this.$uv.formValidate(this, "change");
      });
      this.$refs.drawer.popup.close();
    }
  }
};
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      src: "/static/images/arrow.png",
      width: "18rpx",
      height: "18rpx",
      duration: 0
    }),
    b: common_vendor.o(($event) => $data.text = $event),
    c: common_vendor.p({
      ["input-align"]: "right",
      placeholder: "请选择",
      readonly: true,
      border: "none",
      ["placeholder-style"]: "color:var(--intr-color);",
      modelValue: $data.text
    }),
    d: common_vendor.o((...args) => $options.showDrawer && $options.showDrawer(...args)),
    e: common_vendor.f($data.ColorDict, (item, k0, i0) => {
      return common_vendor.e({
        a: item.value === "yellow" ? 1 : "",
        b: item.value === "kelly" ? 1 : "",
        c: item.value === "blue" ? 1 : "",
        d: item.value === "gren" ? 1 : "",
        e: common_vendor.t(item.label),
        f: $props.modelValue === item.value
      }, $props.modelValue === item.value ? {
        g: "7e16d024-3-" + i0 + ",7e16d024-2",
        h: common_vendor.p({
          src: "/static/images/check.png",
          duration: 0,
          width: "32rpx",
          height: "32rpx"
        })
      } : {}, {
        i: $props.modelValue === item.value ? 1 : "",
        j: common_vendor.o(($event) => $options.select(item))
      });
    }),
    f: common_vendor.sr("drawer", "7e16d024-2"),
    g: common_vendor.p({
      title: "选择车牌颜色"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/wei/driver/pages/addCar/components/SelectColor.vue"]]);
wx.createComponent(Component);

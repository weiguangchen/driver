"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uv_icon2 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_my_drawer2 = common_vendor.resolveComponent("my-drawer");
  (_easycom_uv_icon2 + _easycom_uv_image2 + _easycom_my_drawer2)();
}
const _easycom_uv_icon = () => "../../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_image = () => "../../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_my_drawer = () => "../../../components/my-drawer/my-drawer.js";
if (!Math) {
  (_easycom_uv_icon + _easycom_uv_image + _easycom_my_drawer)();
}
const _sfc_main = {
  __name: "my-select",
  props: {
    modelValue: {
      defalut: ""
    },
    title: {
      type: String,
      default: ""
    },
    options: {
      default: () => [],
      type: Array
    }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const drawer = common_vendor.ref();
    const record = common_vendor.ref(null);
    common_vendor.watchEffect(() => {
      var _a;
      if (props.options.length === 0)
        return;
      const find = props.options.find((m) => m.value === props.modelValue);
      if (find) {
        record.value = find;
      } else {
        const defaultItem = (_a = props.options) == null ? void 0 : _a[0];
        record.value = defaultItem;
        emits("update:modelValue", defaultItem.value);
      }
    });
    function openDrawer() {
      drawer.value.popup.open();
    }
    function selectType(item) {
      emits("update:modelValue", item.value);
      emits("change", item.value, item);
      drawer.value.popup.close();
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: record.value
      }, record.value ? {
        b: common_vendor.t(record.value.label)
      } : {}, {
        c: common_vendor.p({
          name: "arrow-down",
          size: "8",
          color: "#B0BECC"
        }),
        d: common_vendor.o(openDrawer),
        e: common_vendor.f(__props.options, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.label),
            b: item.value === __props.modelValue
          }, item.value === __props.modelValue ? {
            c: "5286764a-2-" + i0 + ",5286764a-1",
            d: common_vendor.p({
              src: "/static/images/check.png",
              duration: 0,
              width: "32rpx",
              height: "32rpx"
            })
          } : {}, {
            e: item.value === __props.modelValue ? 1 : "",
            f: common_vendor.o(($event) => selectType(item))
          });
        }),
        f: common_vendor.sr(drawer, "5286764a-1", {
          "k": "drawer"
        }),
        g: common_vendor.p({
          title: __props.title
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/statistics/components/my-select.vue"]]);
wx.createComponent(Component);

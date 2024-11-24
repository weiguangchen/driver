"use strict";
const common_vendor = require("../../common/vendor.js");
const __default__ = {
  options: {
    virtualHost: true
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "my-plate",
  props: {
    customStyle: {
      default: () => {
      },
      type: Object
    },
    plate: {
      default: "京ATY8902",
      type: String
    },
    color: {
      default: "yellow",
      validator(value, props) {
        return ["yellow", "kelly", "blue", "gren"].includes(value);
      }
    }
  },
  setup(__props) {
    const props = __props;
    const left = common_vendor.ref();
    const right = common_vendor.ref();
    common_vendor.watchEffect(() => {
      if (!props.plate)
        return;
      left.value = props.plate.slice(0, 2);
      right.value = props.plate.slice(2);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(left.value),
        b: common_vendor.t(right.value),
        c: common_vendor.n(__props.color),
        d: common_vendor.s(__props.customStyle)
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/components/my-plate/my-plate.vue"]]);
wx.createComponent(Component);

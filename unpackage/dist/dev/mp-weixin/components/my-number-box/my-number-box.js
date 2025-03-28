"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../uni_modules/uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../uni_modules/uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvNumberBox_components_uvNumberBox_props = require("../../uni_modules/uv-number-box/components/uv-number-box/props.js");
const _sfc_main = {
  name: "uv-number-box",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvNumberBox_components_uvNumberBox_props.props],
  props: {
    min: {
      default: 0,
      type: Number
    },
    unit: {
      default: "吨",
      type: String
    },
    minLimitMsg: {
      default: null,
      type: Function
    },
    maxLimitMsg: {
      default: null,
      type: Function
    }
  },
  data() {
    return {
      // 输入框实际操作的值
      currentValue: "",
      // 定时器
      longPressTimer: null
    };
  },
  watch: {
    // 多个值之间，只要一个值发生变化，都要重新检查check()函数
    watchChange(n) {
      this.check();
    },
    value(newVal) {
      if (newVal !== this.currentValue) {
        this.currentValue = this.format(this.value);
      }
    },
    modelValue(newVal) {
      this.currentValue = this.formatter(this.format(this.modelValue));
    }
  },
  computed: {
    getCursorSpacing() {
      return this.$uv.getPx(this.cursorSpacing);
    },
    // 按钮的样式
    buttonStyle() {
      return (type) => {
        const style = {
          // height: this.$uv.addUnit(this.buttonSize),
          color: this.color
        };
        if (this.isDisabled(type)) {
          style.backgroundColor = "#f7f8fa";
        }
        return style;
      };
    },
    // 输入框的样式
    inputStyle() {
      this.disabled || this.disabledInput;
      const style = {
        color: this.color
        // backgroundColor: this.bgColor,
        // height: this.$uv.addUnit(this.buttonSize),
        // width: this.$uv.addUnit(this.inputWidth)
      };
      return style;
    },
    // 用于监听多个值发生变化
    watchChange() {
      return [this.integer, this.decimalLength, this.min, this.max];
    },
    isDisabled() {
      return (type) => {
        const value = this.filter(this.currentValue);
        const newVal = value === "" ? 0 : +value;
        if (type === "plus") {
          return this.disabled || this.disablePlus || newVal >= this.max;
        }
        return this.disabled || this.disableMinus || newVal <= this.min;
      };
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const value = this.value || this.modelValue;
      let val = this.format(value);
      this.currentValue = this.formatter(val);
    },
    // 格式化整理数据，限制范围
    format(value) {
      value = this.filter(value);
      value = value === "" ? 0 : +value;
      console.log("max", this.max, "min", this.min, "value", value);
      if (common_vendor.Big(value || 0).gt(this.max || 0)) {
        let maxMsg = `最大值为${this.max}`;
        if (this.maxLimitMsg && typeof this.maxLimitMsg === "function") {
          maxMsg = this.maxLimitMsg(this.max);
        }
        common_vendor.index.showToast({
          title: maxMsg,
          icon: "none"
        });
      }
      if (common_vendor.Big(value || 0).lt(this.min || 0)) {
        let minMsg = `最小值为${this.min}`;
        if (this.minLimitMsg && typeof this.minLimitMsg === "function") {
          minMsg = this.minLimitMsg(this.min);
        }
        common_vendor.index.showToast({
          title: minMsg,
          icon: "none"
        });
      }
      value = Math.max(Math.min(this.max, value), this.min);
      if (this.decimalLength !== null) {
        value = value.toFixed(this.decimalLength);
      }
      return value;
    },
    formatter(value) {
      return value;
    },
    // 过滤非法的字符
    filter(value) {
      value = String(value).replace(/[^0-9.-]/g, "");
      if (this.integer && value.indexOf(".") !== -1) {
        value = value.split(".")[0];
      }
      return value;
    },
    check() {
      const val = this.format(this.currentValue);
      if (val !== this.currentValue) {
        this.currentValue = val;
      }
    },
    // 输入框活动焦点
    onFocus(event) {
      this.$emit("focus", {
        ...event.detail,
        name: this.name
      });
    },
    // 输入框失去焦点
    onBlur(event) {
      let value = this.format(event.detail.value);
      if (!this.asyncChange) {
        console.log("onBlur", value);
        this.$nextTick(() => {
          this.$emit("input", value);
          this.$emit("update:modelValue", value);
          this.currentValue = this.formatter(value);
          this.$forceUpdate();
        });
      }
      this.$emit(
        "blur",
        {
          ...event.detail,
          name: this.name
        }
      );
    },
    // 输入框值发生变化
    onInput(e) {
      const {
        value = ""
      } = e.detail || {};
      this.filter(value);
    },
    // 发出change事件
    emitChange(value) {
      if (!this.asyncChange) {
        this.$nextTick(() => {
          this.$emit("input", value);
          this.$emit("update:modelValue", value);
          this.currentValue = this.formatter(value);
          this.$forceUpdate();
        });
      }
      this.$emit("change", {
        value,
        name: this.name
      });
    },
    onChange() {
      const {
        type
      } = this;
      if (this.isDisabled(type)) {
        return this.$emit("overlimit", type);
      }
      const diff = type === "minus" ? -this.step : +this.step;
      const inputValue = this.filter(this.currentValue);
      let value = this.format(this.add(+inputValue, diff));
      this.emitChange(value);
      this.$emit(type);
    },
    // 对值扩大后进行四舍五入，再除以扩大因子，避免出现浮点数操作的精度问题
    add(num1, num2) {
      const cardinal = Math.pow(10, 10);
      return Math.round((num1 + num2) * cardinal) / cardinal;
    },
    // 点击加减按钮
    clickHandler(type) {
      this.type = type;
      this.onChange();
    },
    longPressStep() {
      this.clearTimeout();
      this.longPressTimer = setTimeout(() => {
        this.onChange();
        this.longPressStep();
      }, 250);
    },
    onTouchStart(type) {
      if (!this.longPress)
        return;
      this.clearTimeout();
      this.type = type;
      this.longPressTimer = setTimeout(() => {
        this.onChange();
        this.longPressStep();
      }, 600);
    },
    // 触摸结束，清除定时器，停止长按加减
    onTouchEnd() {
      if (!this.longPress)
        return;
      this.clearTimeout();
    },
    // 清除定时器
    clearTimeout() {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    },
    clickUnit() {
      console.log(this.$refs["inputRef"]);
    }
  }
};
if (!Array) {
  const _easycom_uv_icon2 = common_vendor.resolveComponent("uv-icon");
  _easycom_uv_icon2();
}
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
if (!Math) {
  _easycom_uv_icon();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.showMinus && _ctx.$slots.minus
  }, _ctx.showMinus && _ctx.$slots.minus ? {
    b: common_vendor.o(($event) => $options.clickHandler("minus")),
    c: common_vendor.o(($event) => $options.onTouchStart("minus")),
    d: common_vendor.o((...args) => $options.clearTimeout && $options.clearTimeout(...args))
  } : _ctx.showMinus ? {
    f: common_vendor.p({
      name: "minus",
      color: $options.isDisabled("minus") ? "#c8c9cc" : "var(--title-color)",
      size: "15",
      bold: true,
      customStyle: _ctx.iconStyle
    }),
    g: common_vendor.o(($event) => $options.clickHandler("minus")),
    h: common_vendor.o(($event) => $options.onTouchStart("minus")),
    i: common_vendor.o((...args) => $options.clearTimeout && $options.clearTimeout(...args)),
    j: $options.isDisabled("minus") ? 1 : "",
    k: common_vendor.s($options.buttonStyle("minus"))
  } : {}, {
    e: _ctx.showMinus,
    l: _ctx.disabledInput || _ctx.disabled,
    m: $options.getCursorSpacing,
    n: _ctx.disabled || _ctx.disabledInput ? 1 : "",
    o: common_vendor.o((...args) => $options.onBlur && $options.onBlur(...args)),
    p: common_vendor.o((...args) => $options.onFocus && $options.onFocus(...args)),
    q: common_vendor.o([($event) => $data.currentValue = $event.detail.value, (...args) => $options.onInput && $options.onInput(...args)]),
    r: common_vendor.s($options.inputStyle),
    s: $data.currentValue,
    t: common_vendor.t($props.unit),
    v: _ctx.showPlus && _ctx.$slots.plus
  }, _ctx.showPlus && _ctx.$slots.plus ? {
    w: common_vendor.o(($event) => $options.clickHandler("plus")),
    x: common_vendor.o(($event) => $options.onTouchStart("plus")),
    y: common_vendor.o((...args) => $options.clearTimeout && $options.clearTimeout(...args))
  } : _ctx.showPlus ? {
    A: common_vendor.p({
      name: "plus",
      color: $options.isDisabled("plus") ? "#c8c9cc" : "var(--title-color)",
      size: "15",
      bold: true,
      customStyle: _ctx.iconStyle
    }),
    B: common_vendor.o(($event) => $options.clickHandler("plus")),
    C: common_vendor.o(($event) => $options.onTouchStart("plus")),
    D: common_vendor.o((...args) => $options.clearTimeout && $options.clearTimeout(...args)),
    E: $options.isDisabled("plus") ? 1 : "",
    F: common_vendor.s($options.buttonStyle("plus"))
  } : {}, {
    z: _ctx.showPlus
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9664249b"], ["__file", "/Users/wei/driver/components/my-number-box/my-number-box.vue"]]);
wx.createComponent(Component);

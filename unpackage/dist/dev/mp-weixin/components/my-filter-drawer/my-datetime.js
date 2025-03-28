"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uv_icon2 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_line2 = common_vendor.resolveComponent("uv-line");
  const _easycom_uv_datetime_picker2 = common_vendor.resolveComponent("uv-datetime-picker");
  (_easycom_uv_icon2 + _easycom_uv_line2 + _easycom_uv_datetime_picker2)();
}
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_line = () => "../../uni_modules/uv-line/components/uv-line/uv-line.js";
const _easycom_uv_datetime_picker = () => "../../uni_modules/uv-datetime-picker/components/uv-datetime-picker/uv-datetime-picker.js";
if (!Math) {
  (_easycom_uv_icon + _easycom_uv_line + _easycom_uv_datetime_picker)();
}
const _sfc_main = {
  __name: "my-datetime",
  props: {
    modelValue: {
      default: () => [],
      type: Array
    },
    disabled: {
      default: false,
      type: Boolean
    }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const startDate = common_vendor.ref();
    const endDate = common_vendor.ref();
    const dateType = common_vendor.ref("start");
    const datetimePicker = common_vendor.ref();
    const minDate = common_vendor.ref("2000-01-01");
    const maxDate = common_vendor.ref("2049-12-31");
    common_vendor.dayjs();
    common_vendor.dayjs().add(1, "year").valueOf();
    const dateTime = common_vendor.ref();
    common_vendor.watchEffect(() => {
      console.log("modelValue", props.modelValue);
      const [start, end] = props.modelValue;
      startDate.value = start;
      endDate.value = end;
    });
    function formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      }
      if (type === "month") {
        return `${value}月`;
      }
      if (type === "day") {
        return `${value}日`;
      }
      return value;
    }
    function selectDate(type) {
      if (props.disabled)
        return;
      dateType.value = type;
      if (type === "start") {
        dateTime.value = startDate.value || common_vendor.dayjs().format("YYYY-MM-DD");
      }
      if (type === "end") {
        dateTime.value = endDate.value || common_vendor.dayjs().format("YYYY-MM-DD");
      }
      datetimePicker.value.open();
    }
    function confirmDateTime({
      value
    }) {
      const val = common_vendor.dayjs(value).format("YYYY-MM-DD");
      if (dateType.value === "start") {
        if (endDate.value) {
          if (common_vendor.dayjs(val).isAfter(endDate.value)) {
            startDate.value = endDate.value;
            endDate.value = val;
          } else {
            startDate.value = val;
          }
        } else {
          startDate.value = val;
        }
      }
      if (dateType.value === "end") {
        if (startDate.value) {
          if (common_vendor.dayjs(val).isBefore(startDate.value)) {
            endDate.value = startDate.value;
            startDate.value = val;
          } else {
            endDate.value = val;
          }
        } else {
          endDate.value = val;
        }
      }
      const date = [(startDate == null ? void 0 : startDate.value) ?? "", (endDate == null ? void 0 : endDate.value) ?? ""];
      console.log("confirmDateTime", date);
      emits("update:modelValue", date);
      emits("change", date);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(startDate.value || "开始时间"),
        b: !__props.disabled
      }, !__props.disabled ? {
        c: common_vendor.p({
          name: "arrow-down",
          size: "8",
          color: "#B0BECC"
        })
      } : {}, {
        d: startDate.value ? 1 : "",
        e: common_vendor.o(($event) => selectDate("start")),
        f: common_vendor.p({
          color: "#C8D4DF",
          length: "20rpx",
          margin: "0 20rpx"
        }),
        g: common_vendor.t(endDate.value || "结束时间"),
        h: !__props.disabled
      }, !__props.disabled ? {
        i: common_vendor.p({
          name: "arrow-down",
          size: "8",
          color: "#B0BECC"
        })
      } : {}, {
        j: endDate.value ? 1 : "",
        k: common_vendor.o(($event) => selectDate("end")),
        l: common_vendor.sr(datetimePicker, "53d1aaa0-3", {
          "k": "datetimePicker"
        }),
        m: common_vendor.o(confirmDateTime),
        n: common_vendor.o(($event) => dateTime.value = $event),
        o: common_vendor.p({
          mode: "date",
          confirmColor: "var(--main-color)",
          ["min-date"]: minDate.value,
          ["max-date"]: maxDate.value,
          formatter,
          modelValue: dateTime.value
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/components/my-filter-drawer/my-datetime.vue"]]);
wx.createComponent(Component);

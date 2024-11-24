"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uv_icon2 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_line2 = common_vendor.resolveComponent("uv-line");
  const _easycom_uv_datetime_picker2 = common_vendor.resolveComponent("uv-datetime-picker");
  (_easycom_uv_icon2 + _easycom_uv_line2 + _easycom_uv_datetime_picker2)();
}
const _easycom_uv_icon = () => "../../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_line = () => "../../../uni_modules/uv-line/components/uv-line/uv-line.js";
const _easycom_uv_datetime_picker = () => "../../../uni_modules/uv-datetime-picker/components/uv-datetime-picker/uv-datetime-picker.js";
if (!Math) {
  (_easycom_uv_icon + _easycom_uv_line + _easycom_uv_datetime_picker)();
}
const _sfc_main = {
  __name: "my-datetime",
  props: {
    modelValue: {
      default: () => [],
      type: Array
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
    const minDate = common_vendor.ref();
    const maxDate = common_vendor.ref();
    const min = common_vendor.dayjs();
    const max = common_vendor.dayjs().add(1, "year").valueOf();
    const dateTime = common_vendor.ref();
    common_vendor.watchEffect(() => {
      const [start, end] = props.modelValue;
      startDate.value = start;
      endDate.value = end;
    });
    const getMinDate = common_vendor.computed(() => {
      if (!startDate.value)
        return common_vendor.dayjs(min).valueOf();
      return common_vendor.dayjs(startDate.value).isAfter(min) ? common_vendor.dayjs(startDate.value).valueOf() : common_vendor.dayjs(min).valueOf();
    });
    const getMaxDate = common_vendor.computed(() => {
      if (!endDate.value)
        return common_vendor.dayjs(max).valueOf();
      return common_vendor.dayjs(endDate.value).isBefore(max) ? common_vendor.dayjs(endDate.value).valueOf() : common_vendor.dayjs(max).valueOf();
    });
    function selectDate(type) {
      dateType.value = type;
      if (type === "start") {
        minDate.value = min.valueOf();
        maxDate.value = getMaxDate.value;
      }
      if (type === "end") {
        minDate.value = getMinDate.value;
        maxDate.value = max.valueOf();
      }
      datetimePicker.value.open();
    }
    function confirmDateTime({
      value
    }) {
      const val = common_vendor.dayjs(value).format("YYYY-MM-DD");
      if (dateType.value === "start") {
        startDate.value = val;
      }
      if (dateType.value === "end") {
        endDate.value = val;
      }
      const date = [(startDate == null ? void 0 : startDate.value) ?? "", (endDate == null ? void 0 : endDate.value) ?? ""];
      emits("update:modelValue", date);
      emits("change", date);
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(startDate.value || "开始时间"),
        b: common_vendor.p({
          name: "arrow-down",
          size: "8",
          color: "#B0BECC"
        }),
        c: common_vendor.o(($event) => selectDate("start")),
        d: common_vendor.p({
          color: "#C8D4DF",
          length: "20rpx",
          margin: "0 20rpx"
        }),
        e: common_vendor.t(endDate.value || "结束时间"),
        f: common_vendor.p({
          name: "arrow-down",
          size: "8",
          color: "#B0BECC"
        }),
        g: common_vendor.o(($event) => selectDate("end")),
        h: common_vendor.sr(datetimePicker, "9ed9606e-3", {
          "k": "datetimePicker"
        }),
        i: common_vendor.o(confirmDateTime),
        j: common_vendor.o(($event) => dateTime.value = $event),
        k: common_vendor.p({
          mode: "date",
          confirmColor: "var(--main-color)",
          ["min-date"]: minDate.value,
          ["max-date"]: maxDate.value,
          modelValue: dateTime.value
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/statistics/components/my-datetime.vue"]]);
wx.createComponent(Component);

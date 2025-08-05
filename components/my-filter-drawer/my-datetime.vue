<template>
  <view class="date-range">
    <view
      class="start-date"
      :class="{ active: startDate }"
      @click="selectDate('start')"
    >
      {{ startDate || "开始时间" }}
      <uv-icon name="arrow-down" size="8" color="#B0BECC" v-if="!disabled" />
    </view>
    <uv-line color="#C8D4DF" length="20rpx" margin="0 20rpx" />
    <view
      class="end-date"
      :class="{ active: endDate }"
      @click="selectDate('end')"
    >
      {{ endDate || "结束时间" }}
      <uv-icon name="arrow-down" size="8" color="#B0BECC" v-if="!disabled" />
    </view>
  </view>

  <!-- 时间类型 -->
  <root-portal>
    <uv-datetime-picker
      ref="datetimePicker"
      v-model="dateTime"
      mode="date"
      confirmColor="var(--main-color)"
      :min-date="minDate"
      :max-date="maxDate"
      :formatter="formatter"
      @confirm="confirmDateTime"
    />
  </root-portal>
</template>

<script setup>
import { ref, onMounted, watchEffect, computed } from "vue";
import dayjs from "dayjs";
const props = defineProps({
  modelValue: {
    default: () => [],
    type: Array,
  },
  disabled: {
    default: false,
    type: Boolean,
  },
  min: {
    type: Number,
  },
  max: {
    type: Number,
  },
});
const emits = defineEmits(["update:modelValue", "change"]);

const startDate = ref();
const endDate = ref();
const dateType = ref("start");
const datetimePicker = ref();
const minDate = ref("");
const maxDate = ref("");
watchEffect(() => {
  minDate.value = props.min
    ? dayjs(props.min).valueOf()
    : dayjs("2020-01-01").valueOf();
  maxDate.value = props.max ? dayjs(props.max).valueOf() : dayjs().valueOf();
  console.log("minDate", minDate.value, maxDate.value);
});
// 时间范围
const dateTime = ref();

watchEffect(() => {
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
  if (props.disabled) return;
  dateType.value = type;
  if (type === "start") {
    dateTime.value = startDate.value || dayjs().format("YYYY-MM-DD");
  }
  if (type === "end") {
    dateTime.value = endDate.value || dayjs().format("YYYY-MM-DD");
  }
  datetimePicker.value.open();
}

function confirmDateTime({ value }) {
  const val = dayjs(value).format("YYYY-MM-DD");

  if (dateType.value === "start") {
    if (endDate.value) {
      if (dayjs(val).isAfter(endDate.value)) {
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
      if (dayjs(val).isBefore(startDate.value)) {
        endDate.value = startDate.value;
        startDate.value = val;
      } else {
        endDate.value = val;
      }
    } else {
      endDate.value = val;
    }
  }
  const date = [startDate?.value ?? "", endDate?.value ?? ""];
  console.log("confirmDateTime", date);
  emits("update:modelValue", date);
  emits("change", date);
}
</script>

<style lang="scss">
.date-range {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
  padding: 0 10rpx;

  .start-date,
  .end-date {
    width: 300rpx;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--intr-color);
    padding: 0 32rpx;
    height: 72rpx;
    background: #ffffff;
    border-radius: 36rpx;
    border: 2rpx solid var(--divider);
    font-size: 26rpx;
    line-height: 48rpx;

    &--active {
      opacity: 0.45;
    }
    &.active {
      color: var(--title-color);
    }
  }
}
</style>

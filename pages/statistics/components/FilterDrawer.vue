<template>
  <view class="filter" @click="open">
    <uv-image
      src="/static/images/filter/filter.png"
      width="32rpx"
      height="32rpx"
    />
  </view>

  <my-drawer ref="filter" title="数据统计" height="550" @change="visibleChange">
    <view class="filter-wrapper">
      <view class="filter-title">时间范围</view>
      <uv-row customStyle="margin-bottom: 24rpx" gutter="20rpx">
        <uv-col span="4">
          <view
            class="date-box"
            :class="{ active: params.dateMode === '今天' }"
            hover-class="select-box--active"
            hover-start-time="0"
            hover-stay-time="200"
            @click="setDateMode('今天')"
            >今天</view
          >
        </uv-col>
        <uv-col span="4">
          <view
            class="date-box"
            :class="{ active: params.dateMode === '昨天' }"
            hover-class="select-box--active"
            hover-start-time="0"
            hover-stay-time="200"
            @click="setDateMode('昨天')"
            >昨天</view
          >
        </uv-col>
        <uv-col span="4">
          <view
            class="date-box"
            :class="{ active: params.dateMode === '本月' }"
            hover-class="select-box--active"
            hover-start-time="0"
            hover-stay-time="200"
            @click="setDateMode('本月')"
          >
            本月</view
          >
        </uv-col>
      </uv-row>
      <uv-row customStyle="margin-bottom: 24rpx" gutter="20rpx">
        <uv-col span="4">
          <view
            class="date-box"
            :class="{ active: params.dateMode === '近7天' }"
            hover-class="select-box--active"
            hover-start-time="0"
            hover-stay-time="200"
            @click="setDateMode('近7天')"
            >近 7 天</view
          >
        </uv-col>
        <uv-col span="4">
          <view
            class="date-box"
            :class="{ active: params.dateMode === '近30天' }"
            hover-class="select-box--active"
            hover-start-time="0"
            hover-stay-time="200"
            @click="setDateMode('近30天')"
            >近 30 天</view
          >
        </uv-col>
        <uv-col span="4">
          <view
            class="date-box"
            :class="{ active: params.dateMode === '自定义时间' }"
            hover-class="select-box--active"
            hover-start-time="0"
            hover-stay-time="200"
            @click="setDateMode('自定义时间')"
            >自定义时间</view
          >
        </uv-col>
      </uv-row>
      <MyDatetime
        v-if="params.dateMode === '自定义时间'"
        v-model="date"
        :min="minDate"
        @change="changeDate"
      />
      <view class="filter-title">车辆信息</view>
      <MySelect
        :disabled="!props.supplyId"
        :options="carOptions"
        :allowEmpty="props.supplyId ? true : false"
        v-model="params.carno"
        title="车辆信息"
        placeholder="全部车辆信息"
      />
    </view>

    <template #footer>
      <view class="btn-group">
        <view class="left">
          <uv-button
            text="重置"
            :custom-style="{
              height: '96rpx',
              color: 'var(--sub-color)',
              borderRadius: '16rpx',
              fontSize: '30rpx',
              fontWeight: 'bold',
            }"
            @click="reset"
          ></uv-button>
        </view>
        <view class="right">
          <uv-button
            text="筛选"
            color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%)"
            :custom-style="{
              height: '96rpx',
              borderRadius: '16rpx',
              fontSize: '30rpx',
              fontWeight: 'bold',
            }"
            @click="submit"
          ></uv-button>
        </view>
      </view>
    </template>
  </my-drawer>
</template>

<script setup>
import { ref, unref, watchEffect, computed, nextTick, onMounted } from "vue";
import MyDatetime from "@/components/my-filter-drawer/my-datetime.vue";
import MySelect from "@/components/my-filter-drawer/my-select.vue";
import dayjs from "dayjs";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  carOptions: {
    type: Array,
    default: () => [],
  },
  supplyId: {
    type: String,
    default: "",
  },
});
const emits = defineEmits(["change", "update:modelValue", "visibleChange"]);
function visibleChange(res) {
  emits("visibleChange", res.show);
}

const minDate = computed(() => {
  return dayjs().subtract(1, "year").add(1, "day").valueOf();
});

const filter = ref();
const params = ref({
  dateMode: "",
  carno: "",
});
const date = ref([]);
function open() {
  filter.value.popup.open();
}
// 接单时间
watchEffect(() => {
  console.log("watchEffect", props.modelValue);
  const { startTime, endTime } = props.modelValue;
  date.value = [startTime, endTime];
  params.value = { ...props.modelValue };
});
async function setDateMode(mode) {
  if (mode === "今天") {
    date.value = [dayjs().format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")];
  }
  if (mode === "昨天") {
    date.value = [
      dayjs().subtract(1, "day").format("YYYY-MM-DD"),
      dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    ];
  }
  if (mode === "本月") {
    date.value = [
      dayjs().startOf("month").format("YYYY-MM-DD"),
      dayjs().format("YYYY-MM-DD"),
    ];
  }
  if (mode === "近7天") {
    date.value = [
      dayjs().subtract(6, "day").format("YYYY-MM-DD"),
      dayjs().format("YYYY-MM-DD"),
    ];
  }
  if (mode === "近30天") {
    date.value = [
      dayjs().subtract(29, "day").format("YYYY-MM-DD"),
      dayjs().format("YYYY-MM-DD"),
    ];
  }
  if (mode === "自定义时间") {
    date.value = [unref(params).startTime, unref(params).endTime];
  }

  params.value.dateMode = mode;
  await nextTick();
  filter.value.resize();
}
function changeDate(date) {
  console.log(date);
}

function reset() {
  params.value = {
    carno: props.carOptions.length === 1 ? props.carOptions?.[0]?.value : "",
    dateMode: "今天",
    startTime: dayjs().format("YYYY-MM-DD"),
    endTime: dayjs().format("YYYY-MM-DD"),
  };
  date.value = [dayjs().format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")];
  emits("change", unref(params));
  emits("update:modelValue", unref(params));
  filter.value.popup.close();
}
function submit() {
  console.log("submit", date.value);
  params.value = {
    carno: params.value.carno,
    dateMode: params.value.dateMode,
    startTime: date.value?.[0] ?? "",
    endTime: date.value?.[1] ?? "",
  };
  console.log("params", params);
  emits("change", unref(params));
  emits("update:modelValue", unref(params));
  filter.value.popup.close();
}

defineExpose({
  open,
  reset,
});
</script>

<style lang="scss">
.filter {
  margin-left: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  background: #ffffff;
  border-radius: 50%;
  border: 1rpx solid rgba(151, 151, 151, 0.2);

  &.active {
    background: #31ce57;
    border: none;
  }
}
.filter-wrapper {
  padding: 0 24rpx;

  .filter-title {
    font-weight: bold;
    font-size: 30rpx;
    color: var(--title-color);
    line-height: 48rpx;
    margin-bottom: 16rpx;
    padding-left: 8rpx;
  }

  .date-range {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
    padding: 0 10rpx;

    .start-date,
    .end-date {
      justify-content: space-between;
      width: 300rpx;
      flex: none;
      color: var(--intr-color);
    }
  }

  .date-box,
  .start-date,
  .end-date {
    display: flex;
    align-items: center;
    justify-content: center;
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
      background: linear-gradient(270deg, #31ce57 0%, #07b130 100%);
      color: #ffffff;
      border: none;
    }
  }
}

.btn-group {
  display: flex;

  .left {
    width: 192rpx;
    margin-right: 20rpx;
  }

  .right {
    flex: 1;
  }
}
</style>

<template>
  <view class="filter" :class="{ active: isFilter }" @click="open">
    <uv-image
      v-if="!isFilter"
      src="/static/images/filter/filter.png"
      width="32rpx"
      height="32rpx"
    />
    <uv-image
      v-else
      src="/static/images/filter/filter-selected.png"
      width="32rpx"
      height="32rpx"
    />
  </view>

  <my-drawer ref="filter" title="运单筛选" height="550" @change="change">
    <view class="filter-wrapper">
      <uv-row customStyle="margin-bottom: 24rpx" gutter="20rpx">
        <uv-col span="12" @click="openType">
          <MySelect
            :options="typeOptions"
            v-model="dtType"
            title="选择类型"
            :allowEmpty="false"
          />
        </uv-col>
      </uv-row>
      <view class="filter-title">时间范围</view>
      <uv-row customStyle="margin-bottom: 24rpx" gutter="20rpx">
        <uv-col span="4">
          <view
            class="date-box"
            :class="{ active: dateMode === '全部时间' }"
            hover-class="select-box--active"
            hover-start-time="0"
            hover-stay-time="200"
            @click="setDateMode('全部时间')"
            >全部时间</view
          >
        </uv-col>
        <uv-col span="4">
          <view
            class="date-box"
            :class="{ active: dateMode === '今天' }"
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
            :class="{ active: dateMode === '昨天' }"
            hover-class="select-box--active"
            hover-start-time="0"
            hover-stay-time="200"
            @click="setDateMode('昨天')"
            >昨天</view
          >
        </uv-col>
      </uv-row>
      <uv-row customStyle="margin-bottom: 24rpx" gutter="20rpx">
        <uv-col span="4">
          <view
            class="date-box"
            :class="{ active: dateMode === '本月' }"
            hover-class="select-box--active"
            hover-start-time="0"
            hover-stay-time="200"
            @click="setDateMode('本月')"
          >
            本月</view
          >
        </uv-col>
        <uv-col span="4">
          <view
            class="date-box"
            :class="{ active: dateMode === '近7天' }"
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
            :class="{ active: dateMode === '自定义时间' }"
            hover-class="select-box--active"
            hover-start-time="0"
            hover-stay-time="200"
            @click="setDateMode('自定义时间')"
            >自定义时间</view
          >
        </uv-col>
      </uv-row>
      <MyDatetime
        v-if="dateMode === '自定义时间'"
        v-model="date"
        @change="changeDate"
      />
      <view class="filter-title">装货信息</view>
      <uv-row customStyle="margin-bottom: 24rpx" gutter="20rpx">
        <uv-col span="6">
          <MySelect
            :options="mfrsOptions"
            v-model="supplyId"
            title="选择装货厂家"
            placeholder="全部装货厂家"
            @change="changeMfrs"
          />
        </uv-col>
        <uv-col span="6">
          <MySelect
            :options="materialOptions"
            v-model="materialId"
            title="选择物料"
            :disabled="!supplyId"
            @disabled-click="disabledClick"
            placeholder="全部物料"
          />
        </uv-col>
      </uv-row>
      <view class="filter-title">卸货信息</view>
      <uv-row customStyle="margin-bottom: 24rpx" gutter="20rpx">
        <uv-col span="12">
          <MySelect
            :options="dischargeOptions"
            v-model="unloadId"
            title="选择卸货地"
            placeholder="全部卸货地"
          />
        </uv-col>
      </uv-row>
      <view class="filter-title">货主信息</view>
      <uv-row customStyle="margin-bottom: 24rpx" gutter="20rpx">
        <uv-col span="12">
          <MySelect
            :options="cargoOptions"
            v-model="ownerId"
            title="选择货主"
            placeholder="全部货主公司"
            :disabled="!supplyId"
            @disabled-click="disabledClick"
          />
        </uv-col>
      </uv-row>
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

  <!-- 时间类型 -->
  <uv-datetime-picker
    ref="datetimePicker"
    mode="date"
    confirmColor="var(--main-color)"
    @confirm="confirmDateTime"
    :min-date="minDate"
    :max-date="maxDate"
  />
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import MySelect from "@/components/my-filter-drawer/my-select.vue";
import MyDatetime from "@/components/my-filter-drawer/my-datetime.vue";
import dayjs from "dayjs";
import { getToken } from "@/utils/token.js";
import {
  GetSupplyListByDriver,
  GetOwnerMaterialsList,
  GetDriverUnloadPlace,
  GetOwnerByDriver,
} from "@/api/index.js";

const emits = defineEmits(["change", "visibleChange"]);
function change(show) {
  emits("visibleChange", show);
}

onMounted(() => {
  console.log("onMounted");
  if (!getToken()) return;
  getMfrsOptions();
  getUnloadOptions();
});

const filter = ref();
const params = ref({});
const isFilter = computed(() => {
  const { dtType, dateMode, date, ...rest } = params.value;
  return Object.keys(rest).some((m) => rest[m]);
});

function open() {
  if (!getToken()) {
    return;
  }
  date.value = params.value.date ?? [];
  dateMode.value = params.value.dateMode ?? "全部时间";
  dtType.value = params.value.dtType ?? 1;
  supplyId.value = params.value.supplyId ?? "";
  materialId.value = params.value.materialId ?? "";
  unloadId.value = params.value.unloadId ?? "";
  ownerId.value = params.value.ownerId ?? "";
  filter.value.popup.open();
}
// 选择查看类型
const typeOptions = ref([
  {
    label: "按 接单时间 筛选",
    value: 1,
  },
  {
    label: "按 完成时间 筛选",
    value: 2,
  },
  {
    label: "按 取消时间 筛选",
    value: 3,
  },
]);
const dtType = ref(1);
// 接单时间
const dateMode = ref("全部时间");
const date = ref([]);
async function setDateMode(mode) {
  if (mode === "全部时间") {
    date.value = [];
  }
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
      dayjs().endOf("month").format("YYYY-MM-DD"),
    ];
  }
  if (mode === "近7天") {
    date.value = [
      dayjs().subtract(7, "day").format("YYYY-MM-DD"),
      dayjs().format("YYYY-MM-DD"),
    ];
  }
  if (mode === "自定义时间") {
    if (dateMode.value === "今天") {
      date.value = [dayjs().format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")];
    } else if (dateMode.value === "昨天") {
      date.value = [
        dayjs().subtract(1, "day").format("YYYY-MM-DD"),
        dayjs().subtract(1, "day").format("YYYY-MM-DD"),
      ];
    } else if (dateMode.value === "本月") {
      date.value = [
        dayjs().startOf("month").format("YYYY-MM-DD"),
        dayjs().endOf("month").format("YYYY-MM-DD"),
      ];
    } else if (dateMode.value === "近7天") {
      date.value = [
        dayjs().subtract(7, "day").format("YYYY-MM-DD"),
        dayjs().format("YYYY-MM-DD"),
      ];
    } else {
      date.value = [];
    }
  }

  dateMode.value = mode;
  await nextTick();
  filter.value.resize();
}
function changeDate(date) {
  console.log(date);
}
// 装货厂家
const mfrsOptions = ref([]);
const supplyId = ref("");
function changeMfrs(val) {
  materialId.value = "";
  ownerId.value = "";
  getMaterialOptions();
  getOwnerOptions();
}
async function getMfrsOptions() {
  try {
    const res = await GetSupplyListByDriver();
    mfrsOptions.value = res.map((item) => ({
      label: item.Name,
      value: item.Id,
    }));
  } catch (error) {
    console.log(error);
  }
}
function disabledClick() {
  uni.showToast({
    title: "请先选择装货厂家",
    icon: "none",
  });
}
// 物料
const materialOptions = ref([
  {
    label: "全部物料",
    value: "",
  },
]);
const materialId = ref("");
async function getMaterialOptions() {
  try {
    const res = await GetOwnerMaterialsList({
      supplyId: supplyId.value,
    });
    materialOptions.value = res.map((item) => ({
      label: item.MaterialName,
      value: item.MaterialId,
    }));
  } catch (error) {
    console.log(error);
  }
}
// 卸货信息
const dischargeOptions = ref([]);
const unloadId = ref("");
async function getUnloadOptions() {
  try {
    const res = await GetDriverUnloadPlace();
    dischargeOptions.value = res.map((item) => ({
      label: item.PlaceName,
      value: item.Id,
    }));
  } catch (error) {
    console.log(error);
  }
}
// 货主信息
const cargoOptions = ref([]);
const ownerId = ref("");
async function getOwnerOptions() {
  try {
    const res = await GetOwnerByDriver({
      supplyId: supplyId.value,
    });
    cargoOptions.value = res.map((item) => ({
      label: item.OwnerName,
      value: item.Id,
    }));
  } catch (error) {
    console.log(error);
  }
}

function reset(flag = true) {
  params.value = {};
  date.value = [];
  dateMode.value = "全部时间";
  dtType.value = 1;
  supplyId.value = "";
  materialId.value = "";
  unloadId.value = "";
  ownerId.value = "";
  emits(
    "change",
    {
      params: params.value,
      isFilter: isFilter.value,
    },
    flag
  );
  filter.value.popup.close();
}
function submit() {
  params.value = {
    dtType: dtType.value,
    dateMode: dateMode.value,
    date: date.value,
    startTime: date.value?.[0] ?? "",
    endTime: date.value?.[1] ?? "",
    supplyId: supplyId.value,
    materialId: materialId.value,
    unloadId: unloadId.value,
    ownerId: ownerId.value,
  };
  console.log("params", params);
  emits(
    "change",
    {
      params: params.value,
      isFilter: isFilter.value,
    },
    true
  );
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
    font-weight: 500;
    font-size: 30rpx;
    color: var(--title-color);
    line-height: 48rpx;
    margin-bottom: 16rpx;
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

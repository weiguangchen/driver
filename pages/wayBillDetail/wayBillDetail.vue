<template>
  <uv-navbar bgColor="rgba(255,255,255,0)" @leftClick="leftClick"></uv-navbar>
  <template v-if="info.Id">
    <view class="placeholder" :style="{ height: placeholderHeight }"></view>
    <view class="page-bg" :class="{ 'no-auth': info.EntryAuthened === '0' }" />
    <!-- 状态 -->
    <!-- @click="openStepModal" -->
    <view class="status-wrapper">
      <view class="status-text">
        {{ info.StatusTxt }}
        <uv-icon
          name="arrow-right"
          size="32rpx"
          color="#FFFFFF"
          :custom-style="{ marginLeft: '8rpx' }"
          bold
        />
      </view>
      <view class="status-tip">
        <rich-text :nodes="info.StatusRemark" />
      </view>
    </view>
    <!-- end -->
    <!-- 地址 -->
    <view class="location-wrapper">
      <view class="from-wrapper" @click="openMapModal(1)" v-if="info.SupEnt">
        <view class="icon">装</view>
        <view class="content-box my-border-bottom">
          <view class="info" @click="selectAddress">
            <view class="name uv-line-1">{{
              info.SupEnt ? info.SupEnt.Name : ""
            }}</view>
            <view class="address uv-line-1"
              >{{ info.SupEnt ? info.SupEnt.Province : ""
              }}{{ info.SupEnt ? info.SupEnt.City : ""
              }}{{ info.SupEnt ? info.SupEnt.District : ""
              }}{{ info.SupEnt ? info.SupEnt.Address : "" }}</view
            >
          </view>
          <uv-image
            src="/static/images/arrow.png"
            :duration="0"
            width="24rpx"
            height="24rpx"
          />
        </view>
      </view>
      <view class="to-wrapper" @click="openMapModal(2)" v-if="info.UnloadEnt">
        <view class="icon">卸</view>
        <view class="content-box">
          <view class="info" @click="selectAddress">
            <view class="name uv-line-1">{{
              info.UnloadEnt ? info.UnloadEnt.PlaceName : ""
            }}</view>
            <view class="address uv-line-1"
              >{{ info.UnloadEnt ? info.UnloadEnt.Province : ""
              }}{{ info.UnloadEnt ? info.UnloadEnt.City : ""
              }}{{ info.UnloadEnt ? info.UnloadEnt.District : ""
              }}{{ info.UnloadEnt ? info.UnloadEnt.Address : "" }}</view
            >
          </view>
          <uv-image
            src="/static/images/arrow.png"
            :duration="0"
            width="24rpx"
            height="24rpx"
          />
        </view>
      </view>
    </view>
    <!-- end -->
    <!-- 物料 -->
    <view class="material">
      <view class="title">{{ info.MaterialName }}</view>
      <view class="content">
        <rich-text :nodes="info.DetailTxt" />
      </view>
    </view>
    <!-- end -->
    <!-- 磅单 -->
    <view class="bangdan" v-if="info.BillNo">
      <view class="left">
        <view class="name">已生成磅单</view>
        <view class="no">磅单号：{{ info.BillNo }}</view>
      </view>
      <!-- <view class="right">
			<uv-button shape="circle" color="var(--page-bg)":custom-style="{ height: '68rpx',color:'var(--main-color)', fontWeight: 'bold' }">
				查看磅单
			</uv-button>
		</view> -->
    </view>
    <!-- end -->
    <!-- 公司 -->
    <view class="mfrs" v-if="info.OwnerEnt">
      <view class="left">
        <view class="name">{{
          info.OwnerEnt ? info.OwnerEnt.OwnerName : ""
        }}</view>
        <view class="person">
          <text class="user">{{
            info.OwnerEnt ? info.OwnerEnt.Linker : ""
          }}</text>
          <text class="phone">{{
            info.OwnerEnt ? info.OwnerEnt.LinkerMobile : ""
          }}</text>
        </view>
      </view>
      <view class="right" v-if="info.OwnerEnt && info.OwnerEnt.LinkerMobile">
        <uv-button
          shape="circle"
          color="var(--page-bg)"
          :custom-style="{
            height: '68rpx',
            color: 'var(--main-color)',
            fontWeight: 'bold',
          }"
          @click="takePhone1"
        >
          呼叫货主
        </uv-button>
      </view>
    </view>
    <!-- end -->
    <!-- 车 -->
    <view class="bill-car">
      <view
        class="info-wrapper"
        :class="{
          'my-border-bottom': info.WeightEnt && info.WeightEnt.FirstWeight,
        }"
      >
        <view class="info">
          <my-plate :mode="2" :plate="info.Carno" :color="info.CarColor" />
          <text class="type">{{ info.CarType }}</text>
        </view>
        <view class="person" v-if="info.DriverEnt">
          <text class="user">{{
            info.DriverEnt ? info.DriverEnt.NickName : ""
          }}</text>
          <text class="phone">{{
            info.DriverEnt ? info.DriverEnt.Mobile : ""
          }}</text>
        </view>
      </view>
      <view
        class="weight"
        :class="{
          'my-border-bottom': info.WeightEnt && info.WeightEnt.SecondWeight,
        }"
        v-if="info.WeightEnt"
      >
        <view class="label" v-if="info.WeightEnt"
          >皮重
          <text class="num">{{ info.WeightEnt.FirstWeight || "" }}</text>
          吨</view
        >
        <view class="value" v-if="info.WeightEnt"
          >计量于
          {{
            info.WeightEnt.FirstTime
              ? dayjs(info.WeightEnt.FirstTime).format("MM-DD HH:mm")
              : ""
          }}</view
        >
      </view>
      <view class="weight" v-if="info.WeightEnt">
        <view class="label" v-if="info.WeightEnt"
          >毛重
          <text class="num">{{ info.WeightEnt.SecondWeight || "" }}</text>
          吨</view
        >
        <view class="value" v-if="info.WeightEnt"
          >测量于
          {{
            info.WeightEnt.SecondTime
              ? dayjs(info.WeightEnt.SecondTime).format("MM-DD HH:mm")
              : ""
          }}</view
        >
      </view>
    </view>
    <!-- end -->
    <!-- 卸货说明 -->
    <view class="remark" v-if="info.UnloadMemo">
      <view class="title">卸货说明</view>
      <view class="content">{{ info.UnloadMemo }}</view>
    </view>
    <!-- 运单详情 -->
    <view class="remark" v-if="info.AssignMemo">
      <view class="title">运单备注</view>
      <view class="content">{{ info.AssignMemo }}</view>
    </view>
    <view class="order-info">
      <view class="item my-border-bottom">
        <view class="label">派车单号</view>
        <view class="value">{{ info.AssignCode }}</view>
      </view>
      <view class="item my-border-bottom">
        <view class="label">运单号</view>
        <view class="value">{{ info.OnwayNo }}</view>
      </view>
      <view
        class="item"
        :class="{
          'my-border-bottom': ['8', '9'].includes(info.Weightedstatus),
        }"
      >
        <view class="label">接单时间</view>
        <view class="value">{{ info.Creatortime }}</view>
      </view>
      <view class="item" v-if="['8'].includes(info.Weightedstatus)">
        <view class="label">完成时间</view>
        <view class="value">{{ info.LastModifyTime }}</view>
      </view>
      <view class="item" v-else-if="['9'].includes(info.Weightedstatus)">
        <view class="label">取消时间</view>
        <view class="value">{{ info.LastModifyTime }}</view>
      </view>
    </view>
    <!-- end -->

    <view
      class="page-footer"
      v-if="
        ['0', '1', '2', '3', '4', '5', '6', '7'].includes(info.Weightedstatus)
      "
    >
      <view class="btns" v-if="['0'].includes(info.Weightedstatus)">
        <template v-if="info.NeedSignFac === '1'">
          <view class="left">
            <uv-button
              text="取消运单"
              color="var(--page-bg)"
              :custom-style="{
                height: '96rpx',
                borderRadius: '16rpx',
                color: 'var(--sub-color)',
              }"
              @click="cancelBill"
            ></uv-button>
          </view>
          <view class="right">
            <uv-button
              text="已到达装货厂家"
              color=" linear-gradient( 270deg, #31CE57 0%, #07B130 100%)"
              :custom-style="{ height: '96rpx', borderRadius: '16rpx' }"
              @click="confirmArrive"
            ></uv-button>
          </view>
        </template>
        <template v-else>
          <uv-button
            text="取消运单"
            color="var(--page-bg)"
            :custom-style="{
              width: '100%',
              height: '96rpx',
              borderRadius: '16rpx',
              color: 'var(--sub-color)',
            }"
            @click="cancelBill"
          ></uv-button>
        </template>
      </view>
      <view class="btns" v-if="['1'].includes(info.Weightedstatus)">
        <view class="left">
          <uv-button
            text="取消运单"
            color="var(--page-bg)"
            :custom-style="{
              height: '96rpx',
              borderRadius: '16rpx',
              color: 'var(--sub-color)',
            }"
            @click="cancelBill"
          ></uv-button>
        </view>
        <view class="right">
          <div style="font-size: 14px; color: #fff" v-if="isOver">即将入厂</div>
          <div
            v-else
            style="
              height: 96rpx;
              flex: 1;
              background-color: #b0becc;
              border-radius: 16rpx;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
              font-size: 14px;
            "
          >
            预计
            <uv-count-down
              :time="time"
              format="HH:mm:ss"
              :customStyle="{ margin: '0 4px' }"
            />
            后可入厂
          </div>
        </view>
      </view>
      <view class="btns" v-if="['2', '5', '6'].includes(info.Weightedstatus)">
        <uv-button
          text="呼叫厂家"
          color="var(--page-bg)"
          :custom-style="{
            height: '96rpx',
            width: '100%',
            borderRadius: '16rpx',
            color: 'var(--sub-color)',
          }"
          @click="takePhone2"
        ></uv-button>
      </view>
      <view class="btns" v-if="['3'].includes(info.Weightedstatus)">
        <view class="left">
          <uv-button
            text="呼叫厂家"
            color="var(--page-bg)"
            :custom-style="{
              height: '96rpx',
              borderRadius: '16rpx',
              color: 'var(--sub-color)',
            }"
            @click="takePhone2"
          ></uv-button>
        </view>
        <view class="right">
          <div style="font-size: 14px; color: #fff" v-if="isOver">即将装货</div>
          <div
            v-else
            style="
              height: 96rpx;
              flex: 1;
              background-color: #b0becc;
              border-radius: 16rpx;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
              font-size: 14px;
            "
          >
            预计
            <uv-count-down
              :time="time"
              format="HH:mm:ss"
              :customStyle="{ margin: '0 4px' }"
            />
            后可装货
          </div>
        </view>
      </view>
      <view class="btns" v-if="['4'].includes(info.Weightedstatus)">
        <view class="left">
          <uv-button
            text="呼叫厂家"
            color="var(--page-bg)"
            :custom-style="{
              height: '96rpx',
              borderRadius: '16rpx',
              color: 'var(--sub-color)',
            }"
            @click="takePhone2"
          ></uv-button>
        </view>
        <view class="right">
          <uv-button
            text="开始装车"
            color=" linear-gradient( 270deg, #31CE57 0%, #07B130 100%)"
            :custom-style="{ height: '96rpx', borderRadius: '16rpx' }"
          ></uv-button>
        </view>
      </view>
      <view class="btns" v-if="['7'].includes(info.Weightedstatus)">
        <uv-button
          :loading="loading"
          text="确认卸货"
          color=" linear-gradient( 270deg, #31CE57 0%, #07B130 100%)"
          :custom-style="{
            height: '96rpx',
            width: '100%',
            borderRadius: '16rpx',
          }"
          @click="confirmUnload"
        ></uv-button>
      </view>
    </view>
  </template>
  <view v-else style="height: 100vh">
    <my-empty img="/static/images/empty/loading.gif" text="加载中" />
  </view>
  <!-- 地图 -->
  <MapDrawer ref="mapModal" />
  <!-- 追踪 -->
  <!-- <StepDrawer ref="stepModal"/> -->
  <my-confirm ref="modal" />
  <!-- <UnloadModal ref="unload" @success="onSuccess" /> -->
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
// import Material from './components/Material.vue';
import MapDrawer from "@/pages/billDetail/components/MapDrawer.vue";
// import StepDrawer from './components/StepDrawer.vue';
import {
  GetReceiveAssignDetail,
  DriverMakeOnway,
  GetSupplyOnwayDetail,
  DisableOnwayEnt,
  ArrivedConfirm,
  UnloadConfirm,
  UnloadDistanceChk,
} from "@/api/index.js";
import { getToken } from "@/utils/token.js";
import { getLocationInfo } from "@/utils/authorize.js";
import UnloadModal from "@/pages/waybill/components/UnloadModal.vue";
import { formatDateTime } from "@/utils/index.js";

import dayjs from "dayjs";
const modal = ref();
const statusBarHeight = ref();
const supplyId = ref("");
const onwayId = ref("");
onLoad(async (options) => {
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight;
  onwayId.value = options?.onwayId ?? "";
  supplyId.value = options?.supplyId ?? "";
  await getData();
  startCountDown();
});
const info = ref({});
async function getData() {
  try {
    const res = await GetSupplyOnwayDetail({
      onwayId: onwayId.value,
      supplyId: supplyId.value,
      uType: "driver",
    });
    info.value = {
      ...res,
    };
    console.log("info", info.value);
  } catch {
  } finally {
  }
}
const placeholderHeight = computed(() => `${statusBarHeight.value + 56}px`);
// 导航条
function leftClick() {
  uni.navigateBack();
}
// 地图
const mapModal = ref();
function openMapModal(type) {
  const data = {
    type,
    name:
      type === 1
        ? info.value?.SupEnt?.Name ?? ""
        : info.value?.UnloadEnt?.PlaceName ?? "",
    address:
      type === 1
        ? `${info.value?.SupEnt?.Province ?? ""}${
            info.value?.SupEnt?.City ?? ""
          }${info.value?.SupEnt?.District ?? ""}${
            info.value?.SupEnt?.Address ?? ""
          }`
        : `${info.value?.UnloadEnt?.Province ?? ""}${
            info.value?.UnloadEnt?.City ?? ""
          }${info.value?.UnloadEnt?.District ?? ""}${
            info.value?.UnloadEnt?.Address ?? ""
          }`,
    user:
      type === 1
        ? info.value?.SupEnt?.Linker ?? ""
        : info.value?.UnloadEnt?.NickName ?? "",
    phone:
      type === 1
        ? info.value?.SupEnt?.LinkerMobile ?? ""
        : info.value?.UnloadEnt?.Mobile ?? "",
    longitude:
      type === 1
        ? info.value?.SupEnt?.Logitude
        : info.value?.UnloadEnt?.Logitude,
    latitude:
      type === 1
        ? info.value?.SupEnt?.Latitude
        : info.value?.UnloadEnt?.Latitude,
  };
  mapModal.value.open(data);
}
// 跟踪
const stepModal = ref();
function openStepModal() {
  stepModal.value.open();
}
// 取消
function cancelBill() {
  modal.value.confirm({
    title: "确认取消该笔运单？",
    content: "如取消次数过多，将会被限制接单",
    cancelText: "再想想",
    confirmText: "取消运单",
    asyncClose: true,
    async confirm() {
      try {
        await DisableOnwayEnt({
          onwayId: onwayId.value,
          supplyId: supplyId.value,
          userId: getToken().userInfo.Id,
          userType: "driver",
        });
        modal.value.close();
        uni.$emit(`waybill:cancel`, info.value);
        getData();
      } catch (err) {
        modal.value.closeLoading();
        uni.showToast({
          title: err.data,
          icon: "none",
        });
      }
    },
  });
}
// 确认到达
async function confirmArrive() {
  uni.showLoading({
    mask: true,
  });
  let location = {};
  try {
    location = await getLocationInfo();
  } catch {
    modal.value.confirm({
      title: "定位失败",
      content: "请开启相关定位权限或者扫码入厂",
      showCancelButton: false,
      confirmBgColor: "var(--main-color)",
    });
    uni.hideLoading();
    return;
  }
  console.log("location", location);
  try {
    await ArrivedConfirm({
      onwayId: onwayId.value,
      supplyId: info.record.SupplyId,
      logitude: location.longitude,
      latitude: location.latitude,
    });
    uni.hideLoading();
    uni.$emit(`waybill:confirmArrive`, info.value);
    getData();
  } catch (err) {
    console.log("err", err);
    uni.hideLoading();
    uni.showToast({
      title: err.data,
      icon: "none",
    });
  }
}
// 倒计时
const time = ref(0);
function startCountDown() {
  if (!info.value.YJTime) {
    time.value = 0;
    return;
  }

  const targetTime = dayjs(info.value.YJTime);
  const now = dayjs();
  const diff = targetTime.diff(now);

  time.value = Math.max(diff, 0);
}
const isOver = computed(() => {
  return info.value.YJTime && dayjs().isAfter(info.value.YJTime);
});
// 呼叫货主
function takePhone1() {
  if (!info.value?.OwnerEnt.LinkerMobile) {
    return;
  }
  uni.makePhoneCall({
    phoneNumber: info.value.OwnerEnt.LinkerMobile,
  });
}
// 呼叫厂家
function takePhone2() {
  if (!info.value?.SupEnt?.LinkerMobile) {
    return;
  }
  uni.makePhoneCall({
    phoneNumber: info.value.SupEnt.LinkerMobile,
  });
}
// 确认卸货
// const unload = ref();
// async function confirmUnload() {
//   unload.value.open(info.value);
// }
const loading = ref(false);
async function confirmUnload() {
  loading.value = true;
  let location = {};
  try {
    location = await getLocationInfo();
  } catch {
    modal.value.confirm({
      title: "定位失败",
      content: "请开启相关定位权限",
      showCancelButton: false,
      confirmBgColor: "var(--main-color)",
    });
    loading.value = false;
    return;
  }
  console.log("location", location);
  try {
    const result = await UnloadDistanceChk({
      onwayId: info.value.Id,
      userId: getToken().userInfo.Id,
      uType: "driver",
      supplyId: info.value.SupplyId,
      logitude: location.longitude,
      latitude: location.latitude,
    });

    uni.navigateTo({
      url: "/pages/unload/unload",
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit("unloadConfirmData", {
          data: result,
          record: info.value,
        });
      },
      events: {
        unloadFinish() {
          getData();
        },
      },
    });
  } catch (err) {
    uni.showToast({
      title: err.data,
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
}

function onSuccess() {
  uni.$emit(`waybill:confirmUnload`, info.value);
  getData();
}
</script>

<style lang="scss">
page {
  padding: 0 24rpx 200rpx;
}

.page-bg {
  &.no-auth {
    background: linear-gradient(to bottom, transparent 168px, #f2f4f7),
      linear-gradient(270deg, #fc7e2c 0%, #fc7e2c 100%);
  }
}

.status-wrapper {
  margin-bottom: 32rpx;
  padding-left: 12rpx;
  .status-text {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 48rpx;
    color: #ffffff;
    line-height: 64rpx;
  }
  .status-tip {
    font-weight: 500;
    font-size: 28rpx;
    color: #ffffff;
    line-height: 48rpx;
  }
}

.location-wrapper {
  padding: 0 24rpx;
  margin: 0 0 20rpx;
  background: #ffffff;
  border-radius: 24rpx;

  .from-wrapper,
  .to-wrapper {
    display: flex;
    align-items: center;

    .icon {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36rpx;
      height: 36rpx;
      border-radius: 8rpx;
      font-weight: 600;
      font-size: 22rpx;
      color: #ffffff;
      margin-right: 24rpx;
    }

    .content-box {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 24rpx 0;

      .info {
        flex: 1;
        line-height: 48rpx;
        margin-right: 20rpx;

        .name {
          font-weight: 500;
          font-size: 30rpx;
          color: var(--title-color);
        }

        .address {
          display: flex;
          align-items: center;
          font-size: 26rpx;
          color: var(--sub-color);
        }
      }
    }
  }

  .from-wrapper {
    .icon {
      background-color: var(--main-color);
    }
  }

  .to-wrapper {
    .icon {
      background-color: #fc7e2c;
    }
  }
}

.material,
.bangdan,
.mfrs,
.bill-car,
.remark,
.order-info {
  padding: 28rpx;
  background-color: #ffffff;
  margin: 0 0 24rpx;
  border-radius: 24rpx;
}

.material {
  .title {
    font-weight: bold;
    font-size: 30rpx;
    color: var(--title-color);
    margin-bottom: 16rpx;
  }
  .content {
    font-weight: 400;
    font-size: 26rpx;
    color: #73838e;
  }
}
.bangdan {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--title-color);

  .name {
    font-weight: bold;
    font-size: 30rpx;
    margin-bottom: 16rpx;
  }

  .no {
    font-size: 26rpx;
    color: var(--sub-color);
  }
}
.mfrs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--title-color);

  .name {
    font-weight: bold;
    font-size: 30rpx;
    margin-bottom: 16rpx;
  }

  .person {
    font-size: 26rpx;
    color: var(--sub-color);

    .user {
      margin-right: 24rpx;
    }
  }
}
.bill-car {
  padding: 0 28rpx;
  .info-wrapper {
    padding: 32rpx 0;
    .info {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;

      .type {
        margin-left: 16rpx;
        color: var(--title-color);
        font-size: 26rpx;
        font-weight: bold;
      }
    }

    .person {
      font-size: 26rpx;
      color: var(--sub-color);

      .user {
        margin-right: 24rpx;
      }
    }
  }
  .weight {
    padding: 32rpx 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 26rpx;
    color: var(--sub-color);
    line-height: 48rpx;
    .num {
      font-weight: bold;
    }
  }
}
.remark {
  line-height: 40rpx;

  .title {
    font-weight: bold;
    font-size: 30rpx;
    color: var(--title-color);
    margin-bottom: 16rpx;
  }

  .content {
    font-size: 26rpx;
    color: #4e5356;
    text-align: left;
  }
}
.order-info {
  padding: 0 28rpx;
  border-radius: 24rpx;
  background-color: #ffffff;
  line-height: 40rpx;
  .item {
    padding: 32rpx 0;
    font-size: 26rpx;
    display: flex;
    border-radius: 0;
  }
}

.uv-count-down__text {
  font-size: 14px !important;
  color: #ffffff !important;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  background: #ffffff;
  border-radius: 24rpx 24rpx 24rpx 24rpx;
  font-weight: 400;
  font-size: 26rpx;
  line-height: 40rpx;
  .label {
    color: #73838e;
  }
  .value {
    color: #1a1b1c;
  }
}
</style>

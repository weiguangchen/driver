<template>
  <view class="admission-code">
    <view class="qrcode-container">
      <view class="title">请根据现场要求，出示二维码完成相关操作</view>
      <view class="qrcode-wrapper">
        <uv-qrcode
          class="qrcode"
          ref="qrcode"
          :options="options"
          :start="false"
          size="526rpx"
          :value="params"
        />
      </view>
    </view>

    <view class="items">
      <view class="item">
        <view class="label">车辆</view>
        <view class="value">{{ info.CarEnt ? info.CarEnt.Carno : "" }}</view>
      </view>
      <view class="item">
        <view class="label">手机号</view>
        <view class="value">{{
          info.DriverEnt ? info.DriverEnt.Mobile : ""
        }}</view>
      </view>
    </view>
    <view class="items">
      <view class="item">
        <view class="label">货主</view>
        <view class="value">{{
          info.OwnerEnt ? info.OwnerEnt.OwnerName : ""
        }}</view>
      </view>
      <view class="item">
        <view class="label">物料</view>
        <view class="value">{{ mat.Id ? mat.MaterialName : "" }}</view>
      </view>
      <view class="item">
        <view class="label">派车单号</view>
        <view class="value">{{ info.AssignCode || "" }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { ref, unref, computed, getCurrentInstance } from "vue";

const info = ref({});
const mat = ref({});
const qrcode = ref();
const params = computed(() => {
  const coCo = `${unref(info)?.CarEnt?.Carno ?? ""},${
    unref(info)?.DriverEnt?.Mobile ?? ""
  },${unref(info)?.OwnerId ?? ""},${unref(info)?.Orderid ?? ""},${
    unref(info)?.Id ?? ""
  },${unref(info)?.AssignCode ?? ""},${unref(mat)?.Id ?? ""},${
    unref(mat)?.Material ?? ""
  }`;
  const p = {
    htQRType: "offAcc",
    coCo,
  };
  return JSON.stringify(p);
});
onLoad(() => {
  const instance = getCurrentInstance().proxy;
  const eventChannel = instance.getOpenerEventChannel();
  eventChannel.on("admissionCodeData", function (res) {
    info.value = res.info;
    mat.value = res.mat;
  });
});

const options = ref({
  size: 263,
  useDynamicSize: false,
  errorCorrectLevel: 0,
  typeNumber: 9,
});
</script>

<style lang="scss">
page {
  padding: 24rpx;
}

.qrcode-container {
  background: var(--dark-main);
  border-radius: 32rpx;
  padding: 0 16rpx 16rpx;
  margin-bottom: 24rpx;
  .title {
    text-align: center;
    padding: 24rpx 0;
    font-weight: bold;
    font-size: 26rpx;
    color: #ffffff;
  }
  .qrcode-wrapper {
    position: relative;
    background-color: #ffffff;
    border-radius: 24rpx;
    width: 100%;
    padding-bottom: 100%;
    .qrcode {
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 100;
      transform: translate(-50%, -50%);
    }
  }
}

.items {
  background-color: #ffffff;
  padding: 0 24rpx;
  border-radius: 24rpx;
  margin-bottom: 24rpx;
  .item {
    &:not(:last-child) {
      border-bottom: 1px solid #e3e9ef;
    }
  }
}
.item {
  background-color: #ffffff;
  height: 112rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
  padding: 0 4rpx;

  .label {
    color: var(--content-color);
  }
  .value {
    font-weight: bold;
    color: var(--title-color);
  }
}
</style>

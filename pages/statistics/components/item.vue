<template>
  <view class="item">
    <view class="item-wrapper">
      <view class="item-box" v-if="status.includes('isMat')">
        <view class="label">物料</view>
        <view class="value">{{ record.MaterialName || "-" }}</view>
      </view>
      <view class="item-box" v-if="status.includes('isCustomer')">
        <view class="label">客户</view>
        <view class="value">{{ record.CustomerName || "-" }}</view>
      </view>
      <view class="item-box" v-if="status.includes('isUnLoad')">
        <view class="label">卸货地</view>
        <view class="value">{{ record.UnloadplaceName || "-" }}</view>
      </view>
    </view>
    <uv-row>
      <uv-col span="6">
        <view class="info-box line">
          <view class="title">合计重量 (吨)</view>
          <view class="num">{{ record.Totalweight || "-" }}</view>
        </view>
      </uv-col>
      <uv-col span="6">
        <view class="info-box">
          <view class="title">合计车次</view>
          <view class="num">{{ record.Cartimes || "-" }}</view>
        </view>
      </uv-col>
    </uv-row>
  </view>
</template>

<script setup>
const props = defineProps({
  record: {
    default: () => ({}),
    type: Object,
  },
  status: {
    default: () => [],
    type: Array,
  },
});
</script>

<style lang="scss" scoped>
.item {
  padding: 24rpx 0;
  background: #ffffff;
  border-radius: 24rpx;
  margin-bottom: 20rpx;

  .item-wrapper {
    background: var(--page-bg);
    border-radius: 16rpx;
    padding: 0 24rpx;
    margin: 0 24rpx 24rpx;
    .item-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 26rpx;
      color: var(--content-color);
      padding: 24rpx 0 24rpx 4rpx;
      line-height: 48rpx;
      position: relative;
      &:not(:last-child) {
        // border-bottom: 1px solid #c8d4df;
        &::after {
          content: "";
          display: inline-block;
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background-color: #c8d4df;
          transform: scaleY(0.5);
        }
      }
      .value {
        font-weight: bold;
        color: var(--title-color);
      }
    }
  }
  .info-box {
    position: relative;
    text-align: center;
    &.line {
      &::after {
        content: "";
        display: inline-block;
        position: absolute;
        right: 0;
        top: 50%;
        width: 1px;
        height: 64rpx;
        transform: translateY(-50%);
        border-right: 1px solid var(--divider);
      }
    }
    .title {
      font-size: 26rpx;
      color: var(--content-color);
      line-height: 48rpx;
    }
    .num {
      font-weight: bold;
      font-size: 30rpx;
      color: var(--title-color);
      line-height: 48rpx;
    }
  }
}
</style>

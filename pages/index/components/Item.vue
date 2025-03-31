<template>
  <view class="bill-wrapper" @click="toDetail">
    <view class="mfrs">
      <view class="name uv-line-1">{{
        record?.OwnerEnt?.OwnerName ?? ""
      }}</view>
      <uv-icon name="/static/images/arrow.png" size="14" />
    </view>
    <view class="tags">
      <view class="tag" v-for="item in record.MatList" :key="item.Id">{{
        item.MaterialName
      }}</view>
    </view>
    <view class="location-wrapper">
      <view class="from" v-if="record.SupEnt">
        <view class="line">
          <view class="dot" v-for="dot in 3" />
        </view>
        <uv-image
          src="/static/images/dot1.png"
          width="16rpx"
          height="16rpx"
          :duration="0"
          :custom-style="{ marginRight: '16rpx' }"
        />
        <view class="city uv-line-1">{{
          record.SupEnt ? record.SupEnt.City : ""
        }}</view>
        <view class="name uv-line-1">{{
          record.SupEnt ? record.SupEnt.SupplierName : ""
        }}</view>
        <view class="dis" v-if="record.District">{{ record.District }} km</view>
      </view>
      <view class="to" v-if="record.UnloadEnt">
        <uv-image
          src="/static/images/dot2.png"
          width="16rpx"
          height="16rpx"
          :duration="0"
          :custom-style="{ marginRight: '16rpx' }"
        />
        <view class="city uv-line-1">{{
          record.UnloadEnt ? record.UnloadEnt.City : ""
        }}</view>
        <view class="name uv-line-1">{{
          record.UnloadEnt ? record.UnloadEnt.PlaceName : ""
        }}</view>
      </view>
    </view>
    <view class="date">
      <text class="label">发布于</text>
      <text>{{ formatDateTime(record.CreatorTime) }}</text>
    </view>
  </view>
</template>

<script setup>
import { formatDateTime } from "@/utils";
const props = defineProps({
  record: {
    default: () => {},
    type: Object,
  },
});

function toDetail() {
  uni.navigateTo({
    url: `/pages/billDetail/billDetail?assignId=${props.record.Id}&supplyId=${props.record.Supply}`,
  });
}
</script>

<style lang="scss">
.bill-wrapper {
  padding: 28rpx 24rpx;
  background: #ffffff;
  border-radius: 24rpx;
  margin-bottom: 20rpx;

  .mfrs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--title-color);
    line-height: 48rpx;
    margin-bottom: 16rpx;

    .name {
      font-weight: bold;
      font-size: 32rpx;
      flex: 1;
    }

    .date {
      flex: none;
      font-size: 26rpx;
      color: var(--sub-color);
      margin-left: 10rpx;
    }
  }

  .tags {
    margin-bottom: 12rpx;
    overflow: hidden;
    .tag {
      height: 44rpx;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 12rpx;
      font-weight: 500;
      font-size: 26rpx;
      color: #ffffff;
      background-color: var(--main-color);
      border-radius: 8rpx;
      margin-right: 12rpx;
      margin-bottom: 12rpx;
    }
  }

  .location-wrapper {
    padding: 24rpx 20rpx;
    background: var(--page-bg);
    border-radius: 16rpx;
    margin-bottom: 28rpx;

    .line {
      position: absolute;
      height: 24rpx;
      top: 34rpx;
      left: 6rpx;

      .dot {
        width: 4rpx;
        height: 4rpx;
        border-radius: 50%;
        background-color: #c8d4df;

        &:not(:last-child) {
          margin-bottom: 6rpx;
        }
      }
    }

    .from,
    .to {
      display: flex;
      align-items: center;
      font-weight: 500;
      font-size: 26rpx;
      line-height: 36rpx;

      .city {
        color: var(--title-color);
        margin-right: 16rpx;
        max-width: 120rpx;
      }

      .name {
        flex: 1;
        color: var(--content-color);
      }

      .dis {
        color: var(--main-color);
        margin-left: 12rpx;
      }
    }

    .from {
      position: relative;
      margin-bottom: 20rpx;
    }
  }

  .date {
    font-size: 26rpx;
    color: #a0afba;
    line-height: 36rpx;
    .label {
      margin-right: 10rpx;
    }
  }
}
</style>

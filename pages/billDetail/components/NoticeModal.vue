<template>
  <uv-popup
    ref="popup"
    :safeAreaInsetBottom="false"
    round="24rpx"
    :customStyle="{
      marginTop: '-25rpx',
    }"
  >
    <view class="notice-modal">
      <view class="title">致来厂司机：</view>
      <view class="content">
        <view class="notice-text">{{ text }}</view>
        <view class="logo">
          <uv-icon
            name="/static/images/billDetail/notice.png"
            width="248rpx"
            height="48rpx"
          />
        </view>
      </view>
      <view class="footer">
        <uv-button
          text="我已知晓并保证遵守以上规定"
          color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"
          :customStyle="{
            height: '96rpx',
            borderRadius: '16rpx',
          }"
          :customTextStyle="{
            fontWeight: 'bold',
            fontSize: '30rpx',
          }"
          @click="close"
        />
      </view>
      <view class="laba">
        <uv-icon
          name="/static/images/billDetail/laba.png"
          width="176rpx"
          height="152rpx"
        />
      </view>
    </view>
  </uv-popup>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  text: {
    type: String,
    default: "",
  },
});

const popup = ref(null);
function open() {
  popup.value.open();
}
function close() {
  popup.value.close();
}
defineExpose({
  open,
});
</script>

<style lang="scss" scoped>
.notice-modal {
  position: relative;
  width: 622rpx;
  padding: 40rpx 24rpx 24rpx 24rpx;
  .title {
    padding-left: 12rpx;
    font-weight: bold;
    font-size: 36rpx;
    color: var(--title-color);
    margin-bottom: 32rpx;
    line-height: 50rpx;
  }
  .content {
    position: relative;
    background: var(--page-bg);
    border-radius: 16rpx;
    padding: 24rpx 24rpx 72rpx;
    margin-bottom: 40rpx;
    overflow: hidden;
    .notice-text {
      font-weight: 400;
      font-size: 30rpx;
      color: var(--content-color);
      line-height: 48rpx;
    }
    .logo {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  .laba {
    position: absolute;
    right: 48rpx;
    top: -34rpx;
  }
}
</style>

<template>
  <root-portal>
    <uv-popup
      ref="popup"
      bgColor="#FFFFFF"
      :closeable="false"
      round="48rpx"
      :showTitle="false"
      mode="bottom"
      :custom-style="{ minHeight: '100rpx' }"
      :closeOnClickOverlay="false"
      :z-index="100760"
      :safeAreaInsetBottom="false"
      @confirm="confirm"
    >
      <view class="result-drawer-content">
        <view class="result-drawer-content-wrapper">
          <view class="result-drawer-content-img">
            <uv-image
              v-if="popupConfig.type === 'success'"
              src="/static/images/resultDrawer/success.png"
              width="320rpx"
              height="320rpx"
              :duration="0"
            />
            <uv-image
              v-else-if="popupConfig.type === 'warning'"
              src="/static/images/resultDrawer/warning.png"
              width="320rpx"
              height="320rpx"
              :duration="0"
            />
          </view>
          <view class="result-drawer-content-title">
            {{ popupConfig.title }}
          </view>
          <view class="result-drawer-content-info">
            {{ popupConfig.info }}
          </view>
        </view>
        <view class="result-drawer-footer">
          <view class="result-drawer-footer-btn" v-if="popupConfig.showCancel">
            <uv-button
              :text="popupConfig.cancelText"
              @click="cancel"
              :custom-style="{
                color: '#4E5356',
                height: '96rpx',
                borderRadius: '16rpx',
                background: ' #F2F4F7',
              }"
              :custom-text-style="{
                fontSize: '30rpx',
                fontFamily: 'misans500',
              }"
            />
          </view>
          <view
            class="result-drawer-footer-btn"
            v-if="popupConfig.showConfirm"
            :style="{ marginLeft: popupConfig.showCancel ? '24rpx' : '0' }"
          >
            <uv-button
              :text="popupConfig.confirmText"
              color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%)"
              :custom-style="{
                height: '96rpx',
                borderRadius: '16rpx',
              }"
              :custom-text-style="{
                fontSize: '30rpx',
                fontFamily: 'misans500',
              }"
              @click="confirm"
            />
          </view>
        </view>
      </view>
    </uv-popup>
  </root-portal>
</template>

<script setup>
import { ref } from "vue";
const popup = ref();

const popupConfig = ref({
  type: "success",
  title: "接单成功",
  info: "可在「当前任务」中查看装运进度",
  showCancel: true,
  cancelText: "返回首页",
  cancelCallBack: () => {
    uni.switchTab({
      url: "/pages/index/index",
    });
  },
  showConfirm: true,
  confirmText: "查看当前任务",
  confirmCallBack: () => {
    uni.switchTab({
      url: "/pages/task/task",
    });
  },
});

function open(config) {
  popupConfig.value = Object.assign({}, popupConfig.value, config);
  console.log("popupConfig", popupConfig.value);
  popup.value.open();
}

function cancel() {
  popupConfig.value.cancelCallBack();
}

function confirm() {
  popupConfig.value.confirmCallBack();
}

defineExpose({
  open,
});
</script>

<style lang="scss" scoped>
.result-drawer-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  text-align: center;
  padding: 196rpx 24rpx max(var(--safe-area-inset-bottom), var(--safe-bottom));

  .result-drawer-content-wrapper {
    padding-bottom: 64rpx;
  }
  .result-drawer-content-img {
    position: absolute;
    top: -128rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .result-drawer-content-title {
    font-family: misans600, -apple-system, BlinkMacSystemFont, "PingFang SC",
      "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
    font-kerning: none;
    font-weight: 600;
    font-size: 38rpx;
    color: #1a1b1c;
    line-height: 56rpx;
    margin-bottom: 4rpx;
  }
  .result-drawer-content-info {
    font-family: misans400, -apple-system, BlinkMacSystemFont, "PingFang SC",
      "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
    font-kerning: none;
    font-weight: 400;
    font-size: 28rpx;
    color: #73838e;
    line-height: 48rpx;
  }

  .result-drawer-footer {
    display: flex;
    justify-content: space-between;
    .result-drawer-footer-btn {
      flex: 1;
    }
  }
}
</style>

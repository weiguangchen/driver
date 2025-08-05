<template>
  <view class="my-empty" :style="{ height, background: bgColor }">
    <uv-image
      :src="img"
      width="176rpx"
      height="176rpx"
      :duration="0"
      :custom-style="{ marginBottom: '28rpx' }"
    />
    <view class="text">{{ text }}</view>
    <uv-button
      v-if="showButton"
      :text="buttonText"
      color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"
      :custom-style="{ width: '268rpx', height: '72rpx' }"
      :customTextStyle="{ fontSize: '28rpx' }"
      shape="circle"
      @click="confirm"
    />
  </view>
</template>

<script>
export default {
  options: {
    virtualHost: true,
  },
};
</script>
<script setup>
const props = defineProps({
  img: {
    default: "/static/images/empty/bill.png",
  },
  text: {
    default: "暂无内容",
  },
  showButton: {
    default: false,
  },
  buttonText: {
    default: "登录",
  },
  height: {
    default: "",
  },
  bgColor: {
    default: "",
  },
});
const emits = defineEmits(["confirm"]);
function confirm() {
  emits("confirm");
}
</script>

<style lang="scss">
.my-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  .text {
    font-size: 26rpx;
    color: var(--sub-color);
    line-height: 56rpx;
    margin-bottom: 24rpx;
  }
}
</style>

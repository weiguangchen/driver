<template>
  <view
    class="my-notice-bar"
    :style="{
      marginBottom,
    }"
  >
    <uv-icon
      name="/static/images/billDetail/notice_logo.png"
      width="36px"
      height="18px"
    />
    <view class="notice-content">
      <view class="notice-text-wrapper" :style="[animationStyle]">
        <view
          class="placeholder"
          :style="{
            width: containerWidth + 'px',
          }"
          v-if="isScroll"
        />
        <text class="notice-text">{{ text }}</text>
      </view>
    </view>
    <uv-icon name="/static/images/arrow.png" width="24rpx" height="24rpx" />
  </view>
</template>

<script setup>
import { onReady } from "@dcloudio/uni-app";
import { watch, getCurrentInstance, ref, unref, computed } from "vue";
const { ctx } = getCurrentInstance();

const props = defineProps({
  marginBottom: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
});

// 是否滚动
const isScroll = ref(true);
const speed = ref(80);
const animationDuration = ref("0");
const animationPlayState = ref("paused");
const animationStyle = computed(() => {
  let style = {};
  style.animationDuration = unref(animationDuration);
  style.animationPlayState = unref(animationPlayState);
  return style;
});
const containerWidth = ref(0);

async function genRect() {
  let boxWidth = 0,
    textWidth = 0;
  // 进行一定的延时
  await ctx.$uv.sleep();
  // 查询盒子和文字的宽度
  textWidth = (await ctx.$uv.getRect(".notice-text")).width;
  boxWidth = (await ctx.$uv.getRect(".notice-content")).width;
  isScroll.value = textWidth > boxWidth;
  console.log(
    "textWidth",
    textWidth,
    "boxWidth",
    boxWidth,
    "isScroll",
    isScroll.value
  );
  containerWidth.value = boxWidth;
  if (unref(isScroll)) {
    // 根据t=s/v(时间=路程/速度)，这里为何不需要加上#uv-notice-box的宽度，因为中设置了.uv-notice-content样式中设置了padding-left: 100%
    // 恰巧计算出来的结果中已经包含了#uv-notice-box的宽度
    animationDuration.value = `${
      (textWidth + boxWidth) / ctx.$uv.getPx(unref(speed))
    }s`;
    // 这里必须这样开始动画，否则在APP上动画速度不会改变
    animationPlayState.value = "paused";
    setTimeout(() => {
      animationPlayState.value = "running";
    }, 10);
  } else {
    animationPlayState.value = "paused";
  }
}

watch(props.text, () => genRect());

function init() {
  genRect();
}

onReady(() => {
  init();
});
</script>

<style lang="scss" scoped>
.my-notice-bar {
  height: 92rpx;
  padding: 0 24rpx;
  border-radius: 24rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .notice-content {
    display: flex;
    margin: 0 12rpx;
    flex: 1;
    font-size: 26rpx;
    color: #4e5356;
    overflow: hidden;
    flex-wrap: nowrap;

    // .notice-text {
    //   padding-left: 100%;
    //   word-break: keep-all;
    //   white-space: nowrap;
    //   animation: my-loop-animation 10s linear infinite both;
    // }

    .notice-text-wrapper {
      word-break: keep-all;
      white-space: nowrap;
      animation: my-loop-animation 10s linear infinite both;
      .placeholder {
        display: inline-block;
        width: 100%;
        height: 1px;
      }
    }
  }
}

@keyframes my-loop-animation {
  0% {
    transform: translate3d(0, 0, 0);
  }

  100% {
    transform: translate3d(-100%, 0, 0);
  }
}
</style>

<template>
  <view
    class="my-plate"
    :class="[color, `mode_${mode}`]"
    :style="[customStyle]"
  >
    <view class="inner">
      <view class="left">{{ left }}</view>
      <view class="right">{{ right }}</view>
    </view>
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
import { ref, computed, watchEffect } from "vue";
const props = defineProps({
  customStyle: {
    default: () => {},
    type: Object,
  },
  plate: {
    default: "京XXXXXX",
    type: String,
  },
  color: {
    default: "yellow",
    validator(value, props) {
      return ["yellow", "kelly", "blue", "gren"].includes(value);
    },
  },
  mode: {
    type: Number,
    default: 1,
  },
});
const left = ref();
const right = ref();
watchEffect(() => {
  if (!props.plate) return;
  left.value = props.plate.slice(0, 2);
  right.value = props.plate.slice(2);
});
</script>

<style lang="scss">
.my-plate {
  width: fit-content;
  display: flex;
  padding: 4rpx;
  height: 68rpx;
  border-radius: 12rpx;
  color: var(--title-color);
  font-weight: bold;
  font-size: 38rpx;

  .inner {
    font-family: misans;
    flex: 1;
    display: flex;
    border-radius: 10rpx;
    overflow: hidden;
    border: 2rpx solid var(--title-color);

    .left {
      padding: 0 10rpx;
      position: relative;
      display: flex;
      align-items: center;

      &::after {
        content: "";
        display: block;
        position: absolute;
        width: 8rpx;
        height: 8rpx;
        border-radius: 50%;
        background-color: var(--title-color);
        top: 50%;
        right: 0;
        transform: translate(50%, -50%);
      }
    }

    .right {
      display: flex;
      align-items: center;
      padding: 0 10rpx;
    }
  }

  &.yellow {
    background: #ffbd00;
  }
  &.kelly {
    background-color: #ffbd00;
    .left {
      background-color: transparent;
    }
    .right {
      background-color: #00ec7b;
    }
  }
  &.blue {
    background-color: #3773ff;
    color: #ffffff;
    .inner {
      border: 2rpx solid #ffffff;
      .left {
        &::after {
          background-color: #ffffff;
        }
      }
    }
  }
  &.gren {
    background: linear-gradient(180deg, #f8f8f8 0%, #00ec7b 100%);
  }

  &.mode_2 {
    font-size: 32rpx;
    height: 56rpx;
  }
  &.mode_3 {
    font-size: 26rpx;
    height: 52rpx;
  }
}
</style>

<template>
  <view class="type-select">
    <view
      class="type-select-item"
      v-for="item in options"
      :key="item.value"
      :class="{ active: props.modelValue === item.value }"
      @click="handleClick(item.value)"
    >
      {{ item.label }}
    </view>
  </view>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  modelValue: {
    type: String,
    default: "0",
  },
});
const emit = defineEmits(["update:modelValue"]);
const options = [
  {
    label: "高装",
    value: "1",
  },
  {
    label: "平装",
    value: "2",
  },
];
const handleClick = (value) => {
  emit("update:modelValue", value);
};
</script>
<style lang="scss" scoped>
.type-select {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .type-select-item {
    width: 156rpx;
    height: 72rpx;
    font-weight: 400;
    font-size: 28rpx;
    color: #73838e;
    border-radius: 8rpx;
    background: #f2f4f7;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
    &.active {
      background: var(--main-color);
      color: #ffffff;
      font-weight: 600;
    }
  }
}
</style>

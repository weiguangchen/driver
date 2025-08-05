<template>
  <view class="my-tabs">
    <view
      class="tabs-item"
      :class="{
        active:
          mode === 'single'
            ? innerValue === item.value
            : innerValue.includes(item.value),
      }"
      v-for="item in list"
      :key="item.value"
      @click="handleClick(item)"
    >
      {{ item.label }}
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
import { ref, nextTick, watchEffect } from "vue";

const props = defineProps({
  mode: {
    type: String,
    default: "single",
    // 多个默认值
    validator: (value) => {
      return ["single", "multiple"].includes(value);
    },
  },
  modelValue: {
    default: (rawProps) => {
      return rawProps.mode === "single" ? "" : [];
    },
  },
  list: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["change", "update:modelValue"]);

const innerValue = ref([]);

watchEffect(() => {
  innerValue.value = props.modelValue;
});

async function handleClick(item) {
  if (props.loading) return;
  if (props.mode === "single") {
    innerValue.value = item.value;
  }
  if (props.mode === "multiple") {
    if (innerValue.value.includes(item.value)) {
      const list = innerValue.value.filter((v) => v !== item.value);
      if (list.length === 0) {
        uni.showToast({
          title: "请至少保留一个统计维度",
          icon: "none",
        });
        return;
      }
      innerValue.value = list;
    } else {
      innerValue.value.push(item.value);
    }
  }
  const newVal =
    props.mode === "single" ? innerValue.value : [...innerValue.value];
  emits("update:modelValue", newVal);
  await nextTick();
  emits("change", newVal);
}
</script>

<style lang="scss" scoped>
.my-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72rpx;
  gap: 20rpx;
  .tabs-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    background: #fff;
    color: var(--sub-color);
    border-radius: 16rpx;
    font-size: 26rpx;

    &.active {
      background: linear-gradient(270deg, #31ce57 0%, #02b72e 100%);
      color: #fff;
    }
  }
}
</style>

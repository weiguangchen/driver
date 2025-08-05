<template>
  <root-portal>
    <my-drawer
      ref="drawer"
      :closeOnClickOverlay="false"
      title="选择车辆信息"
      @close="close"
    >
      <view class="my-dropdown-items">
        <view
          class="my-dropdown-item"
          :class="{ active: item.value === modelValue }"
          @click="selectType(item)"
          v-for="item in options"
          :key="item.value"
        >
          <view style="flex: 1">{{ item.label }}</view>
          <uv-image
            v-if="item.value === modelValue"
            src="/static/images/check.png"
            :duration="0"
            width="32rpx"
            height="32rpx"
          />
        </view>
      </view>
    </my-drawer>
  </root-portal>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
const props = defineProps({
  modelValue: {
    defalut: "",
  },
  options: {
    default: () => [],
    type: Array,
  },
});
const emits = defineEmits(["update:modelValue", "change"]);

const innerValue = ref("");
watchEffect(() => {
  innerValue.value = props.modelValue;
});

const drawer = ref();
function open() {
  drawer.value.popup.open();
}

function selectType(item) {
  emits("update:modelValue", item.value);
  if (item.value !== innerValue.value) {
    emits("change", item.value, item);
  }
  drawer.value.popup.close();
}

defineExpose({
  open,
});

function close() {
  uni.navigateBack();
}
</script>

<style lang="scss" scoped></style>

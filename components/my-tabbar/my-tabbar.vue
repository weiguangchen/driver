<template>
  <uv-tabbar
    :fixed="fixed"
    activeColor="var(--main-color)"
    inactiveColor="var(--sub-color)"
    :value="tabbarValue"
    @change="change"
  >
    <uv-tabbar-item
      :text="item.text"
      v-for="item in tabbarList"
      :key="item.text"
    >
      <template v-slot:active-icon>
        <image class="icon" :src="item.selectedIconPath"></image>
      </template>
      <template v-slot:inactive-icon>
        <image class="icon" :src="item.iconPath"></image>
      </template>
    </uv-tabbar-item>
  </uv-tabbar>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";

const props = defineProps({
  fixed: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(["change"]);

const appStore = useAppStore();
const { tabbarList, tabbarValue } = storeToRefs(appStore);

function change(index) {
  console.log("index", index);
  emits("change", index);

  uni.switchTab({
    url: tabbarList.value[index].pagePath,
    success() {
      tabbarValue.value = index;
    },
  });
}
</script>

<style lang="scss">
.icon {
  width: 48rpx;
  height: 48rpx;
}
</style>

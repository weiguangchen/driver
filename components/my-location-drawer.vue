<template>
    <my-drawer 
        ref="drawer" 
        title="测试" 
        :showTitle="false" 
        :closeOnClickOverlay="false" 
        bgColor="#ffffff" 
        customScrollView 
        asyncClose 
        :showCancelButton="locationConfig.LocationSwitch !== 'A'" 
        :cancelText="cancelText" 
        showConfirmButton 
        :confirmText="confirmText" 
        :z-index="2000"
        @confirm="confirm" 
        @cancel="cancel"
    >
        <view class="location-tip-drawer">
            <uv-image src="/static/images/location/location-drawer.png" width="750rpx" height="480rpx" />
            <view class="location-tip-content">
                <view class="title">请开启定位授权</view>
                <view class="desc">请将「位置信息」设为「使用小程序时和离开后允许」</view>
            </view>
        </view>
    </my-drawer>
</template>

<script setup>
import { ref, unref, watch, watchEffect } from "vue";
import { useLocationStore } from "@/stores/location.js";
import { storeToRefs } from "pinia";
import { getToken } from "@/utils/token.js";

const locationStore = useLocationStore();
const { locationConfig, userLocationBackground } = storeToRefs(locationStore);

defineProps({
    cancelText: {
        default: "暂不开启",
        type: String,
    },
    confirmText: {
        default: "立即设置",
        type: String,
    }
})

const drawer = ref();

function confirm() {
    uni.openSetting();
    unref(drawer).closeLoading();
}

function cancel() {
    close();
}

watch(
    [userLocationBackground, locationConfig],
    ([bgVal, configVal]) => {
        if (!drawer.value || !getToken()) return;
        const showSwitch = configVal.LocationSwitch === 'A' || configVal.LocationSwitch === 'B';
        if (!bgVal && showSwitch) {
            open();
        } else {
            close();
        }
    },
    { deep: true, flush: 'post' }
)




function open() {
    unref(drawer).popup.open();
}

function close() {
    unref(drawer).popup.close();
}

defineExpose({
    open,
    close,
});
</script>

<style lang="scss" scoped>
.location-tip-drawer {
    border-radius: 24rpx 24rpx 0 0;
    overflow: hidden;
    .location-tip-content {
        padding: 48rpx 36rpx;
        text-align: center;
        .title {
            font-size: 32rpx;
            font-weight: bold;
            color: var(--title-color);
            line-height: 56rpx;
            margin-bottom: 4rpx;
        }
        .desc {
            font-size: 26rpx;
            line-height: 48rpx;
            color: var(--sub-color);
        }
    }
}
</style>
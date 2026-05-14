<template>
    <view class="my-location-notice" v-if="isOpen">
        <uv-image v-if="locationConfig.IconType === 'Warning'" src="/static/images/location/warning.png" width="92rpx" height="92rpx" />
        <uv-image v-if="locationConfig.IconType === 'Position'" src="/static/images/location/position.png" width="92rpx" height="92rpx" />
        <view class="content">
            <view class="title uv-line-1">{{ locationConfig.TipTitle }}</view>
            <view class="desc uv-line-1">{{ locationConfig.TipRemark }}</view>
        </view>
        <uv-button 
            color="var(--dark-main)" 
            :custom-style="{
                borderRadius: '30rpx',
                width: '116rpx',
                height: '60rpx',
                fontWeight: '500',
            }"
            :custom-text-style="{
                color: '#fff',
                fontSize: '26rpx',
            }"
            @click="confirm"
        >
            设置
        </uv-button>
    </view>
</template>

<script setup lang="ts">
import { unref, computed } from "vue";
import { useLocationStore } from "@/stores/location.js";
import { storeToRefs } from "pinia";
import { getToken } from "@/utils/token.js";

const locationStore = useLocationStore();
const { locationConfig, userLocationBackground } = storeToRefs(locationStore);

const isOpen = computed(() => {
    if(unref(userLocationBackground) === null || !getToken()) return false;
    
    const showSwitch = unref(locationConfig).LocationSwitch === 'B' || unref(locationConfig).LocationSwitch === 'C';
    return !unref(userLocationBackground) && unref(locationConfig).TipTitle && showSwitch;
})

function confirm() {
    uni.openSetting();
}
</script>

<style lang="scss" scoped>
.my-location-notice {
    height: 124rpx;
    position: fixed;
    left: 32rpx;
    right: 32rpx;
    bottom: 200rpx;
    z-index: 200;
    display: flex;
    align-items: center;
    padding: 0 28rpx 0 16rpx;
    background: #000000;
    border-radius: 16rpx;
    .content {
        flex: 1;
        margin: 0 16rpx;
        .title {
            font-weight: 600;
            font-size: 28rpx;
            color: #FFFFFF;
            line-height: 40rpx;
        }
        .desc {
            font-size: 24rpx;
            color: #C8D4DF;
            line-height: 36rpx;
        }
    }
}
</style>
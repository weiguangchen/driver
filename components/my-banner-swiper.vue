<template>
    <view class="my-banner-swiper">
        <uv-swiper 
            :list="bannerList" 
            circular 
            :autoplay="autoplay" 
            bgColor="var(--page-bg)"
            :height="height"
            radius="24rpx"
            :interval="5000"
            indicator
            @click="clickHandler"
        >
        </uv-swiper>
    </view>
</template>

<script setup>
import { ref, computed, getCurrentInstance, watch } from 'vue';
import { onReady } from '@dcloudio/uni-app';
const { ctx } = getCurrentInstance();

const props = defineProps({
    list: {
        type: Array,
        default: () => [],
    },
    autoplay: {
        type: Boolean,
        default: true,
    },
});

const height = ref(96);
onReady(()=>{
    ctx.$uv.getRect('.my-banner-swiper').then(res=>{
        height.value = (res.width* 5)/18;
    })
})

const bannerList = computed(() => props.list?.map(m => m.Img));

const emit = defineEmits(['click']);

const clickHandler = (index) => {
    emit('click', index);
    const currentItem = props.list[index];

    const src = currentItem.LinkUrl;
    if (!src) return;
    uni.navigateTo({
        url: `/pages/webview/webview?src=${encodeURIComponent(src)}`
    })
}
</script>

<style lang="scss" scoped>

</style>
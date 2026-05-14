<template>
    <view class="demo">
        <uv-swiper 
            :list="bannerList" 
            circular 
            :autoplay="autoplay" 
            bgColor="transparent"
            :height="height"
            radius="24rpx"
            :interval="5000"
            indicator
            :previousMargin="12"
            :nextMargin="12"
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
        default: false,
    },
});

const height = ref(96);
onReady(()=>{
    ctx.$uv.getRect('.demo').then(res=>{
        console.log('demo rect',res)
        height.value = ((res.width - 24) * 5)/18;
        console.log('demo height',height.value)
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
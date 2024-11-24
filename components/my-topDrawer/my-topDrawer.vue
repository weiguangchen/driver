<template>
	<uv-popup 
		ref="popup" 
		mode="top" 
		safeAreaInsetTop
		:custom-style="{ minHeight: '100rpx' }" 
		:duration="duration"
		:overlay="overlay"
		:zIndex="zIndex"
		:overlayOpacity="overlayOpacity"
		:overlayStyle="overlayStyle"
		:closeOnClickOverlay="closeOnClickOverlay"
		:round="round"
		:bgColor="bgColor"
		@change="change"
	>
		<view class="drawer-wrapper">
			<view class="title-wrapper">{{ title }}</view>
			<scroll-view scroll-y="true" class="scroll-view" :style="{height: `${scrollHeight}px` }">
				<view class="scroll-view-wrapper">
					<slot></slot>
				</view>
			</scroll-view>
			<view class="modal-footer" v-if="showConfirmButton">
				<slot name="footer">
					<uv-button text="确认" color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"  @click="confirm" :loading="loading" />
				</slot>
			</view>
		</view>
	</uv-popup>
</template>

<script setup>
	import {
		ref,
		getCurrentInstance,
		nextTick,
		computed,
	} from 'vue'
	import {
		onReady
	} from '@dcloudio/uni-app';
	const {
		ctx
	} = getCurrentInstance();

	const props = defineProps({
		title: {
			default: ''
		},
		height: {
			default: 300
		},
		// 动画时长，单位ms
		duration: {
			type: [String, Number],
			default: 300
		},
		// 层级
		zIndex: {
			type: [String, Number],
			default: 10075
		},
		// 是否显示遮罩
		overlay: {
			type: Boolean,
			default: true
		},
		// 点击遮罩是否关闭弹窗
		closeOnClickOverlay: {
			type: Boolean,
			default: true
		},
		// 遮罩的透明度，0-1之间
		overlayOpacity: {
			type: [Number, String],
			default: 0.4
		},
		// 自定义遮罩的样式
		overlayStyle: {
			type: [Object, String],
			default: ''
		},
		round: {
			type: [Number, String],
			default: 12
		},
		bgColor: {
			type: String,
			default: '#F2F4F7'
		},
		showConfirmButton: {
			type: Boolean,
			default: true
		},
		asyncClose: {
			type: Boolean,
			default: false
		}
	})
	
	const emits = defineEmits(['confirm'])
	const popup = ref(null);

	// scroll-view高度
	const scrollHeight = computed(() => {
		return contentHeight.value < props.height ? contentHeight : props.height;
	})
	// 内容高度
	const contentHeight = ref(0)
	async function change(show) {
		await nextTick()
		if (show.show) {
			resize()
		}
		console.log(props)
	}
	
	async function resize() {
		let rectInfo = await ctx.$uv.getRect('.scroll-view-wrapper');
		contentHeight.value = rectInfo.height;
	}
	
	// 确认按钮
	const loading = ref(false)
	function confirm() {
		if(props.asyncClose) {
			loading.value = true;
		}else {
			popup.value.close()
		}
		emits('confirm')
	}
	function closeLoading() {
		loading.value = false;
	}
	
	defineExpose({
		resize,
		popup,
		closeLoading
	})
</script>

<style lang="scss" scoped>
	.drawer-wrapper {
		.title-wrapper {
			padding: 20rpx 0 20rpx 32rpx;
			color: $title-color;
			font-size: 34rpx;
			font-weight: bold;
			height: 44px;
		}

		.scroll-view {
			
		}
		
		.modal-footer {
			padding: 24rpx;
		}
	}
</style>
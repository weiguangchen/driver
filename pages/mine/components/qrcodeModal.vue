<template>
	<my-popup ref="popup" @change="change" mode="center" :custom-style="{ minHeight: '300rpx' }" bgColor="none" :duration="0">
		<view class="qrcode-modal">
			<view class="person">
				<uv-image src="/static/images/mine/avatar.png" width="120rpx" height="120rpx" :duration="0" :custom-style="{ marginRight: '24rpx' }"/>
				<view class="user">
					<view class="name" v-if="userInfo">{{ userInfo.Nickname }}</view>
					<view class="phone" v-if="userInfo">{{ userInfo.Mobile }}</view>
				</view>
			</view>
			<view class="qrcode-wrapper">
				<uv-qrcode ref="qrcode" :start="false" size="430rpx" value="https://h5.uvui.cn"></uv-qrcode>
			</view>
		</view>
	</my-popup>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { getToken } from '@/utils/token.js';
	import { useUserStore } from '@/stores/user.js';
	import { storeToRefs } from 'pinia';
	
	const userStore = useUserStore();
	const { userInfo } = storeToRefs(userStore);
	
	const popup = ref();
	const qrcode = ref();
	function open() {
		if(!getToken()) {
			return;
		}
		popup.value.open();
	}
	
	const init = ref(false)
	function change({ show }) {
		if(show && !init.value) {
			qrcode.value.make({
				success() {
					init.value = true;
				}
			});
		}
	}
	
	defineExpose({
		open
	})
</script>

<style lang="scss" scoped>
	.qrcode-modal {
		width: 646rpx;
		background: url(/static/images/mine/mask2.png) right top 52rpx/260rpx 192rpx no-repeat,
					linear-gradient(360deg, #F2F4F7 50%, #D4FFDF 100%);
		border-radius: 48rpx;
		padding: 48rpx;
		.person {
			display: flex;
			align-items: center;
			margin-bottom: 28rpx;
			.user {
				.name {
					font-weight: bold;
					font-size: 40rpx;
					color: var(--title-color);
					line-height: 40rpx;
					margin-bottom: 16rpx;
				}
				.phone {
					font-size: 26rpx;
					color: var(--content-color);
					line-height: 36rpx;
				}
			}
		}
		.qrcode-wrapper {
			background: #FFFFFF;
			border-radius: 32rpx;
			padding: 60rpx;
		}
	}
</style>
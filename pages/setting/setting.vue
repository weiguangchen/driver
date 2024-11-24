<template>
	<view class="item" hover-class="active" hover-start-time="0" hover-stay-time="200">
		<view class="label">个人信息设置</view>
		<view class="value">
			<uv-icon name="arrow-right" color="#000000" size="24rpx"/>
		</view>
	</view>
	<view class="item-group">
		<view class="item" hover-class="active" hover-start-time="0" hover-stay-time="200">
			<view class="label">隐私协议</view>
			<view class="value">
				<uv-icon name="arrow-right" color="#000000" size="24rpx"/>
			</view>
		</view>
		<view class="item" hover-class="active" hover-start-time="0" hover-stay-time="200">
			<view class="label">关于我们</view>
			<view class="value">
				<uv-icon name="arrow-right" color="#000000" size="24rpx"/>
			</view>
		</view>
	</view>
	<view class="page-footer">
		<uv-button text="退出登录" color="var(--page-bg)" :custom-style="{ height: '96rpx', borderRadius: '16rpx' }"
			:customTextStyle="{ color: 'var(--red-color)' }" @click="logout"/>
	</view>
</template>

<script setup>
	import { useUserStore } from '@/stores/user.js';
	const userStore = useUserStore();
	
	function logout() {
		userStore.logout()
		uni.reLaunch({
			url: '/pages/index/index'
		})
	}
</script>

<style lang="scss">
	page {
		padding: 24rpx;
	}
	.item-group {
		border-radius: 24rpx;
		background: #FFFFFF;
		.item {
			margin-bottom: 0!important;
		}
	}
	.item {
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 32rpx 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 30rpx;
		line-height: 48rpx;
		margin-bottom: 20rpx;
		.label {
			color: var(--title-color);
		}
		&.active {
		}
	}
</style>
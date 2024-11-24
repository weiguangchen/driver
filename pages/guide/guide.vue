<template>
	<uv-tabs :scrollable="false" :list="list" :active-style="{ fontWeight: 'bold', color: 'var(--title-color)' }" :inactive-style="{ color: 'var(--sub-color)' }" :custom-style="{ background: '#ffffff' }" lineWidth="32rpx" lineHeight="8rpx"  line-color="var(--main-color)"></uv-tabs>
	<view class="list-wrapper">
		<view class="list">
			<view class="item my-border-bottom">
				<view class="label">如何接单？</view>
				<uv-image src="/static/images/arrow.png" width="24rpx" height="24rpx" :duration="0"/>
			</view>
			<view class="item my-border-bottom">
				<view class="label">已到达装货地，如何操作才能顺利进入厂家并完成装货？</view>
				<uv-image src="/static/images/arrow.png" width="24rpx" height="24rpx" :duration="0"/>
			</view>
			<view class="item my-border-bottom">
				<view class="label">如何提交反馈？</view>
				<uv-image src="/static/images/arrow.png" width="24rpx" height="24rpx" :duration="0"/>
			</view>
			<view class="item">
				<view class="label">这里的问题是配置的，链接到公众号。</view>
				<uv-image src="/static/images/arrow.png" width="24rpx" height="24rpx" :duration="0"/>
			</view>
		</view>
	</view>
	
</template>

<script setup>
import { ref } from 'vue';
	const list = ref([
		{
			name: '问题类型'
		},
		{
			name: '问题类型'
		},
		{
			name: '问题类型'
		},
	])
</script>

<style lang="scss">
	.list-wrapper {
		padding: 24rpx;
	}
	.list {
		padding: 0 24rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		.item {
			padding: 36rpx 0;
			position: relative;
			padding-left: 36rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 28rpx;
			color: var(--title-color);
			line-height: 36rpx;
			.label {
				margin-right: 26rpx;
			}
			&::before {
				content: '';
				display: block;
				width: 12rpx;
				height: 12rpx;
				border-radius: 50%;
				background-color: var(--main-color);
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
	
</style>

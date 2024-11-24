<template>
	<view class="result-wrapper">
		<uv-image src="/static/images/feedback.png" width="176rpx" height="176rpx" :custom-style="{ marginBottom: '64rpx' }"/>
		<view class="title">反馈提交成功</view>
		<view class="sub">我们会尽快处理，感谢您的反馈</view>
	</view>
	<uv-button text="好的" color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"></uv-button>
</template>

<script >
</script>

<style lang="scss">
	page {
		padding: 24rpx;
	}
	.result-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 72rpx 0 64rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		margin-bottom: 48rpx;
		text-align: center;
		.title {
			font-weight: 500;
			font-size: 34rpx;
			color: #000000;
			line-height: 48rpx;
			margin-bottom: 12rpx;
		}
		.sub {
			font-size: 28rpx;
			color: var(--sub-color);
			line-height: 40rpx;
		}
	}
</style>
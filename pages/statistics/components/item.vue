<template>
	<view class="stat-item">
		<view class="info">
			<view class="item my-border-bottom">
				<view class="label">物料</view>
				<view class="value">超级机制砂</view>
			</view>
			<view class="item my-border-bottom">
				<view class="label">装货</view>
				<view class="value">河南腾圃商贸有限公司 (新野骨料)</view>
			</view>
			<view class="item">
				<view class="label">卸货</view>
				<view class="value">河南腾圃商贸有限公司</view>
			</view>
		</view>
		<view class="number-wrapper">
			<view class="number-item">
				<view class="label">合计金额 (元)</view>
				<view class="value">35,856.09</view>
			</view>
			<uv-line direction="col" color="var(--divider)" length="56rpx"/>
			<view class="number-item">
				<view class="label">合计重量 (吨)</view>
				<view class="value">326.03</view>
			</view>
			<uv-line direction="col" color="var(--divider)" length="56rpx"/>
			<view class="number-item">
				<view class="label">合计车次 (次)</view>
				<view class="value">36</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	
</script>

<style lang="scss" scoped>
	.stat-item {
		margin: 0 0 20rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 24rpx 24rpx 28rpx;
		.info {
			padding: 0 24rpx;
			background: var(--page-bg);
			border-radius: 16rpx;
			margin-bottom: 24rpx;
			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 24rpx 4rpx;
				font-size: 26rpx;
				.label {
					color: var(--content-color);
				}
				.value {
					font-weight: bold;
					color: var(--title-color);
				}
			}
		}
		.number-wrapper {
			display: flex;
			align-items: center;
			.number-item {
				flex:1;
				text-align: center;
				.label{
					font-size: 26rpx;
					color: var(--content-color);
					line-height: 48rpx;
				}
				.value {
					font-weight: bold;
					font-size: 30rpx;
					color: var(--title-color);
					line-height: 48rpx;
				}
			}
		}
	}
</style>
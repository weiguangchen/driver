<template>
	<!-- 导航 -->
	<uv-navbar placeholder @leftClick="leftClick">
		<template #center>
			<view class="navbar-content" :style="{ paddingRight: `${navbarPad}px` }">
				<view class="">数据统计</view>
				<FilterDrawer ref="filter" @change="changeFilter" />
			</view>
		</template>
	</uv-navbar>
	<!-- 统计合计 -->
	<view class="stat-total">
		<view class="total-item left">
			<view class="title">合计重量（吨）</view>
			<view class="number">5,535.69</view>
		</view>
		<view class="total-item right">
			<view class="title">合计车次 (次）</view>
			<view class="number">52</view>
		</view>
	</view>
	<!-- 列表 -->
	<view class="list-wrapper">
		<view class="title">统计详情</view>
		<Item v-for="item in 30"/>
		<uv-load-more status="nomore" color="#B0BECC"/>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import FilterDrawer from './components/my-filter-drawer.vue';
	import Item from './components/item.vue';
	// 自定义导航条
	const navbarPad = ref(0);
	onLoad(() => {
		let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
		navbarPad.value = menuButtonInfo.width + 20;
	});
	function leftClick() {
		uni.navigateBack()
	}
</script>

<style lang="scss">
	page {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	.navbar-content {
		padding-left: 46px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.stat-total {
		padding: 24rpx;
		display: flex;
		background-color: #ffffff;
		.total-item {
			flex:1;
			padding: 32rpx 32rpx 28rpx;
			background: #02B72E;
			border-radius: 24rpx;
			.title {
				font-weight: bold;
				font-size: 28rpx;
				color: var(--title-color);
				line-height: 40rpx;
			}
			.number {
				font-weight: bold;
				font-size: 36rpx;
				line-height: 64rpx;
			}
		}
		.left {
			margin-right: 22rpx;
			background: url(/static/images/stat/left.png) no-repeat right 12rpx top 12rpx/72rpx 72rpx,
						rgba(2, 183, 46, .08);
			.number {
				color: var(--main-color);
			}
		}
		.right {
			background: url(/static/images/stat/right.png) no-repeat right 12rpx top 12rpx/72rpx 72rpx,
						rgba(252, 126, 44, .08);
			.number {
				color: #FC7E2C;
			}
		}
	}

	.list-wrapper {
		padding: 24rpx 24rpx calc(var(--safe-area-inset-bottom) + 24rpx);
		.title {
			padding: 8rpx 8rpx 20rpx;
			font-weight: bold;
			font-size: 32rpx;
			color: var(--title-color);
			line-height: 40rpx;
		}
	}
</style>
<template>
	<my-drawer title="运单跟踪" ref="drawer">
		<view class="step-list">
			<view class="step" :class="{'active': index === list.length - 1}"  v-for="(item,index) in list">
				<view class="content">
					<view class="name">{{ item.name }}</view>
					<view class="date">{{ item.date }}</view>
				</view>
				<view class="box" >
					<view class="dot"></view>
					<view class="line" v-if="index < list.length - 1"></view>
				</view>
			</view>
		</view>
	</my-drawer>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	const list = ref([{
		name: '司机接单',
		date: '2023-09-08 20:08'
	}, {
		name: '司机到达装货厂家',
		date: '2023-09-08 20:08'
	}, {
		name: '车辆入厂',
		date: '2023-09-08 20:08'
	}, {
		name: '车辆入库',
		date: '2023-09-08 20:08'
	}, {
		name: '开始装车',
		date: '2023-09-08 20:08'
	}, {
		name: '装车完成',
		date: '2023-09-08 20:08'
	}, {
		name: '车辆出厂',
		date: '2023-09-08 20:08'
	}, {
		name: '司机/货主确认完成卸货',
		date: '2023-09-08 20:08'
	}, {
		name: '司机/货主取消运单',
		date: '2023-09-08 20:08'
	}])

	const drawer = ref()

	function open() {
		drawer.value.popup.open()
	}
	
	defineExpose({
		open
	})
</script>

<style lang="scss">
	.step-list {
		padding: 24rpx;

		.step {
			padding-left: 48rpx;
			margin-bottom: 16rpx;
			position: relative;
			
			&.active {
				.content {
					.name {
						color: var(--main-color);
						font-weight: bold;
					}
				}
				.box {
					.dot {
						width: 18rpx;
						height: 18rpx;
						background-color: var(--main-color);
					}
				}
			}

			.content {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: #FFFFFF;
				border-radius: 16rpx;
				padding: 32rpx;
				line-height: 48rpx;

				.name {
					font-size: 28rpx;
					color: var(--content-color);
				}

				.date {
					font-size: 24rpx;
					color: var(--intr-color);
				}
			}
			.box {
				width: 18rpx;
				position: absolute;
				top: 50%;
				left: 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				.dot {
					width: 10rpx;
					height: 10rpx;
					border-radius: 50%;
					background-color:#C8D4DF;
				}
				.line {
					margin-top: 14rpx;
					height: 92rpx;
					width: 1px;
					background-color: #E3E9EF;
				}
			}
			
		}
	}
</style>
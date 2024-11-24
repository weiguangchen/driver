<template>
	<uv-radio-group v-model="isDefault" @change="setDefault">
		<view class="car" :class="{'car1': item.Cartype === '自卸车','car2': item.Cartype === '半挂车' ,'car3': item.Cartype === '罐车'}" v-for="item in carList" :key="item.Id">
			<view class="car-info my-border-bottom">
				<view class="top">
					<my-plate :customStyle="{ marginBottom: '16rpx' }" :plate="item.Carno" :color="item.Color"/>
					<view class="type">{{ item.Cartype }}</view>
				</view>
				<view class="status free">空闲</view>
			</view>
			<view class="car-btns my-flex">
				<uv-radio :name="item.Carno" activeColor="var(--main-color)">
					<view :style="{
						fontWeight: item === isDefault ? 'bold' : 'normal',
						color: item === isDefault ? 'var(--main-color)' : 'var(--content-color)'
					}">设为当前车辆</view>
				</uv-radio>
				<view class="btns">
					<view class="btn" @click="remove(item)" v-if="item.Isdefault === '0'">
						<uv-image src="/static/images/remove.png" width="32rpx" height="32rpx"
							:custom-style="{ marginRight: '8rpx' }" :duration="0" />
						删除
					</view>
					<view class="btn" @click="edit(item)">
						<uv-image src="/static/images/edit.png" width="32rpx" height="32rpx"
							:custom-style="{ marginRight: '8rpx' }" :duration="0" />
						修改
					</view>
				</view>
			</view>
		</view>
		<view class="tip">
			还可以添加 <text style="color: var(--main-color);font-weight: bold;">3</text> 辆车
		</view>
	</uv-radio-group>
	<view class="page-footer">
		<uv-button text="+ 添加车辆" color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%);" @click="add" />
	</view>
		
	<my-confirm ref="modal"/>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import { onShow } from '@dcloudio/uni-app'
	import { storeToRefs } from 'pinia'
	import { useUserStore } from '@/stores/user.js'
	import { SetDriverCarDefault, DiabledDriverCar } from '@/api/index.js'
	const userStore = useUserStore();
	const { carList } = storeToRefs(userStore)
	// 默认车辆
	const isDefault = ref();
	onShow(async () => {
		await userStore.getCarList()
		isDefault.value = userStore.defaultCar?.Carno ?? '';
	})

	function add() {
		uni.navigateTo({
			url: `/pages/addCar/addCar`,
			success(res) {
				res.eventChannel.emit('setData', {
					data: null
				})
			}
		})
	}
	const modal = ref();
	function remove(record) {
		modal.value.confirm({
			title: '确定删除车辆？',
			content: '您的运单记录不会被影响',
			cancelText: '再想想',
			confirmText: '删除',
			asyncClose: true,
			async confirm() {
				try {
					await DiabledDriverCar({
						id: record.Id
					})
					await userStore.getCarList()
					modal.value.close();
				}catch {
					modal.value.closeLoading();
				}
			}
		})
	}
	function edit(record) {
		uni.navigateTo({
			url: `/pages/addCar/addCar`,
			success(res) {
				res.eventChannel.emit('setData', {
					data: record
				})
			}
		})
	}
	async function setDefault(carno) {
		uni.showLoading({
			mask: true,
		})
		await SetDriverCarDefault({
			carno
		})
		uni.hideLoading()
		await userStore.getCarList()
	}
</script>

<style lang="scss">
	page {
		padding: 24rpx 24rpx 140rpx;
	}

	.car {
		width: 100%;
		padding: 0 28rpx;
		border-radius: 24rpx;
		margin-bottom: 20rpx;
		background: #FFFFFF;

		&.car1 {
			background: url(/static/images/carType/car1-right.png) no-repeat right 36rpx/340rpx 200rpx #FFFFFF;
		}

		&.car2 {
			background: url(/static/images/carType/car2-right.png) no-repeat right 36rpx/340rpx 200rpx #FFFFFF;
		}

		&.car3 {
			background: url(/static/images/carType/car3-right.png) no-repeat right 36rpx/340rpx 200rpx #FFFFFF;
		}

		.car-info {
			height: 272rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 32rpx 0;
			
			.number {
				background: #A0AFBA;
				border-radius: 12rpx;
				height: 64rpx;
				line-height: 64rpx;
				margin-bottom: 16rpx;
			}
			
			.type {
				color: var(--sub-color);
				font-size: 26rpx;
			}
			
			.status {
				width: fit-content;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 48rpx;
				padding: 0 12rpx;
				font-size: 26rpx;
				border-radius: 8rpx;
				border: 1rpx solid;
				font-weight: bold;
			
				&.free {
					border-color: var(--main-color);
					color: var(--main-color);
					background-color: #E7F9E9;
				}
			
				&.work {
					border-color: #FC7E2C;
					color: #FC7E2C;
					background-color: #FFF7F1;
				}
			}
		}

		.car-btns {
			padding: 32rpx 0;
			font-size: 28rpx;

			.btns {
				display: flex;

				.btn {
					display: flex;
					align-items: center;
					margin-left: 44rpx;
					font-size: 28rpx;
					color: var(--sub-color);
				}
			}
		}
	}

	.tip {
		width: 100%;
		text-align: center;
		font-size: 26rpx;
		color: var(--sub-color);
		line-height: 48rpx;
	}
</style>
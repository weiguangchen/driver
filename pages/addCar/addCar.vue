<template>
	<view class="tip">每天最多添加/修改 3 次车辆信息，今日剩余次数：3</view>
	<view class="form-wrapper">
		<uv-form errorType="toast" :model="model" :rules="rules" ref="form" label-width="140rpx">
			<view class="number-wrapper">
				<uv-form-item labelPosition="top" label="车牌号码" prop="Carno">
					<CarNumber v-model="model.Carno" />
				</uv-form-item>
			</view>
			<view class="form-box">
				<uv-form-item labelPosition="left" label="车牌颜色" prop="Color" borderBottom>
					<SelectColor v-model="model.Color" />
				</uv-form-item>
				<uv-form-item labelPosition="left" label="车辆类型" prop="Cartype">
					<SelectCarType v-model="model.Cartype" />
				</uv-form-item>
			</view>
		</uv-form>
		<view class="agreement">* 车辆信息仅用于接单适配，XXXX会严格保护您的信息</view>
	</view>


	<view class="page-footer">
		<view class="btns">
			<view class="left" v-if="model.Id">
				<uv-button text="删除车辆" color="#FFF0EE"
					:customTextStyle="{ fontSize: '30rpx', color: 'var(--red-color)' }"
					:custom-style="{ borderRadius: '16rpx', height: '96rpx' }" @click="remove" />
			</view>
			<view class="right">
				<uv-button text="确认添加" @click="submit" color=" linear-gradient( 270deg, #31CE57 0%, #07B130 100%)"
					:loading="loading" :custom-style="{ borderRadius: '16rpx', height: '96rpx' }"
					:customTextStyle="{ fontSize: '30rpx' }" />
			</view>
		</view>
	</view>

	<!-- 弹窗 -->
	<my-confirm ref="modal" />

</template>

<script setup>
	import {
		ref,
		onMounted,
		getCurrentInstance
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import SelectColor from './components/SelectColor.vue';
	import SelectCarType from './components/SelectCarType.vue';
	import CarNumber from './components/CarNumber.vue';
	import {
		UptOrNewDriverCar,
		DiabledDriverCar
	} from '@/api/index.js'
	import { useUserStore } from '@/stores/user.js'
	const userStore = useUserStore()

	onMounted(() => {
		const instance = getCurrentInstance().proxy
		const eventChannel = instance.getOpenerEventChannel();
		eventChannel.on('setData', function({ data }) {
			console.log('setData', data)
			if(data) {
				model.value = {
					Id: data.Id,
					Carno: data.Carno,
					Color: data.Color,
					Cartype: data.Cartype
				};
			}
			uni.setNavigationBarTitle({
				title: data ? '编辑车辆' : '添加车辆'
			})
		})
	})

	const form = ref(null)
	const model = ref({
		Id:'',
		Carno: '',
		Color: '',
		Cartype: ''
	})
	const rules = ref({
		Carno: [{
			validator: (rule, value, callback) => {
				if (!value) return false;
				const arr = value.split('');
				const isOk1 = arr.slice(0, 7).every(m => m !== " ");
				const isOk2 = arr.slice(0, 8).every(m => m !== " ");
				return isOk1 || isOk2;
			},
			message: '请填写正确的车牌号'
		}],
		Color: {
			required: true,
			message: '请选择颜色',
			trigger: ['blur', 'change']
		},
		Cartype: {
			required: true,
			message: '请选择类型',
			trigger: ['blur', 'change']
		},
	})

	const loading = ref(false)

	function remove() {
		modal.value.confirm({
			title: '确定删除车辆？',
			content: '您的运单记录不会被影响',
			cancelText: '再想想',
			confirmText: '删除',
			asyncClose: true,
			async confirm() {
				try {
					await DiabledDriverCar({
						id: model.value.Id
					})
					await userStore.getCarList()
					await uni.showToast({
						title: '操作成功',
						icon: 'none',
						complete() {
							setTimeout(() => {
								uni.navigateBack()
							},1500)
						}
					})
					modal.value.close();
				} catch(err){
					uni.showToast({
						title: err.data,
						icon: 'none'
					})
					modal.value.closeLoading();
				}
			}
		})
	}

	function submit() {
		loading.value = true;
		uni.showLoading({
			mask: true
		})
		form.value.validate()
			.then(() => UptOrNewDriverCar(model.value))
			.then(async () => {
				await userStore.getCarList()
				uni.showToast({
					title: '车辆添加成功',
					success() {
						uni.navigateBack()
					}
				})
			})
			.catch(err => {
				console.log('err', err)
			})
			.finally(() => {
				uni.hideLoading()
				loading.value = false;
			})
	}

	const modal = ref();
</script>

<style lang="scss">
	page {
		padding: 0 0 140rpx;
	}

	.tip {
		padding: 12rpx 32rpx;
		background-color: #FFF7F1;
		font-weight: bold;
		font-size: 24rpx;
		color: #FC7E2C;
		line-height: 48rpx;
	}

	.form-wrapper {
		padding: 24rpx;

		.number-wrapper {
			.uv-form-item__body__left {
				margin-bottom: 24rpx !important;
			}
		}

		.form-box,
		.number-wrapper {
			margin-bottom: 20rpx;
			background-color: #FFFFFF;
			border-radius: 24rpx;
			padding: 0 24rpx;

			.uv-form-item__body__left__content__label {
				font-size: 28rpx !important;
				color: #4E5356 !important;
			}

			.uv-form-item__body {
				padding: 32rpx 0 !important;
			}
		}

		.agreement {
			font-size: 24rpx;
			color: var(--sub-color);
			line-height: 48rpx;
		}
	}
</style>
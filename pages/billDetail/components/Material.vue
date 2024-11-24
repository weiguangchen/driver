<template>
	<view class="material" :class="{'uv-border-bottom': borderBottom, 'has-border': borderBottom}">
		<view class="left">
			<view class="name">{{ record.MaterialName }}</view>
			<view class="info">
				<template v-if="record.Limittype === '1'">可接 {{ record.EstimateWeight }} 吨</template>
				<template v-if="record.Limittype === '2'">可接 {{ record.EstimateTimes }} 车次</template>
				<template v-if="record.Realheight">，当前库高 {{ record.Realheight }} 米</template>
			</view>
		</view>
		<view class="right">
			<view class="btn">
				<uv-button :disabled="disabled" shape="circle" :color="disabled ? '#B0BECC' : 'linear-gradient( 270deg, #31CE57 0%, #07B130 100%)'" text="接单" :custom-style="{ height: '68rpx' }" @click="openDrawer"></uv-button>
			</view>
		</view>
	</view>

	<my-drawer title="设置预计装运量" ref="drawer" showConfirmButton confirmText="确认订单" bgColor="#FFFFFF" asyncClose @confirm="confirm">
		<view class="form-wrapper">
			<uv-form labelPosition="left" :model="model" :rules="rules" ref="form">
				<uv-form-item prop="FullLoad" :customStyle="{ padding: '28rpx 0' }" v-if="bill.ConfigEnt.fullLoad === '1'">
					<template #label>
						<view class="main-title">满载拉运</view>
						<view class="sub-title">开启后，自动测量车辆满载值</view>
					</template>
					<view style="display: flex;justify-content: flex-end;">
						<uv-switch v-model="model.FullLoad" active-color="var(--main-color)" @change="changeIsFull" activeValue="1" inactiveValue="0"/> 
					</view>
				</uv-form-item>
				<uv-form-item prop="Load" :customStyle="{ padding: '28rpx 0' }" v-if="model.FullLoad === '0'">
					<template #label>
						<view class="main-title">预装总重（毛重）</view>
						<view class="sub-title">限 {{ bill.ConfigEnt ? bill.ConfigEnt.fullLoadMin ? bill.ConfigEnt.fullLoadMin : 0 : 0 }} ~ {{ bill.ConfigEnt ? bill.ConfigEnt.fullLoadMax ? bill.ConfigEnt.fullLoadMax : '' : '' }} 吨</view>
					</template>
					<view style="display: flex;justify-content: flex-end;">
						<my-number-box v-model="model.Load" :min="bill.ConfigEnt ? bill.ConfigEnt.fullLoadMin ? bill.ConfigEnt.fullLoadMin : 0 : 0" :max="bill.ConfigEnt ? bill.ConfigEnt.fullLoadMax ? bill.ConfigEnt.fullLoadMax : undefined : undefined"/>
					</view>
				</uv-form-item>
			</uv-form>
			<view class="tip">本次预估装运物料 {{ Suttle }} 吨，结算请以实际装运为准</view>
		</view>
	</my-drawer>
</template>
<script>
	export default {
		options: {
			virtualHost: true
		}
	}
</script>
<script setup>
	import {
		computed,
		nextTick,
		reactive,
		ref,
		watchEffect
	} from 'vue';
	import { sleep } from '@/utils/index.js';
	import Big from 'big.js'
	import { DriverMakeOnway } from '@/api/index.js';
	import { getToken } from '@/utils/token.js'

	const props = defineProps({
		borderBottom: {
			default: false
		},
		record: {
			default: () => {}
		},
		bill: {
			default: () => {}
		}
	})
	// 按钮禁用
	const disabled = computed(() => {
		return props.bill.EntryAuthened === '0' || (props.bill.EntryAuthened === '1' && props.record.ReceiveAble === '0')
	})
	
	const emits = defineEmits(['confirm'])
	const model = reactive({
		FullLoad: false,
		Load: 0
	})
	const rules = reactive({
		Load: [{ require: true, message: '请填写预计总重' }]
	})
	watchEffect(() => {
		if(props.record) {
			model.FullLoad = props.record.FullLoad;
			model.Load = props.record.Load;
		}
	})
	
	async function changeIsFull(val) {
		console.log('val',val)
		await nextTick()
		drawer.value.resize();
	}
	const Suttle = computed(() => {
		const map = {
			'半挂车': 'bgTare',
			'自卸车': 'zxTare',
			'罐车': 'gcTare'
		}
		const carType = props.bill?.CarEnt?.CarType ?? '';
		const carTare = map?.[carType] ?? 0;
		const carWeight = props.bill?.ConfigEnt?.[carTare] ?? 0;
		if(model.FullLoad) {
			return Big(props.bill?.ConfigEnt?.FullLoadGross || 0).minus(carWeight).toFixed(2)
		}else {
			return Big(model.Load || 0).minus(carWeight).toFixed(2)
		}
	})

	const drawer = ref();

	function openDrawer() {
		drawer.value.popup.open()
	}
	function change(val) {
		console.log('val',val)
	}
	
	async function confirm() {
		try {
			// console.log('model',model)
			const tokenData = getToken();
			const params = {
				AssignId: props.bill.Id,
				SupplyId: props.bill?.SupEnt?.Id,
				Customer: props.bill.OwnerEnt.Id,
				DriverId: tokenData?.userInfo?.Id,
				Material: props.record.Material,
				MatName: props.record.MaterialName,
				FullLoad: model.FullLoad,
				Load: model.FullLoad ? props?.bill?.ConfigEnt?.fullLoadGross : model.Load,
				Suttle: Suttle.value
			}
			console.log('接单参数',params)
			await DriverMakeOnway(params)
			uni.showToast({
				title: '接单成功',
				icon: 'none'
			})
			emits('confirm')
			drawer.value.popup.close();
		}
		catch {
			uni.showToast({
				title: '接单失败',
				icon: 'none'
			})
			drawer.value.closeLoading();
		}
	}
</script>

<style lang="scss" scoped>
	.material {
		padding: 0 4rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.left {
			line-height: 48rpx;

			.name {
				font-weight: bold;
				font-size: 30rpx;
				color: var(--title-color);
			}

			.info {
				font-size: 26rpx;
				color: var(--content-color);
			}
		}

		.btn {
			width: 168rpx;
		}
		&.has-border {
			padding-bottom: 24rpx;
			margin-bottom: 24rpx;
		}
	}

	.form-wrapper {
		padding: 0 24rpx;

		.main-title {
			font-weight: bold;
			font-size: 30rpx;
			color: var(--title-color);
			line-height: 48rpx;
		}

		.sub-title {
			font-size: 24rpx;
			color: var(--sub-color);
			line-height: 32rpx;
		}

		.tip {
			margin-top: 20rpx;
			padding: 28rpx 0;
			text-align: center;
			background: var(--page-bg);
			border-radius: 16rpx;
			font-size: 24rpx;
			color: var(--content-color);
			line-height: 32rpx
		}
	}
</style>
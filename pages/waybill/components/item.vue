<template>
	<view class="bill" @click="toDetail">
		<view class="tag" :class="{ 'cancel': ['8','9'].includes(record.WeightedStatus), 'success': ['0','1','2','3','4','5','6','7'].includes(record.WeightedStatus) }">{{ statusText }}</view>
		<view class="status-text">
			<template v-if="record.WeightedStatus === '0'">
				<template v-if="record.StartTime && record.EndTime">{{ dayjs(record.StartTime).format('MM-DD HH:mm') }} 至 {{ dayjs(record.EndTime).format('MM-DD HH:mm') }} 可入场</template>
				<template v-if="record.StartTime && !record.EndTime">{{ dayjs(record.StartTime).format('MM-DD HH:mm') }} 后可入场</template>
				<template v-if="!record.StartTime && record.EndTime">{{ dayjs(record.EndTime).format('MM-DD HH:mm') }} 前可入场</template>
				<template v-if="!record.StartTime && !record.EndTime">请尽快到达装货厂家</template>
			</template>
			<template v-if="record.WeightedStatus === '1'">
				<template v-if="record.StatusCount && record.StatusCount > 1">当前共 {{ record.StatusCount }} 辆车等待入场</template>
				<template v-else>即将入场</template>
			</template>
			<template v-if="record.WeightedStatus === '2'">已入场</template>
			<template v-if="record.WeightedStatus === '3'">
				<template v-if="record.StatusCount && record.StatusCount > 1">当前共 {{ record.StatusCount }} 辆车等待装车</template>
				<template v-else>即将装车</template>
			</template>
			<template v-if="record.WeightedStatus === '4'">已入场</template>
			<template v-if="record.WeightedStatus === '5'">装车中</template>
			<template v-if="record.WeightedStatus === '6'">已装车</template>
			<template v-if="record.WeightedStatus === '7'">已出场</template>
			<template v-if="record.WeightedStatus === '8'">已完成</template>
			<template v-if="record.WeightedStatus === '9'">{{ record.CancelType }}已取消运单</template>
		</view>
		<view class="own">货主：
			<view class="mfrs uv-line-1">{{ record.OwnerEnt ? record.OwnerEnt.OwnerName : '' }}</view>
		</view>
		<view class="location-wrapper">
			<view class="from" v-if="record.SupEnt">
				<view class="line">
					<view class="dot" v-for="dot in 3" />
				</view>
				<uv-image src="/static/images/dot1.png" width="16rpx" height="16rpx" :duration="0"
					:custom-style="{ marginRight: '16rpx' }" />
				<view class="city">{{ record.SupEnt ? record.SupEnt.City : '' }}</view>
				<view class="name">{{ record.SupEnt ? record.SupEnt.SupplierName : '' }}</view>
			</view>
			<view class="to" v-if="record.UnloadEnt">
				<uv-image src="/static/images/dot2.png" width="16rpx" height="16rpx" :duration="0"
					:custom-style="{ marginRight: '16rpx' }" />
				<view class="city">{{ record.UnloadEnt ? record.UnloadEnt.City : '' }}</view>
				<view class="name uv-line-1">{{ record.UnloadEnt ? record.UnloadEnt.PlaceName : '' }}</view>
			</view>
		</view>
		<view class="car-info">
			<my-plate v-if="record.CarEnt" :plate="record.CarEnt.Carno" :color="record.CarEnt.Color"/>
			<view class="cate">{{ record.MaterialName ? record.MaterialName : '' }}</view>
			<uv-line direction="col" color="#B0BECC" length="26rpx" margin="0 20rpx 0 20rpx"></uv-line>
			<view v-if="['0','1','2','3','4','5','9'].includes(record.WeightedStatus)" class="unit">预装 <text style="font-weight: 500;">{{ record.EstimiteWeight }}</text> 吨</view>
			<view v-if="['6','7','8'].includes(record.WeightedStatus)" class="unit">实装 <text style="font-weight: 500;">{{ record.WeightEnt ? record.WeightEnt.Suttle : '' }}</text> 吨</view>
		</view>
		<view class="footer" :class="{ 'my-border-top': record.WeightedStatus !== '9' }">
			<view class="btn" @click.stop v-if="['0','1'].includes(record.WeightedStatus)">
				<uv-button shape="circle" text="取消运单" color="var(--page-bg)"
					:customTextStyle="{ color: 'var(--content-color)', fontSize: '26rpx' }"
					:customStyle="{ height: '32px' }" @click="cancelBill"></uv-button>
			</view>
			<view class="btn" @click.stop v-if="['0','1','7'].includes(record.WeightedStatus)">
				<uv-button shape="circle" text="呼叫货主" color="var(--page-bg)"
					:customTextStyle="{ color: 'var(--content-color)', fontSize: '26rpx' }"
					:customStyle="{ height: '32px' }" @click="takeOwnerPhone"></uv-button>
			</view>
			<view class="btn" @click.stop v-if="['2','3','4','5','6'].includes(record.WeightedStatus)">
				<uv-button shape="circle" text="呼叫厂家" color="var(--page-bg)"
					:customTextStyle="{ color: 'var(--content-color)', fontSize: '26rpx' }"
					:customStyle="{ height: '32px' }" @click="takeSupPhone"></uv-button>
			</view>
			<view class="btn" @click.stop v-if="['0'].includes(record.WeightedStatus)">
				<uv-button shape="circle" text="确认到厂" color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"
					:customTextStyle="{ fontSize: '26rpx' }" :customStyle="{ height: '32px' }" @click="confirmArrive" />
			</view>
			<view class="btn" @click.stop v-if="['7'].includes(record.WeightedStatus)">
				<uv-button shape="circle" text="确认卸货" color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"
					:customTextStyle="{ fontSize: '26rpx' }" :customStyle="{ height: '32px' }" @click="confirmUnload" />
			</view>
		</view>
	</view>

	<my-confirm ref="modal" />
</template>

<script setup>
	import {
		computed,
		ref
	} from 'vue';
	import dayjs from 'dayjs';
	import { DisableOnwayEnt, ArrivedConfirm, UnloadConfirm } from '@/api/index.js';
	import { getToken } from '@/utils/token.js';
	import { useLocationStore } from '@/stores/location.js';
	import { getLocationInfo } from '@/utils/authorize.js'
	const locationStore = useLocationStore();
	
	const emits = defineEmits(['success'])
	const props = defineProps({
		record: {
			default: () => {},
			type: Object
		}
	})
	
	const statusText = computed(() => {
		if(['0','1'].includes(props.record.WeightedStatus)) return '待入场';
		if(['2','3','4'].includes(props.record.WeightedStatus)) return '已入场';
		if(['5'].includes(props.record.WeightedStatus)) return '装车中';
		if(['6'].includes(props.record.WeightedStatus)) return '已装车';
		if(['7'].includes(props.record.WeightedStatus)) return '已出场';
		if(['8'].includes(props.record.WeightedStatus)) return '已完成';
		if(['9'].includes(props.record.WeightedStatus)) return '已取消';
	})
	
	const modal = ref()
	
	// 运单相关
	function toDetail() {
		uni.navigateTo({
			url: `/pages/billDetail/billDetail?assignId=${props.record.Id}`
		})
	}
	function cancelBill() {
		modal.value.confirm({
			title: '确认取消该笔运单？',
			content: '如取消次数过多，将会被限制接单',
			cancelText: '再想想',
			confirmText: '取消运单',
			asyncClose: true,
			async confirm() {
				try {
					await DisableOnwayEnt({
						onwayId: props.record.Id,
						userId: getToken().userInfo.Id,
						userType: 'driver'
					})
					modal.value.close();
					emits('success')
				}catch {
					modal.value.closeLoading();
				}
			}
		})
	}
	function takeOwnerPhone() {
		uni.makePhoneCall({
			phoneNumber: props.record?.OwnerEnt?.LinkerMobile ?? ''
		})
	}
	function takeSupPhone() {
		uni.makePhoneCall({
			phoneNumber: props.record?.SupEnt?.LinkerMobile ?? ''
		})
	}
	async function confirmArrive() {
		uni.showLoading({
			mask: true
		})
		let location = {};
		try {
			location = await getLocationInfo();
		}catch{
			modal.value.confirm({
				title: '定位失败',
				content: '请开启相关定位权限或者扫码入场',
				showCancelButton: false,
				confirmBgColor: 'var(--main-color)'
			})
			uni.hideLoading()
			return;
		}
		console.log('location', location)
		try {
			await ArrivedConfirm({
				onwayId: props.record.Id,
				logitude: location.longitude,
				latitude: location.latitude
			})
			emits('success')
		}catch (err){
			modal.value.confirm({
				title: '到场失败',
				content: err.data,
				showCancelButton: false,
				confirmBgColor: 'var(--red-color)'
			})
		}finally {
			uni.hideLoading()
		}
	}
	async function confirmUnload() {
		uni.showLoading({
			mask: true
		})
		let location = {};
		try {
			location = await getLocationInfo();
		}catch{
			modal.value.confirm({
				title: '定位失败',
				content: '请开启相关定位权限',
				showCancelButton: false,
				confirmBgColor: 'var(--main-color)'
			})
			uni.hideLoading()
			return;
		}
		console.log('location', location)
		try {
			await UnloadConfirm({
				onwayId: props.record.Id,
				userId: getToken().userInfo.Id,
				uType: 'driver',
				logitude: location.longitude,
				latitude: location.latitude
			})
			emits('success')
		}catch (err){
			modal.value.confirm({
				title: '卸货失败',
				content: err.data,
				showCancelButton: false,
				confirmBgColor: 'var(--red-color)'
			})
		}finally {
			uni.hideLoading()
		}
	}
	
</script>

<style lang="scss" scoped>
	.bill {
		position: relative;
		margin-bottom: 20rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 32rpx 24rpx 24rpx;
		overflow: hidden;

		.tag {
			padding: 8rpx 24rpx;
			position: absolute;
			right: 0;
			top: 0;
			border-radius: 0rpx 0 0rpx 24rpx;
			font-weight: 500;
			font-size: 26rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 40rpx;

			&.waiting {
				background: rgba(252, 126, 44, .18);
				color: #FC7E2C;
			}

			&.success {
				background: rgba(49, 206, 87, .18);
				color: var(--main-color);
			}

			&.cancel {
				background: #C8D4DF;
				color: #FFFFFF;
			}
		}

		.status-text {
			font-weight: 500;
			font-size: 32rpx;
			color: var(--title-color);
			line-height: 48rpx;
		}

		.own {
			display: flex;
			font-size: 26rpx;
			color: var(--intr-color);
			line-height: 48rpx;
			margin-bottom: 24rpx;

			.mfrs {
				flex: 1;
				color: var(--content-color);
			}
		}

		.location-wrapper {
			padding: 24rpx 20rpx;
			background: var(--page-bg);
			border-radius: 16rpx;
			margin-bottom: 28rpx;

			.line {
				position: absolute;
				height: 24rpx;
				top: 34rpx;
				left: 6rpx;

				.dot {
					width: 4rpx;
					height: 4rpx;
					border-radius: 50%;
					background-color: #C8D4DF;

					&:not(:last-child) {
						margin-bottom: 6rpx;
					}
				}
			}

			.from,
			.to {
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 26rpx;
				line-height: 36rpx;

				.city {
					color: var(--title-color);
					margin-right: 16rpx;
				}

				.name {
					flex: 1;
					color: var(--content-color);
				}
			}

			.from {
				position: relative;
				margin-bottom: 20rpx;
			}
		}

		.car-info {
			display: flex;
			align-items: center;
			font-size: 26rpx;
			color: var(--title-color);
			line-height: 48rpx;
			.cate {
				margin-left: 20rpx;
			}
		}

		.footer {
			display: flex;
			align-items: center;
			justify-content: flex-end;

			.btn {
				margin-left: 20rpx;
			}
			&.my-border-top {
				margin-top: 28rpx;
				padding-top: 24rpx;
			}
		}
	}
</style>
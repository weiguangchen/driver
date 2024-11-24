<template>
	<!-- status-bar -->
	<uv-status-bar />
	<!-- end -->
	<!-- 标题 -->
	<view class="index-navbar">
		早上好，{{ nickname }}！
	</view>
	<!-- end -->
	<!-- 背景色 -->
	<view class="page-bg" />
	<!-- end -->
	<!-- 金刚区 -->
	<view class="kingkong">
		<view class="tasks" v-if="processNumber > 0">
			<view class="">有 {{ processNumber }} 项进行中的运输任务</view>
			<view style="display: flex;align-items: center;">查看 <uv-icon name="arrow-right" size="20rpx" :custom-style="{ marginLeft: '4rpx' }" color="#ffffff" /></view>
		</view>
		<view class="car-wrapper">
			<view class="placeholder" v-if="!getToken()">
				<uv-button shape="circle" text="请登录" color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%);" :custom-style="{ height: '72rpx', width: '268rpx' }" :customTextStyle="{ fontSize: '28rpx' }" @click="openLoginDrawer"/>
			</view>
			<view class="placeholder" v-else-if="carList && carList.length === 0">
				<uv-button shape="circle" text="添加车辆" icon="plus" iconColor="#ffffff" iconSize="24rpx" color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%);" :custom-style="{ height: '72rpx', width: '268rpx' }" :customTextStyle="{ fontSize: '28rpx' }" @click="addCar"/>
			</view>
			<view class="car-info" :class="{'car1': defaultCar.Cartype === '自卸车','car2': defaultCar.Cartype === '半挂车' ,'car3': defaultCar.Cartype === '罐车'}" v-else>
				<my-plate style="margin-bottom: 12rpx;" :plate="defaultCar.Carno" :color="defaultCar.Color"/>
				<view class="type">{{ defaultCar.Cartype }}</view>
				<view class="change-car" @click="changeCar">
					切换当前车辆 <uv-image src="/static/images/arrow2.png" :duration="0" width="18rpx" height="18rpx" :custom-style="{ marginLeft: '4rpx' }" />
				</view>
			</view>
			
			<view style="padding: 0 28rpx;">
				<uv-line color="var(--divider)"/>
			</view>
			<view class="menus">
				<view class="menu">
					<uv-image src="/static/images/home/scan.png" width="80rpx" height="80rpx" :duration="0" :custom-style="{ marginBottom: '14rpx' }"/>
					<view class="">扫码助手</view>
				</view>
				<view class="menu" @click="navigate('数据统计')">
					<uv-image src="/static/images/home/statistics.png" width="80rpx" height="80rpx" :duration="0" :custom-style="{ marginBottom: '14rpx' }"/>
					<view class="">数据统计</view>
				</view>
				<view class="menu" @click="toGuide">
					<uv-image src="/static/images/home/guide.png" width="80rpx" height="80rpx" :duration="0" :custom-style="{ marginBottom: '14rpx' }"/>
					<view class="">操作指南</view>
				</view>
				<view class="menu" @click="navigate('问题反馈')">
					<uv-image src="/static/images/home/feedback.png" width="80rpx" height="80rpx" :duration="0" :custom-style="{ marginBottom: '14rpx' }"/>
					<view class="">问题反馈</view>
				</view>
			</view>
		</view>
	</view>
	<!-- end -->
	<!-- banner -->
	<view class="banner" @click="follow">
		<uv-image width="100%" height="100%" :duration="0" src="/static/images/mine/banner.png"/>
	</view>
	<!-- end -->
	<!-- 待接单运单 -->
	<view class="empty-wrapper" v-if="!getToken()">
		<uv-image src="/static/images/empty/index.png" width="176rpx" height="176rpx" :duration="0"/>
		<view class="text">登录并添加车辆后方可接单</view>
	</view>
	<view class="bill-list" v-else>
		<view class="title-wrapper">
			<view class="title">当前车辆可接 <text class="total">{{ assignCnt }}</text> 笔运单</view>
			<SelectCargo v-model="ownerId" :options="currentCarnoCargoOptions" @change="changeCargo"/>
		</view>
		<template v-if="assignList.length > 0">
			<Item v-for="(item,index) in assignList" :record="item" :key="item.Id"/>
			<uv-load-more status="nomore" color="#B0BECC" line-color="#B0BECC" font-size="24rpx" />
		</template>
		<my-empty v-else height="200px" text='暂无可接运单'/>
	</view>
	
	<!-- 登录弹窗 -->
	<my-login-drawer ref="loginDrawer" @success="loginSuccess"/>
	<!-- end -->
	<my-tabbar />
</template>

<script setup>
	import {
		computed,
		ref,
		watch,
		watchEffect
	} from 'vue';
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app';
	import { storeToRefs } from 'pinia'
	import { useAppStore } from '@/stores/app.js';
	import { useUserStore } from '@/stores/user.js';
	import { useLocationStore } from '@/stores/location.js';
	import { getWxSetting, getLocationInfo } from '@/utils/authorize.js'
	import { getToken } from '@/utils/token.js'
	import { GetDriverWayCount, GetGoodsCompanyList, GetOnwayList, GetReceiveAssignList, GetDriverTakeTicketOwnerList } from '@/api/index.js'
	import SelectCargo from './components/SelectCargo.vue';
	import Item from './components/Item.vue';
	
	
	const appStore = useAppStore();
	const userStore = useUserStore();
	const locationStore = useLocationStore();
	const { carList, defaultCar } = storeToRefs(userStore);
	
	const nickname = computed(() => {
		const tokenData = getToken();
		return tokenData?.userInfo?.Nickname ?? '司机师傅'
	})
	
	const isInit = ref(false);
	onLoad(async () => {
		console.log('onLoad')
		// await getWxSetting('userLocation');
		try {
			await getLocationInfo();
			console.log('locationStore',locationStore)
		}catch {}
		isInit.value = true;
		if(!getToken()) {
			return;
		}
		console.log('onload handle')
		await userStore.getCarList();
		await getCurrentCarnoCargoOptions();
		await getProcess();
	})
	onShow(async () => {
		console.log('onShow')
		appStore.switchTab(0);
		if(!isInit.value) {
			console.log('onShow is not init')
			return;
		}
		if(!getToken()) {
			return;
		}
		console.log('onshow handle')
		await userStore.getCarList();
		await getProcess();
	})
	// 获取进行中的运单数量
	const processNumber = ref(0)
	async function getProcess() {
		const res = await GetDriverWayCount();
		processNumber.value = res;
	}
	// 添加车辆
	function addCar() {
		uni.navigateTo({
			url: '/pages/addCar/addCar'
		})
	}
	// 切换默认车辆
	function changeCar() {
		uni.navigateTo({
			url: '/pages/carList/carList'
		})
	}
	// 操作指南
	function toGuide() {
		uni.navigateTo({
			url: '/pages/guide/guide'
		})
	}
	// 关注公众号
	function follow(){
		const src = 'https://mp.weixin.qq.com/s?__biz=MzkxOTcyODM5OA==&mid=2247483675&idx=1&sn=3f1378b5f85fe5ed6144eb9446f63a32&chksm=c19cf97af6eb706cee30883335ba2e11ab4ebd79c23dac68af13106c2b56e20eee02ddfe656c#rd'
		uni.navigateTo({
			url: `/pages/webview/webview?src=${encodeURIComponent(src)}`
		})
	}
	function navigate(type) {
		if(!getToken()) {
			openLoginDrawer()
			return;
		}
		switch (type) {
			case '数据统计':
				uni.navigateTo({
					url: '/pages/statistics/statistics'
				})
				break;
			case '操作指南':
				uni.navigateTo({
					url: '/pages/guide/guide'
				})
				break;
			case '问题反馈':
				uni.navigateTo({
					url: '/pages/feedback/feedback'
				})
				break;
		}
	}
	// 登录
	const loginDrawer = ref()
	function openLoginDrawer() {
		loginDrawer.value.open();
	}
	function loginSuccess() {
		uni.reLaunch({
			url: '/pages/index/index'
		})
	}
	// 切换货主
	const ownerId = ref('0');
	const currentCarnoCargoOptions = ref([]);
	async function getCurrentCarnoCargoOptions() {
		try {
			const res = await GetDriverTakeTicketOwnerList({
				carno: defaultCar.value.Carno
			})
			const cargos = res.map(m => ({
				value: m.Id,
				label: m.Ownername
			}))
			currentCarnoCargoOptions.value = [{
				value: '0',
				label: '全部货主'
			},...cargos];
		}catch {
			ownerId.value = '0';
			currentCarnoCargoOptions.value = [{
				value: '0',
				label: '全部货主'
			}];
		}
	}
	watch(defaultCar, async (val, oldVal) => {
		console.log('切换默认车辆时，获取当前默认车牌号下可接运单', val, oldVal);
		if((val && !oldVal) || (val && oldVal && val.Id !== oldVal.Id)) {
			console.log('重新获取列表')
			try {
				ownerId.value = '0';
				currentCarnoCargoOptions.value = [];
				await getCurrentCarnoCargoOptions()
			}catch {}
			getList();
		}else {
			console.log('不需重新获取')
		}
	}, {
		immediate: true
	})
	function changeCargo(item) {
		getList();
	}
	// 首页运单
	const assignCnt = ref(0);
	const assignList = ref([])
	async function getList() {
		try {
			const res = await GetReceiveAssignList({
				ownerId: ownerId.value === '0' ? '' : ownerId.value,
				latitude: locationStore.location ? locationStore.location.latitude : '',
				longitude: locationStore.location ? locationStore.location.longitude : ''
			});
			assignCnt.value = res.assignCnt;
			assignList.value = res.assignList;
		}catch {
			
		}
	}
</script>

<style lang="scss">
	page {
		padding-bottom: 24rpx;
	}
	.page-bg {
		background: linear-gradient(to bottom, transparent 168px, #F2F4F7),
					url(/static/images/home/bg-text.png),
					linear-gradient(270deg, #31CE57 0%, #07B130 100%);
	}
	.index-navbar {
		width: 100%;
		font-weight: bold;
		font-size: 44rpx;
		padding-left: 32rpx;
		padding-top: 24rpx;
		color: #FFFFFF;
		height: 88rpx;
		line-height: 64rpx;
		margin-bottom: 24rpx;
	}

	.kingkong {
		padding: 0 24rpx;

		.tasks {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-weight: 500;
			font-size: 28rpx;
			color: #FFFFFF;
			padding: 24rpx 32rpx 32rpx;
			background: linear-gradient(90deg, #FC7E2C 0%, #FFA265 100%);
			border-radius: 24rpx 24rpx 0rpx 0rpx;
		}

		.car-wrapper {
			margin-top: -12rpx;
			border-radius: 24rpx;
			margin-bottom: 20rpx;
			background-color: #FFFFFF;
			overflow: hidden;
			.car-info {
				&.car1 {
					background:  url(/static/images/carType/car1-right.png) right 32rpx/auto 200rpx no-repeat,
								 url(/static/images/home/mask.png) right 0/auto 240rpx no-repeat,
								 #FFFFFF;
				}
				&.car2 {
					background:  url(/static/images/carType/car2-right.png) right 32rpx/auto 200rpx no-repeat,
								 url(/static/images/home/mask.png) right 0/auto 240rpx no-repeat,
								 #FFFFFF;
				}
				&.car3 {
					background:  url(/static/images/carType/car3-right.png) right 32rpx/auto 200rpx no-repeat,
								 url(/static/images/home/mask.png) right 0/auto 240rpx no-repeat,
								 #FFFFFF;
				}
				padding: 36rpx 28rpx 32rpx;
				.my-plate {
					margin-bottom: 12rpx;
					margin-left: 4rpx;
				}

				.type {
					padding-left: 12rpx;
					font-size: 26rpx;
					color: var(--sub-color);
					line-height: 36rpx;
					margin-bottom: 46rpx;
				}

				.change-car {
					padding-left: 12rpx;
					width: fit-content;
					display: flex;
					align-items: center;
					font-weight: bold;
					font-size: 28rpx;
					color: var(--main-color);
					line-height: 36rpx;
				}
			}
			.placeholder {
				height: 262rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.menus {
				padding: 32rpx 28rpx;
				display: flex;
				justify-content: space-between;

				.menu {
					flex: 1;
					display: flex;
					align-items: center;
					flex-direction: column;
					flex: 1;
					font-size: 26rpx;
					color: var(--title-color);
					line-height: 36rpx;
				}
			}
		}
	}


	.banner {
		margin: 0 24rpx;
		height: 192rpx;
		border-radius: 24rpx 24rpx 24rpx 24rpx;
		margin-bottom: 36rpx;
	}

	.bill-list {
		padding: 0 24rpx;

		.title-wrapper {
			padding: 0 8rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;

			.title {
				flex:none;
				font-weight: bold;
				font-size: 34rpx;
				color: var(--title-color);
				line-height: 48rpx;
				margin-right: 10rpx;

				.total {
					margin: 0 2rpx;
					color: var(--main-color);
				}
			}

		}

		
	}

	.empty-wrapper {
		height: 520rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #FFFFFF;
		border-radius: 24rpx;
		margin: 0 24rpx;
		.text {
			font-size: 26rpx;
			color: var(--intr-color);
			line-height: 56rpx;
		}
	}
</style>
<template>
	<page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta>
	<view catchtouchmove="true" style="height: 100vh;display: flex;flex-direction: column;">
		<!-- 导航 -->
		<uv-navbar placeholder left-icon="">
			<template v-slot:center>
				<view class="navbar-content" :style="{ paddingRight: `${navbarPad}px` }">
					<uv-search placeholder="搜索运单号、车牌号" v-model="keyWord" :disabled="!getToken()" :showAction="false" @search="handleSearch" @clear="handleSearch"/>
					<FilterDrawer ref="filter" @change="changeFilter" @visibleChange="changeFilterVisible" />
				</view>
			</template>
		</uv-navbar>
		<!-- end -->
		<!-- tab -->
		<uv-tabs :activeStyle="{ fontWeight: 'bold', color: 'var(--title-color)' }" :inactiveStyle="{ color: 'var(--sub-color)' }" lineWidth="32rpx" lineHeight="8rpx" :list="tabs" @change="changeTabs" :scrollable="false" lineColor="var(--main-color)" :customStyle="{ background: '#ffffff' }" />
		<view class="has-filter" v-if="(isFilter && !isFiltering) || (isKeyWord && !isFiltering)">
			已按条件筛选出 {{ total }} 条数据
			<view class="redo" @click="reset">
				<uv-image :duration="0" src="/static/images/filter/redo.png" width="28rpx" height="28rpx" :custom-style="{ marginRight: '4rpx' }"/>重置
			</view>
		</view>
		<!-- end -->
		<!-- 列表 -->
		<scroll-view scroll-y style="flex:1;height: 400px;">
			<my-empty v-if="!getToken()" showButton buttonText="登录" text="登录后查看运单" @confirm="openLoginDrawer"/>
			<my-empty v-else-if="list.length === 0"/>
			<view class="bill-list" v-else>
				<Item v-for="item in list" :record="item" :key="item.Id" @success="getList"/>
			</view>
		</scroll-view>
		<!-- end -->
	</view>
	<!-- 登录弹窗 -->
	<my-login-drawer ref="loginDrawer" @success="loginSuccess"/>

	<my-tabbar />
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed,
		nextTick
	} from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { useAppStore } from '@/stores/app.js';
	import Item from './components/item.vue';
	import { getToken } from '@/utils/token.js'
	import { GetOnwayDriver } from '@/api/index.js';
	import FilterDrawer from './components/FilterDrawer.vue';
	
	const appStore = useAppStore();
	
	onLoad(() => {
		appStore.switchTab(1);
	})
	// 登录
	const loginDrawer = ref();
	function openLoginDrawer() {
		loginDrawer.value.open();
	}
	function loginSuccess() {
		uni.reLaunch({
			url: '/pages/waybill/waybill'
		})
	}
	// hack滚动穿透
	const show = ref(false);
	function changeFilterVisible(e) {
		show.value = e.show;
	}
	const navbarPad = ref(0);
	onMounted(() => {
		let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
		// console.log("menuButtonInfo", menuButtonInfo);
		navbarPad.value = menuButtonInfo.width + 20;
	});
	// tab
	const status = ref('')
	const tabs = ref([{
		name: '全部',
		value: ''
	}, {
		name: '已接单',
		value: '10'
	}, {
		name: '已完成',
		value: '8'
	}, {
		name: '已取消',
		value: '9'
	}])
	function changeTabs({ value }) {
		status.value = value;
		getList();
	}
	// 筛选
	const filter = ref();
	const isFilter = ref(false);
	const isFiltering = ref(false);	
	function changeFilter(data) {
		console.log('changeFilter',data)
		isFiltering.value = true;
		isFilter.value = data.isFilter;
		params.value = data.params;
		getList();
	}
	const keyWord = ref('');
	const isKeyWord = ref(false);
	function handleSearch() {
		isFiltering.value = true;
		isKeyWord.value = !!keyWord.value;
		getList();
	}
	// 运单列表
	const list = ref([])
	const params = ref({});
	const total = ref(0);
	async function getList() {
		const { dateMode, date, ...rest } = params.value;
		try {
			uni.showLoading({
				mask:true
			})
			const res = await GetOnwayDriver({
				status: status.value,
				keyWord: keyWord.value,
				...rest
			});
			list.value = res.onwayList;
			total.value = res.onwayCnt;
			await nextTick();
			uni.hideLoading();
		}
		catch(err) {
			uni.hideLoading();
			uni.showToast({
				title: err.data,
				icon: 'none'
			})
		}
		finally {
			isFiltering.value = false;
		}
	}
	function reset() {
		keyWord.value = '';
		isKeyWord.value = false;
		filter.value.reset();
	}
	onShow(() => {
		if(getToken()) {
			getList();
		}
	})
</script>

<style lang="scss">
	page {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	.navbar-content {
		padding-left: 24rpx;
		width: 100%;
		display: flex;
		align-items: center;
	}
	.has-filter {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32rpx;
		height: 72rpx;
		background: #FFF1E8;
		font-size: 24rpx;
		color: #FC7E2C;
		font-weight: bold;
		.redo {
			background-color: #FC7E2C;
			height: 48rpx;
			padding: 0 20rpx;
			border-radius: 24rpx;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
		}
	}
	.bill-list {
		padding: 24rpx;
	}
	.scroll-view {
		flex: 1;
		height: 400px;
	}
</style>
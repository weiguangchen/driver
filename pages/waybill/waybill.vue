<template>
	<page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta>
	
	<uv-navbar placeholder left-icon="">
		<template v-slot:center>
			<view class="navbar-content" :style="{ paddingRight: `${navbarPad}px` }">
				<uv-search placeholder="搜索运单号、车牌" v-model="keyword" :showAction="false" @focus="searchFocus"/>
				<my-filter-drawer ref="filter" @change="changeFilter"/>
			</view>
		</template>
	</uv-navbar>
	<!-- <view class="has-filter">
		已按条件筛选出 99 条数据
		<view class="redo">
			<uv-button color="#FC7E2C" shape="circle" :custom-style="{ height: '48rpx', padding: '0 20rpx' }">
				<uv-image :duration="0" src="/static/images/filter/redo.png" width="28rpx" height="28rpx" :custom-style="{ marginRight: '4rpx' }" :customTextStyle="{ fontSize: '24rpx' }"/>重置
			</uv-button>
		</view>
	</view> -->
	<uv-tabs :activeStyle="{ fontWeight: 'bold', color: 'var(--title-color)' }" :inactiveStyle="{ color: 'var(--sub-color)' }" lineWidth="32rpx" lineHeight="8rpx" :list="tabs" @change="changeTabs" :scrollable="false" lineColor="var(--main-color)" :customStyle="{ background: '#ffffff' }" />
	<scroll-view scroll-y style="flex:1;height: 400px;">
		<my-empty v-if="!getToken()" showButton buttonText="登录" text="登录后查看运单" @confirm="openLoginDrawer"/>
		<my-empty v-else-if="list.length === 0"/>
		<view class="bill-list" v-else>
			<Item v-for="item in list" :record="item" :key="item.Id" @success="getList"/>
		</view>
	</scroll-view>
	
	<!-- 登录弹窗 -->
	<my-login-drawer ref="loginDrawer" @success="loginSuccess"/>

	<my-tabbar />
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { useAppStore } from '@/stores/app.js';
	import Item from './components/item.vue';
	import { getToken } from '@/utils/token.js'
	import { GetOnwayDriver } from '@/api/index.js'
	
	const appStore = useAppStore();
	
	onLoad(() => {
		appStore.switchTab(1);

	})
	// hack滚动穿透
	const show = ref(false);
	function changeFilter(e) {
		show.value = e.show;
	}
	const navbarPad = ref(0);
	onMounted(() => {
		let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
		console.log("menuButtonInfo", menuButtonInfo);
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
	function searchFocus() {
		if(!getToken()) {
			openLoginDrawer()
		}
	}
	const filter = ref();
	function openFilter() {
		if(!getToken()) {
			openLoginDrawer()
			return;
		}
		filter.value.open();
	}
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
	
	const list = ref([])
	async function getList() {
		const res = await GetOnwayDriver({
			status: status.value
		});
		list.value = res.onwayList;
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
		padding:0 32rpx;
		height: 72rpx;
		background: rgba(252, 126, 44, .18);
		font-size: 24rpx;
		color: #FC7E2C;
		font-weight: bold;
	}

	.bill-list {
		padding: 24rpx;
	}
</style>
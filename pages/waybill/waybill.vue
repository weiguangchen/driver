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
		<uv-tabs :current="current" :activeStyle="{ fontWeight: 'bold', color: 'var(--title-color)' }" :inactiveStyle="{ color: 'var(--sub-color)' }" lineWidth="32rpx" lineHeight="8rpx" :list="tabs" @change="changeTabs" :scrollable="false" lineColor="var(--main-color)" :customStyle="{ background: '#ffffff' }" />
		<view class="has-filter" v-if="(isFilter && !isFiltering) || (isKeyWord && !isFiltering)">
			已按条件筛选出 {{ total }} 条数据
			<view class="redo" @click="reset">
				<uv-image :duration="0" src="/static/images/filter/redo.png" width="28rpx" height="28rpx" :custom-style="{ marginRight: '4rpx' }"/>重置
			</view>
		</view>
		<!-- end -->
		<!-- 列表 -->
		<my-list :list="list" rowKey="Id" :noMore="noMore" :loading="loading" :fetchData="fetchData">
			<template #item="{ item }">
				<Item :record="item" @success="fetchData(true)"/>
			</template>
			<template #empty>
				<my-empty v-if="!getToken()" showButton buttonText="登录" text="登录后查看运单" @confirm="openLoginDrawer"/>
				<my-empty v-else/>
			</template>
		</my-list>
		<!-- end -->
		<my-tabbar :fixed="false"/>
	</view>
	<!-- 登录弹窗 -->
	<my-login-drawer ref="loginDrawer" @success="loginSuccess"/>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed,
		nextTick,
		getCurrentInstance,
	} from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { useAppStore } from '@/stores/app.js';
	import Item from './components/item.vue';
	import { getToken } from '@/utils/token.js'
	import { GetOnwayDriver } from '@/api/index.js';
	import FilterDrawer from './components/FilterDrawer.vue';
	import useList from "@/hooks/useList.js";

	const { ctx } = getCurrentInstance();

	const appStore = useAppStore();
	
	onLoad(() => {
		console.log('onLoad')
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
		navbarPad.value = menuButtonInfo.width + 20;
	});
	// tab
	const status = ref('')
	const current = ref(0)
	const tabs = ref([{
		name: '全部',
		value: '',
		disabled: !getToken()
	}, {
		name: '已接单',
		value: '10',
		disabled: !getToken()
	}, {
		name: '已完成',
		value: '8',
		disabled: !getToken()
	}, {
		name: '已取消',
		value: '9',
		disabled: !getToken()
	}])
	function changeTabs({ value }) {
		status.value = value;
		fetchData(true);
	}
	// 筛选
	const filter = ref();
	const isFilter = ref(false);
	const isFiltering = ref(false);	
	async function changeFilter(data) {
		console.log('changeFilter',data)
		isFiltering.value = true;
		isFilter.value = data.isFilter;
		params.value = data.params;
		await fetchData(true);
		isFiltering.value = false;
	}
	const keyWord = ref('');
	const isKeyWord = ref(false);
	async function handleSearch() {
		isFiltering.value = true;
		isKeyWord.value = !!keyWord.value;
		await fetchData(true);
		isFiltering.value = false;
	}
	// 运单列表
	const params = ref({});
	function reset() {
		keyWord.value = '';
		isKeyWord.value = false;
		filter.value.reset();
	}
	onShow(() => {
		appStore.switchTab(1);
		status.value = appStore.waybillQuery?.status ?? '';
		current.value = appStore.waybillQuery?.status ? tabs.value.findIndex(item => item.value === appStore.waybillQuery?.status) : 0;
		appStore.setWaybillQuery({});
		if(getToken()) {
			fetchData(true);
		}
	})


	const listParams = computed(() => {
		const { dateMode, date, ...rest } = params.value;
		return {
			status: status.value,
			keyword: keyWord.value,
			...rest,
		};
	});
	const { list, noMore, total, loading, fetchData } = useList({
		api: GetOnwayDriver,
		totalField: 'onwayCnt',
		listField: 'onwayList',
		params: listParams,
	});
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
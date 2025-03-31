<template>
	<uv-navbar left-icon="" placeholder bg-color="transparent" />
	<!-- 用户 -->
	<view class="user-wrapper">
		<view class="left">
			<view class="avatar">
				<uv-image :src="getToken() ? '/static/images/mine/avatar.png' : '/static/images/mine/no-avatar.png'" width="100%" height="100%" :duration="0"/>
			</view>
			<view class="user" v-if="getToken()">
				<view class="name">{{ userInfo.Nickname || '暂无昵称' }}</view>
				<view class="phone">{{ userInfo.Mobile || '' }}</view>
			</view>
			<view class="no-login" v-else @click="openLoginDrawer">
				请登录 <uv-image src="/static/images/arrow3.png" :duration="0" width="32rpx" height="32rpx" :custom-style="{ flex: 'none' }"/>
			</view>
		</view>
		<view class="right">
			<view class="btn" @click="navigate('扫码')">
				<uv-image src="/static/images/mine/scan.png" width="56rpx" height="56rpx" :duration="0" />
			</view>
			<view class="btn" @click="navigate('二维码')">
				<uv-image src="/static/images/mine/qrcode.png" width="56rpx" height="56rpx" :duration="0" />
			</view>
		</view>
	</view>
	<!-- end -->
	<view class="box-wrapper">
		<view class="box left" @click="navigate('车辆管理')">
			<view class="name">车辆管理</view>
		</view>
		<view class="box right" @click="navigate('数据统计')">
			<view class="name">数据统计</view>
		</view>
	</view>
	<!-- menus -->
	<view class="statistics">
		<view class="title">本月运单</view>
		<view class="menus">
			<view class="menu">
				<view class="number">-</view>
				<view class="">全部</view>
			</view>
			<view class="menu">
				<view class="number">-</view>
				<view class="">已接单</view>
			</view>
			<view class="menu">
				<view class="number">-</view>
				<view class="">已完成</view>
			</view>
			<view class="menu">
				<view class="number">-</view>
				<view class="">已取消</view>
			</view>
		</view>
	</view>
	<!-- end -->
	<!-- banner -->
	<view class="banner" @click="follow">
		<uv-image width="100%" height="100%" :duration="0" src="/static/images/mine/banner.png"/>
	</view>
	<!-- end -->
	<!-- 常用功能 -->
	<view class="common-wrapper">
		<view class="title">常用功能</view>
		<view class="menus">
			<view class="menu" @click="follow">
				<uv-image src="/static/images/mine/wechat.png" width="56rpx" height="56rpx"
					:custom-style="{ marginBottom: '4rpx' }" :duration="0" />
				<view class="name">关注公众号</view>
			</view>
			<button class="menu" style="border: none;padding: 0;color:var(--title-color);font-size: 24rpx;line-height: 40rpx;" plain open-type="contact">
				<uv-image src="/static/images/mine/service.png" width="56rpx" height="56rpx"
					:custom-style="{ marginBottom: '4rpx' }" :duration="0" />
				<view class="name">联系客服</view>
			</button>
			<view class="menu" @click="toGuide">
				<uv-image src="/static/images/mine/guide.png" width="56rpx" height="56rpx"
					:custom-style="{ marginBottom: '4rpx' }" :duration="0" />
				<view class="name">操作指南</view>
			</view>
			<button open-type="feedback" class="menu">
				<uv-image src="/static/images/mine/feedback.png" width="56rpx" height="56rpx"
					:custom-style="{ marginBottom: '4rpx' }" :duration="0" />
				<view class="name">问题反馈</view>
			</button>
			<view class="menu" @click="navigate('设置')">
				<uv-image src="/static/images/mine/setting.png" width="56rpx" height="56rpx"
					:custom-style="{ marginBottom: '4rpx' }" :duration="0" />
				<view class="name">设置</view>
			</view>
		</view>
	</view>
	<!-- 登录弹窗 -->
	<my-login-drawer ref="loginDrawer" @success="loginSuccess"/>
	<!-- 二维码 -->
	<QrcodeModal ref="qrcode"/>
	<!-- end -->
	<my-tabbar />
</template>

<script setup>
	import {
		ref,
		getCurrentInstance
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'
	import {
		useAppStore
	} from '@/stores/app.js'
	import QrcodeModal from './components/qrcodeModal.vue'
	import { getToken } from '@/utils/token.js';
	import { useUserStore } from '@/stores/user.js';
	import { storeToRefs } from 'pinia';
	import { ScanQR } from '@/api/index.js';

	const userStore = useUserStore();
	const { userInfo, defaultCar } = storeToRefs(userStore);
	const appStore = useAppStore();
	const {
		ctx
	} = getCurrentInstance();

	onShow(() => {
		appStore.switchTab(2)
	})

	function navigate(type) {
		if(!getToken()) {
			openLoginDrawer();
			return;
		}
		switch (type) {
			case '扫码':
				handleScan()
				break;
			case '二维码':
				openQrcode()
				break;
			case '车辆管理':
				uni.navigateTo({
					url: '/pages/carList/carList'
				})
				break;
			case '数据统计':
				uni.showToast({
					title: '敬请期待',
					icon: 'none'
				})
				return;
				uni.navigateTo({
					url: '/pages/statistics/statistics'
				})
				break;
			case '卸货地址':
				uni.navigateTo({
					url: '/pages/addressList/addressList'
				})
				break;
			case '我的订单':
				uni.navigateTo({
					url: '/pages/orderList/orderList'
				})
				break;
			case '我的货单':
				uni.navigateTo({
					url: '/pages/manifestList/manifestList'
				})
				break;
			case '问题反馈':
				break;
			case '设置':
				uni.navigateTo({
					url: '/pages/setting/setting'
				})
				break;
		}
	}
	
	// 扫码
	async function handleScan() {
		if(!defaultCar.value) {
			uni.showToast({
				title: '请先添加车辆',
				icon: 'none'
			})
			return;
		}
		let params = {};
		try {
			const res = await uni.scanCode();
			console.log(res)
			params = JSON.parse(res.result)
			console.log(params)
			const { htQRType } = params;
			if(!htQRType) {
				uni.showToast({
					title: '无效二维码',
					icon: 'none'
				})
				return;
			}
		}catch(err) {
			console.log('无效二维码',err)
			uni.showToast({
				title: '无效二维码',
				icon: 'none'
			})
			return;
		}
		try {
			uni.showLoading({
				mask: true
			})
			const param = {
				scanParam: JSON.stringify({
					...params
				})
			}
			console.log(param);
			await ScanQR(param);
			console.log('允许扫码')
			uni.hideLoading()
			const { assignId } = params;
			uni.navigateTo({
				url: `/pages/billDetail/billDetail?assignId=${assignId}`
			})
		}catch(err) {
			uni.hideLoading();
			uni.showToast({
				title: err.data,
				icon: 'none'
			})
		}
	}
	// 二维码
	const qrcode = ref();
	function openQrcode() {
		qrcode.value.open();
	}
	// 关注公众号
	function follow(){
		const src = 'https://mp.weixin.qq.com/s?__biz=MzkxOTcyODM5OA==&mid=2247483675&idx=1&sn=3f1378b5f85fe5ed6144eb9446f63a32&chksm=c19cf97af6eb706cee30883335ba2e11ab4ebd79c23dac68af13106c2b56e20eee02ddfe656c#rd'
		// uni.navigateTo({
		// 	url: `/pages/webview/webview?src=${encodeURIComponent(src)}`
		// })
		uni.openOfficialAccountArticle({
			url: src
		})
	}
	// 操作指南
	function toGuide() {
		const src = 'https://mp.weixin.qq.com/s/6Hqb9mbfT_Te9Tu4cD26DQ'
		// uni.navigateTo({
		// 	url: `/pages/webview/webview?src=${encodeURIComponent(src)}`
		// })
		uni.openOfficialAccountArticle({
			url: src
		})
	}
	// 登录
	const loginDrawer = ref();
	function openLoginDrawer() {
		loginDrawer.value.open();
	}
	function loginSuccess() {
		uni.reLaunch({
			url: '/pages/mine/mine'
		})
	}
</script>

<style lang="scss">
	page {
		padding-bottom: 24rpx;
		background: url(/static/images/mine/mask.png) no-repeat left top/360rpx auto,
			linear-gradient(180deg, #D4FFDF 160rpx, var(--page-bg) 510rpx);

	}

	.user-wrapper,
	.box-wrapper,
	.statistics,
	.banner,
	.common-wrapper {
		margin-left: 24rpx;
		margin-right: 24rpx;
	}

	.user-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 22rpx 12rpx 0 8rpx;
		margin-bottom: 40rpx;

		.left {
			display: flex;
			align-items: center;

			.avatar {
				width: 128rpx;
				height: 128rpx;
				border-radius: 50%;
				border: 4rpx solid #FFFFFF;
				margin-right: 24rpx;
				background-color: #C8D4DF;
			}

			.user {
				.name {
					font-weight: bold;
					font-size: 40rpx;
					color: var(--title-color);
					line-height: 40rpx;
					margin-bottom: 8rpx;
				}

				.phone {
					font-size: 26rpx;
					color: var(--content-color);
					line-height: 36rpx;
				}
			}
			.no-login {
				display: flex;
				align-items: center;
				font-weight: bold;
				font-size: 40rpx;
				color: var(--title-color);
				line-height: 40rpx;
			}
		}

		.right {
			display: flex;
			align-items: center;

			.btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 72rpx;
				height: 72rpx;
				background: #FFFFFF;
				border-radius: 24rpx;
				margin-left: 28rpx;
			}
		}
	}

	.box-wrapper {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;

		.box {
			display: flex;
			flex: 1;
			height: 136rpx;
			border-radius: 24rpx;
			overflow: hidden;
			font-size: 0;
			&.left {
				background: url(/static/images/mine/carList.png) right top/164rpx auto no-repeat, #FFFFFF;
				margin-right: 18rpx;
			}
			&.right {
				background: url(/static/images/mine/stat.png) right top/164rpx auto no-repeat, #FFFFFF;
				
			}

			.name {
				flex: none;
				width: 178rpx;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
				font-size: 30rpx;
				color: var(--title-color);
			}
		}
	}

	.statistics {
		border-radius: 24rpx;
		background-color: #FFFFFF;
		padding: 28rpx 0;
		margin-bottom: 20rpx;
		color: var(--title-color);

		.title {
			padding: 0 28rpx;
			font-weight: bold;
			font-size: 32rpx;
			line-height: 40rpx;
			margin-bottom: 20rpx;
		}

		.menus {
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
				line-height: 40rpx;

				.number {
					font-size: 32rpx;
					line-height: 56rpx;
					font-weight: bold;
					color: var(--title-color);
				}
			}
		}
	}

	.banner {
		height: 192rpx;
		border-radius: 24rpx 24rpx 24rpx 24rpx;
		margin-bottom: 20rpx;
	}

	.common-wrapper {
		padding: 28rpx 0;
		background: #FFFFFF;
		border-radius: 24rpx;
		color: var(--title-color);
		line-height: 40rpx;

		.title {
			padding: 0 28rpx;
			font-weight: bold;
			margin-bottom: 32rpx;
			font-size: 32rpx;
		}

		.menus {
			display: flex;
			flex-wrap: wrap;

			.menu {
				font-size: 24rpx;
				background-color: transparent;
				flex: none;
				width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-bottom: 32rpx;
				&::after {
					display: none;
				}
			}
		}
	}
</style>
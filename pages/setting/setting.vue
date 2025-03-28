<template>
	<view class="item-group">
		<view class="item my-border-bottom" hover-class="active" hover-start-time="0" hover-stay-time="200">
			<view class="label">头像</view>
			<view class="value">
				<uv-avatar src="/static/images/mine/avatar.png" :size="32" />
			</view>
		</view>
		<view class="item my-border-bottom" hover-class="active" hover-start-time="0" hover-stay-time="200">
			<view class="label">昵称</view>
			<view class="value" @click="handleNickname">
				{{ userInfo.Nickname }}
				<uv-icon name="arrow-right" color="#A0AFBA" size="24rpx" :custom-style="{ marginLeft: '16rpx' }"/>
			</view>
		</view>
		<view class="item" hover-class="active" hover-start-time="0" hover-stay-time="200">
			<view class="label">手机号</view>
			<view class="value">
				{{ userInfo.Mobile }}	
			</view>
		</view>
	</view>
	<view class="item-group">
		<view class="item my-border-bottom" hover-class="active" hover-start-time="0" hover-stay-time="200" @click="toAgreement('driverzc')">
			<view class="label">隐私协议</view>
			<view class="value">
				<uv-icon name="arrow-right" color="#A0AFBA" size="24rpx"/>
			</view>
		</view>
		<view class="item" hover-class="active" hover-start-time="0" hover-stay-time="200" @click="toAgreement('driverxy')">
			<view class="label">关于我们</view>
			<view class="value">
				<uv-icon name="arrow-right" color="#A0AFBA" size="24rpx"/>
			</view>
		</view>
	</view>
	<uv-button text="退出登录" color="#FFFFFF" :custom-style="{ height: '96rpx', borderRadius: '16rpx' }"
			:customTextStyle="{ color: 'var(--red-color)' }" @click="logout"/>
	<my-confirm ref="confirm" />
	<!-- 修改昵称 -->
	<NicknameModal closeOnClickOverlay showCancelButton ref="nicknameRef" @success="nicknameSuccess"/>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app';
	import { ref, reactive } from 'vue';
	import { useUserStore } from '@/stores/user.js';
	import { getToken, setToken } from '@/utils/token.js';
	import NicknameModal from '@/components/my-login-drawer/nickname-modal.vue';
	import { UptDriverNickName } from '@/api/index.js'
	import { storeToRefs } from 'pinia';

	const userStore = useUserStore();
	const { userInfo } = storeToRefs(userStore);

	const nicknameRef = ref();
	function handleNickname() {
		const name = getToken().userInfo.Nickname || '';
		nicknameRef.value.open(name)
	}
	async function nicknameSuccess(nickName) {
		console.log('nicknameSuccess',nickName)
		try {
			await UptDriverNickName({
				nickName
			})
			nicknameRef.value.close();
			const tokenData = getToken();
			await setToken({
				...tokenData,
				userInfo: {
					...tokenData.userInfo,
					Nickname: nickName
				},
			})
			userStore.setUserInfo({
				...tokenData.userInfo,
				Nickname: nickName
			})
			uni.showToast({
				title: '修改成功',
				icon: 'none'
			})
		}catch (error) {
			console.log('error',error)
			nicknameRef.value.closeLoading()
		}
	}

	function toAgreement(type) {
		uni.navigateTo({
			url: `/pages/agreement/agreement?type=${type}`
		})
	}

	const confirm = ref(null)
	function logout() {
		confirm.value.confirm({
			title: '确定退出登录？',
			cancelText: '再想想',
			confirmText: '退出',
			async confirm() {
				userStore.logout()
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}
		})
		
	}
</script>

<style lang="scss">
	page {
		padding: 24rpx;
	}
	.item-group {
		padding: 0 24rpx;
		border-radius: 24rpx;
		background: #FFFFFF;
		overflow: hidden;
		margin-bottom: 20rpx;
		.item {
			margin-bottom: 0!important;
		}
	}
	.item {
		height: 112rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 30rpx;
		line-height: 48rpx;
		margin-bottom: 20rpx;
		.label {
			color: var(--title-color);
		}
		.value {
			flex:1;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			color: var(--title-color);
			font-weight: 500;
		}
	}
</style>

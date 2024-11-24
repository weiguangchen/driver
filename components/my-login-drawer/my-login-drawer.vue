<template>
	<LoginDrawer ref="loginRef" @success="loginSuccess"/>
	<NicknameModal ref="nicknameRef" @success="nicknameSuccess"/>
</template>

<script setup>
	import { ref } from 'vue'
	import LoginDrawer from './login-drawer.vue';
	import NicknameModal from './nickname-modal.vue';
	import { useUserStore } from '@/stores/user.js'
	import { UptDriverNickName } from '@/api/index.js'
	import { setToken, getToken } from '@/utils/token.js'
	
	const userStore = useUserStore();
	const emits = defineEmits(['success'])
	
	const loginRef = ref();
	const nicknameRef = ref();
	
	async function loginSuccess(mobile) {
		console.log('loginSuccess',mobile)
		const userInfo = await userStore.login({
			mobile,
		})
		console.log('登陆成功')
		// await userStore.getCarList();
		
		if(!userInfo.Nickname) {
			nicknameRef.value.open();
		}else {
			emits('success')
		}
	}
	async function nicknameSuccess(nickName) {
		console.log('nicknameSuccess',nickName)
		try {
			await UptDriverNickName({
				nickName
			})
			nicknameRef.value.close();
			const tokenData = getToken();
			setToken({
				...tokenData,
				userInfo: {
					...tokenData.userInfo,
					Nickname: nickName
				},
			})
			emits('success')
		}catch {
			nicknameRef.value.closeLoading()
		}
		
	}
	
	function open() {
		loginRef.value.open();
	}
	
	defineExpose({
		open
	})
</script>

<style></style>
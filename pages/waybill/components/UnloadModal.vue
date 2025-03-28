<template>
	<my-drawer title="填写卸货说明" ref="drawer" showConfirmButton confirmText="提交" bgColor="#FFFFFF" asyncClose @confirm="confirm">
		<view class="form-wrapper">
			<uv-form errorType="toast" :model="model" :rules="rules" ref="form">
				<uv-form-item prop="memo">
					<uv-textarea v-model="model.memo" placeholder="请填写卸货说明" />
				</uv-form-item>
			</uv-form>
		</view>
	</my-drawer>
	
	<my-confirm ref="modal" />
</template>

<script setup>
	import { ref, reactive } from 'vue';
	import { getLocationInfo } from '@/utils/authorize.js'
	import { getToken } from '@/utils/token.js';
	import { UnloadConfirm } from '@/api/index.js';
	import {
		onReady
	} from '@dcloudio/uni-app';
	import { sleep } from '@/utils/index.js';
	const emits = defineEmits(['success']);
	const record = ref();
	const form = ref();
	const model = reactive({
		memo: "",
	})
	const rules = reactive({
		memo: [{ type: 'string', required: true, message: '请填写卸货说明' }]
	})
	
	const modal = ref();
	const drawer = ref();
	
	function open(data) {
		record.value = data;
		model.memo = data?.UnloadMemo ?? '';
		drawer.value.popup.open()
	}
	
	async function confirm() {
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
			drawer.value.closeLoading();
			return;
		}
		console.log('location', location)
		
		form.value.validate()
			.then(async res => {
				console.log('res',res)
				try {
					await UnloadConfirm({
						supplyId: record.value.SupplyId,
						onwayId: record.value.Id,
						userId: getToken().userInfo.Id,
						uType: 'driver',
						logitude: location.longitude,
						latitude: location.latitude,
						memo: model.memo
					})
					await uni.showToast({
						title: '操作成功',
						icon: 'none',
						complete() {
							setTimeout(() => {
								emits('success')
							},1500)
						}
					})
					drawer.value.popup.close();
				}catch (err){
					console.log('err',err)
					drawer.value.closeLoading();
					uni.showToast({
						title: err.data,
						icon: 'none'
					})
				}
			})
			.catch(err => {
				console.log('err',err)
				drawer.value.closeLoading();
			})
	}
	
	defineExpose({
		open
	})
</script>

<style lang="scss" scoped>
	.form-wrapper {
		padding: 0 24rpx;
	}
</style>
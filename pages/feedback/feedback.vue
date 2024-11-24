<template>
	<uv-form labelPosition="left" :model="model" :rules="rules" ref="form">
		<view class="title">反馈内容：</view>
		<view class="form-wrapper">
			<view style="margin-bottom: 24rpx;">
				<uv-form-item label="" prop="remark" borderBottom>
					<uv-textarea v-model="model.remark" border="none" placeholder="描述您遇到的问题或提出的建议（不少于10个字）" maxlength="300" count height="276rpx" :disableDefaultPadding="false" :placeholderStyle="{ fontSize: '28rpx', color: '' }"/>
				</uv-form-item>
			</view>
			<uv-form-item label="" prop="pics">
				<uv-upload :fileList="fileList" name="1" multiple :maxCount="9" @afterRead="afterRead" @delete="deletePic"
					:previewFullImage="true"></uv-upload>
			</uv-form-item>
		</view>
	
		<view class="title">联系方式：</view>
		<view class="form-wrapper" style="margin-bottom: 48rpx;">
			<uv-form-item label="" prop="phone">
				<uv-input v-model="model.phone" border="none" placeholder="留下您的手机号或邮箱" />
			</uv-form-item>
		</view>
		<uv-button text="提交" color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"></uv-button>
	</uv-form>
</template>

<script setup>
	import {
		reactive,
		ref
	} from 'vue';

	const fileList = ref([]);

	function afterRead(e) {
		// 这里直接模拟上传成功，这里的真实逻辑参考uv-upload组件示例
		setTimeout(() => {
			fileList.value = [{
				url: 'https://via.placeholder.com/100x100.png/3c9cff'
			}, {
				url: 'https://via.placeholder.com/100x100.png/ff0000'
			},{
				url: 'https://via.placeholder.com/100x100.png/3c9cff'
			}, {
				url: 'https://via.placeholder.com/100x100.png/ff0000'
			},{
				url: 'https://via.placeholder.com/100x100.png/3c9cff'
			}, {
				url: 'https://via.placeholder.com/100x100.png/ff0000'
			},]
			model.pics = fileList.value;
			// this.$refs.form.validateField('pics', err => {
				// 处理错误后的逻辑
			// })
		})
	}

	function deletePic(e) {
		fileList.value.splice(e.index, 1);
		// this.$refs.form.validateField('pics', err => {
			// 处理错误后的逻辑
		// })
	}
	const model = reactive({

	})
	const rules = ref()
</script>

<style lang="scss">
	page {
		padding: 24rpx;
	}

	.title {
		font-weight: 500;
		font-size: 30rpx;
		color: var(--title-color);
		line-height: 48rpx;
		margin-bottom: 16rpx;
	}
	.form-wrapper {
		margin-bottom: 32rpx;
		padding: 24rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		.uv-form-item__body {
			padding: 0!important;
			.uv-textarea {
				padding: 0 0 9px!important;
			}
		}
		
		.uv-upload {
			.uv-upload__wrap {
				
			}
		}
	}
</style>
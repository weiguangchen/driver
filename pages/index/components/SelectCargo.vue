<template>
	<view @click="showDrawer" class="cargo">
		<view class="uv-line-1">{{ text }}</view>
		 <uv-image src="/static/images/all.png" width="24rpx" height="24rpx"
				:custom-style="{ marginLeft: '4rpx', flex: 'none' }" :duration="0" />
	</view>


	<my-drawer ref="drawer" title="选择货主">
		<view class="my-dropdown-items">
			<view class="my-dropdown-item" :class="{'active': modelValue === item.value }" v-for="item in options"
				@click="select(item)">
				<view class="name">{{ item.label }}</view>
				<uv-image v-if="modelValue === item.value" src="/static/images/check.png" :duration="0" width="32rpx"
					height="32rpx" />
			</view>
		</view>
	</my-drawer>
</template>

<script setup>
	import {
		ref,
		unref,
		watch,
		watchEffect,
		getCurrentInstance,
		onMounted
	} from 'vue'
	import { CarTypeDict } from '@/utils/dict.js'
	import { GetDriverTakeTicketOwnerList } from '@/api/index.js'
	import { storeToRefs } from 'pinia'
	import { useUserStore } from '@/stores/user.js'
	const userStore = useUserStore();
	const { defaultCar } = storeToRefs(userStore)
	const {
		ctx
	} = getCurrentInstance();
	
	const props = defineProps({
		modelValue: {
			default: ''
		},
		options: {
			default: () => [],
			type: Array
		}
	})
	const emits = defineEmits(['update:modelValue', 'change'])

	const text = ref();
	watchEffect(() => {
		const find = props.options.find(m => m.value === props.modelValue)
		if (find) {
			text.value = find.label;
		}
	})

	const drawer = ref()
	function showDrawer() {
		drawer.value.popup.open()
	}
	function select(item) {
		emits('update:modelValue', item.value)
		emits('change', item)
		ctx.$uv.formValidate(ctx, 'change')
		drawer.value.popup.close()
	}
</script>

<style lang="scss" scoped>
	.my-dropdown-items {
		padding: 0 24rpx 24rpx;
		.my-dropdown-item {
			.name {
				flex: 1;
				margin: 0 24rpx;
			}
		}
	}

	
	.cargo {
		display: flex;
		align-items: center;
		font-weight: bold;
		font-size: 28rpx;
		color: var(--main-color);
		line-height: 40rpx;
	}
</style>
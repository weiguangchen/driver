<template>
	<view @click="showDrawer">
		<uv-input :value="text" input-align="right" placeholder="请选择" readonly border="none"
			placeholder-style="color:var(--intr-color);">
			<template v-slot:suffix>
				<uv-image src="/static/images/arrow.png" width="18rpx" height="18rpx" :duration="0" />
			</template>
		</uv-input>
	</view>


	<my-drawer ref="drawer" title="选择车辆类型">
		<view class="my-dropdown-items">
			<view class="my-dropdown-item" :class="{'active': modelValue === item.value }" v-for="item in options"
				@click="select(item)">
				<view class="car-type">
					<uv-image v-if="item.value === '自卸车'" src="/static/images/carType/car1.png" width="100%" height="100%"
						:duration="0" />
					<uv-image v-if="item.value === '半挂车'" src="/static/images/carType/car2.png" width="100%" height="100%"
						:duration="0" />
					<uv-image v-if="item.value === '罐车'" src="/static/images/carType/car3.png" width="100%" height="100%"
						:duration="0" />
				</view>
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
		getCurrentInstance
	} from 'vue'
	import { CarTypeDict } from '@/utils/dict.js'
	const {
		ctx
	} = getCurrentInstance();
	const props = defineProps({
		modelValue: {
			default: ''
		}
	})
	const emits = defineEmits(['update:modelValue', 'change'])

	const options = ref(CarTypeDict)

	const text = ref();
	watchEffect(() => {
		const find = options.value.find(m => m.value === props.modelValue)
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
			padding: 0 32rpx 0 0!important;
			height: 144rpx;
		
			.car-type {
				flex: none;
				width: 248rpx;
				height: 100%;
			}
		
			.name {
				flex: 1;
				margin: 0 24rpx;
			}
		}
	}
</style>
<template>
	<view class="select-box" hover-class="select-box--active" hover-start-time="0" hover-stay-time="200"
		@click="openDrawer">
		<view class="uv-line-1">{{ record ? record.label : placeholder }}</view>
		<uv-icon name="arrow-down" size="8" color="#B0BECC" />
	</view>

	<root-portal>
		<my-drawer ref="drawer" :title="title">
			<view class="my-dropdown-items">
				<view class="my-dropdown-item" :class="{'active': item.value === modelValue }" @click="selectType(item)" v-for="item in innerOptions" :key="item.value">
					<view style="flex:1;">{{ item.label }}</view>
					<uv-image v-if="item.value === modelValue" src="/static/images/check.png" :duration="0" width="32rpx" height="32rpx" />
				</view>
			</view>
		</my-drawer>
	</root-portal>
</template>

<script setup>
	import {
		computed,
		ref,
		watchEffect
	} from 'vue';
	
	const props = defineProps({
		modelValue: {
			defalut: ''
		},
		title: {
			type: String,
			default: ''
		},
		options: {
			default: () => [],
			type: Array
		},
		allowEmpty: {
			type: Boolean,
			default: true
		},
		placeholder: {
			default: '全部',
			type: String
		},
		disabled: {
			type: Boolean,
			default: false
		}
	})
	const emits = defineEmits(['update:modelValue', 'change', 'disabled-click'])
	const drawer = ref()
	
	const innerOptions = computed(() => {
		if(props.allowEmpty) {
			return [{
				value: '',
				label: props.placeholder
			},...props.options]
		}
		return props.options
	})

	const record = ref(null)
	watchEffect(() => {
		const find = innerOptions.value.find(m => m.value === props.modelValue);
		record.value = find ?? null;
	})

	function openDrawer() {
		if(props.disabled) {
			emits('disabled-click')
			return;
		}
		drawer.value.popup.open();
	}

	function selectType(item) {
		emits('update:modelValue', item.value)
		emits('change', item.value, item)
		drawer.value.popup.close();
	}
</script>

<style lang="scss">
	.select-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32rpx;
		height: 72rpx;
		background: #FFFFFF;
		border-radius: 36rpx;
		border: 2rpx solid var(--divider);
		font-size: 26rpx;
		color: var(--title-color);
		line-height: 48rpx;

		&--active {
			opacity: 0.45;
		}
	}
</style>
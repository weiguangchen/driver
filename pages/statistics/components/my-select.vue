<template>
	<view class="select-box" hover-class="select-box--active" hover-start-time="0" hover-stay-time="200"
		@click="openDrawer">
		<view class="uv-line-1" v-if="record">{{ record.label}}</view>
		<uv-icon name="arrow-down" size="8" color="#B0BECC" />
	</view>

	<root-portal>
		<my-drawer ref="drawer" :title="title">
			<view class="my-dropdown-items">
				<view class="my-dropdown-item" :class="{'active': item.value === modelValue }" @click="selectType(item)" v-for="item in options">
					<view style="flex:1;">{{ item.label }}</view>
					<uv-image v-if="item.value === modelValue" src="/static/images/check.png" :duration="0" width="32rpx" height="32rpx" />
				</view>
			</view>
		</my-drawer>
	</root-portal>
</template>

<script setup>
	import {
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
		}
	})
	const emits = defineEmits(['update:modelValue', 'change'])
	const drawer = ref()

	const record = ref(null)
	watchEffect(() => {
		if (props.options.length === 0) return;
		const find = props.options.find(m => m.value === props.modelValue);
		if (find) {
			record.value = find;
		} else {
			const defaultItem = props.options?.[0];
			record.value = defaultItem;
			emits('update:modelValue', defaultItem.value);
		}
	})

	function openDrawer() {
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
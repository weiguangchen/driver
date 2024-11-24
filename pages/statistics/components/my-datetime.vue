<template>
	<view class="date-range">
		<view class="start-date" @click="selectDate('start')">
			{{ startDate || '开始时间' }}
			<uv-icon name="arrow-down" size="8" color="#B0BECC" />
		</view>
		<uv-line color="#C8D4DF" length="20rpx" margin="0 20rpx" />
		<view class="end-date" @click="selectDate('end')">
			{{ endDate || '结束时间' }}
			<uv-icon name="arrow-down" size="8" color="#B0BECC" />
		</view>
	</view>

	<!-- 时间类型 -->
	<root-portal>
		<uv-datetime-picker ref="datetimePicker" v-model="dateTime" mode="date" confirmColor="var(--main-color)"
			@confirm="confirmDateTime" :min-date="minDate" :max-date="maxDate" />
	</root-portal>
</template>

<script setup>
	import {
		ref,
		onMounted,
		watchEffect,
		computed
	} from 'vue'
	import dayjs from 'dayjs'
	const props = defineProps({
		modelValue: {
			default: () => [],
			type: Array
		}
	})
	const emits = defineEmits(['update:modelValue','change']);

	const startDate = ref();
	const endDate = ref();
	const dateType = ref('start')
	const datetimePicker = ref();
	const minDate = ref();
	const maxDate = ref();
	// 时间范围
	const min = dayjs();
	const max = dayjs().add(1, 'year').valueOf();
	const dateTime = ref();

	watchEffect(() => {
		const [start, end] = props.modelValue;
		startDate.value = start;
		endDate.value = end;
	})

	const getMinDate = computed(() => {
		if(!startDate.value) return dayjs(min).valueOf();
		return dayjs(startDate.value).isAfter(min) ? dayjs(startDate.value).valueOf() : dayjs(min).valueOf();
	})
	const getMaxDate = computed(() => {
		if(!endDate.value) return dayjs(max).valueOf();
		return dayjs(endDate.value).isBefore(max) ? dayjs(endDate.value).valueOf() : dayjs(max).valueOf();
	})


	function selectDate(type) {
		dateType.value = type;
		if (type === 'start') {
			minDate.value = min.valueOf();
			maxDate.value = getMaxDate.value;
		}
		if (type === 'end') {
			minDate.value = getMinDate.value;
			maxDate.value = max.valueOf()
		}
		datetimePicker.value.open()
	}

	function confirmDateTime({
		value
	}) {
		const val = dayjs(value).format('YYYY-MM-DD');
		if (dateType.value === 'start') {
			startDate.value = val;
		}
		if (dateType.value === 'end') {
			endDate.value = val;
		}
		const date = [startDate?.value ?? '',endDate?.value ?? '']
		emits('update:modelValue', date)
		emits('change', date)
	}
</script>

<style lang="scss">
	.date-range {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24rpx;
		padding: 0 10rpx;

		.start-date,
		.end-date {
			justify-content: space-between;
			width: 300rpx;
			flex: none;
			color: var(--intr-color);
		}
	}

	.start-date,
	.end-date {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--intr-color);
		padding: 0 32rpx;
		height: 72rpx;
		background: #FFFFFF;
		border-radius: 36rpx;
		border: 2rpx solid var(--divider);
		font-size: 26rpx;
		line-height: 48rpx;

		&--active {
			opacity: 0.45;
		}

		&.active {
			background: linear-gradient(270deg, #31CE57 0%, #07B130 100%);
			color: #FFFFFF;
			border: none;
		}
	}
</style>
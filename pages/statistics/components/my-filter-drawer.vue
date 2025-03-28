<template>
	<!-- <view class="filter active"  @click="openFilter"> -->
	<view class="filter"  @click="openFilter">
		<uv-image src="/static/images/filter/filter.png" width="32rpx" height="32rpx" />
		<!-- <uv-image src="/static/images/filter/filter-selected.png" width="32rpx" height="32rpx" /> -->
	</view>
	
	<my-drawer ref="filter" title="运单筛选" height="550" @change="change">
		<view class="filter-wrapper">
			<uv-row customStyle="margin-bottom: 24rpx" gutter="20rpx">
				<uv-col span="6" @click="openType">
					<MySelect :options="typeOptions" v-model="type" title="选择时间类型" />
				</uv-col>
				<uv-col span="6">
					<MySelect :options="statusOptions" v-model="status" title="选择状态类型" />
				</uv-col>
			</uv-row>
			<view class="filter-title">时间范围</view>
			<uv-row customStyle="margin-bottom: 24rpx" gutter="20rpx">
				<uv-col span="4">
					<view class="date-box" :class="{ 'active': dateMode === '全部时间' }" hover-class="select-box--active" hover-start-time="0"
						hover-stay-time="200" @click="setDateMode('全部时间')">全部时间</view>
				</uv-col>
				<uv-col span="4">
					<view class="date-box" :class="{ 'active': dateMode === '今天' }" hover-class="select-box--active" hover-start-time="0" hover-stay-time="200" @click="setDateMode('今天')">今天</view>
				</uv-col>
				<uv-col span="4">
					<view class="date-box" :class="{ 'active': dateMode === '昨天' }"  hover-class="select-box--active" hover-start-time="0" hover-stay-time="200"  @click="setDateMode('昨天')">昨天</view>
				</uv-col>
			</uv-row>
			<uv-row customStyle="margin-bottom: 24rpx" gutter="20rpx">
				<uv-col span="4">
					<view class="date-box" hover-class="select-box--active" hover-start-time="0" hover-stay-time="200"  @click="setDateMode('本月')">
						本月</view>
				</uv-col>
				<uv-col span="4">
					<view class="date-box" hover-class="select-box--active" hover-start-time="0" hover-stay-time="200"  @click="setDateMode('近7天')">近 7 天</view>
				</uv-col>
				<uv-col span="4">
					<view class="date-box" hover-class="select-box--active" hover-start-time="0" hover-stay-time="200" @click="setDateMode('近30天')">近 30 天</view>
				</uv-col>
			</uv-row>
			<MyDatetime v-model="date" @change="changeDate"/>
			<view class="filter-title">装货信息</view>
			<uv-row customStyle="margin-bottom: 24rpx" gutter="20rpx">
				<uv-col span="6">
					<MySelect :options="mfrsOptions" v-model="mfrs" title="选择装货厂家" />
				</uv-col>
				<uv-col span="6">
					<MySelect :options="materialOptions" v-model="material" title="选择物料" />
				</uv-col>
			</uv-row>
			<view class="filter-title">卸货信息</view>
			<uv-row customStyle="margin-bottom: 24rpx" gutter="20rpx">
				<uv-col span="12">
					<MySelect :options="dischargeOptions" v-model="discharge" title="选择卸货地" />
				</uv-col>
			</uv-row>
		</view>

		<template #footer>
			<view class="btn-group">
				<view class="left">
					<uv-button text="重置" :custom-style="{ height: '96rpx', color: 'var(--sub-color)', borderRadius: '16rpx', fontSize: '30rpx', fontWeight: 'bold' }" @click="reset"></uv-button>
				</view>
				<view class="right">
					<uv-button text="筛选" color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%)" :custom-style="{ height: '96rpx', borderRadius: '16rpx', fontSize: '30rpx', fontWeight: 'bold' }" @click="submit"></uv-button>
				</view>
			</view>
		</template>
	</my-drawer>

	<!-- 时间类型 -->
	<uv-datetime-picker ref="datetimePicker"  mode="date" confirmColor="var(--main-color)" @confirm="confirmDateTime" :min-date="minDate" :max-date="maxDate"/>

</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue'
	import MySelect from './my-select.vue';
	import MyDatetime from './my-datetime.vue';
	import dayjs from 'dayjs';
	
	const emits = defineEmits(['change'])
	function change(show) {
		emits('change',show)
	}
	
	const filter = ref();

	function open() {
		filter.value.popup.open();
	}
	function openFilter() {
		filter.value.popup.open();
	}
	// 选择查看类型
	const typeOptions = ref([{
		label: '接单时间',
		value: '1'
	}, {
		label: '完成状态',
		value: '2'
	}])
	const type = ref(1);
	// 选择状态
	const statusOptions = ref([{
		label: '全部状态',
		value: 'all'
	}, {
		label: '已接单',
		value: '1'
	}, {
		label: '已完成',
		value: '2'
	}, {
		label: '已取消',
		value: '3'
	}])
	const status = ref('all')
	// 车辆
	const carOptions = ref([{
		label: '全部车辆',
		value: 'all'
	}, {
		label: '车辆1',
		value: '1'
	}, {
		label: '车辆2',
		value: '2'
	}, {
		label: '车辆3',
		value: '3'
	}])
	const car = ref('all')
	// 装货厂家
	const mfrsOptions = ref([{
		label: '全部装货厂家',
		value: 'all'
	}, {
		label: '选项',
		value: '1'
	}, {
		label: '选项',
		value: '2'
	}])
	const mfrs = ref('all')
	// 物料
	const materialOptions = ref([{
		label: '全部物料',
		value: 'all'
	}, {
		label: '选项',
		value: '1'
	}, {
		label: '选项',
		value: '2'
	}])
	const material = ref('all')
	// 卸货信息
	const dischargeOptions = ref([{
		label: '全部卸货地',
		value: 'all'
	}, {
		label: '选项',
		value: '1'
	}, {
		label: '选项',
		value: '2'
	}])
	const discharge = ref('all')
	// 货主信息
	const cargoOptions = ref([{
		label: '全部货主',
		value: 'all'
	}, {
		label: '选项',
		value: '1'
	}, {
		label: '选项',
		value: '2'
	}])
	const cargo = ref('all')
	// 接单时间
	const dateMode = ref('全部时间')
	function setDateMode(mode) {
		dateMode.value = mode;
		if(dateMode.value === '全部时间') {
			date.value = []
		}
		if(dateMode.value === '今天') {
			date.value = [dayjs().format('YYYY-MM-DD'),dayjs().format('YYYY-MM-DD')]
		}
		if(dateMode.value === '昨天') {
			date.value = [dayjs().subtract(1,'day').format('YYYY-MM-DD'),dayjs().subtract(1,'day').format('YYYY-MM-DD')]
		}
		if(dateMode.value === '本月') {
			date.value = [dayjs().startOf('month').format('YYYY-MM-DD'),dayjs().endOf('month').format('YYYY-MM-DD')]
		}
		if(dateMode.value === '近7天') {
			date.value = [dayjs().subtract(7,'day').format('YYYY-MM-DD'),dayjs().format('YYYY-MM-DD')]
		}
		if(dateMode.value === '近30天') {
			date.value = [dayjs().subtract(30,'day').format('YYYY-MM-DD'),dayjs().format('YYYY-MM-DD')]
		}
	}
	const date = ref([]);
	function changeDate(date) {
		console.log(date)
	}
	
	// 包装参数
	const params = computed(() => {
		
	})
		
	function reset() {
		filter.value.popup.close();
	}
	function submit() {
		console.log('date',date)
		filter.value.popup.close();
	}
	
	
	
	defineExpose({
		open
	})
</script>

<style lang="scss">
	.filter {
		margin-left: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64rpx;
		height: 64rpx;
		background: #FFFFFF;
		border-radius: 50%;
		border: 1rpx solid rgba(151, 151, 151, 0.2);
		
		&.active {
			background: #31CE57;
			border: none;
		}
	}
	.filter-wrapper {
		padding: 0 24rpx;

		.filter-title {
			font-weight: 500;
			font-size: 30rpx;
			color: var(--title-color);
			line-height: 48rpx;
			margin-bottom: 16rpx;
		}

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

		.date-box,
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
	}

	.btn-group {
		display: flex;

		.left {
			width: 192rpx;
			margin-right: 20rpx;
		}

		.right {
			flex: 1;
		}
	}
</style>
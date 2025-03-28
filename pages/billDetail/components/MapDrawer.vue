<template>
	<my-drawer ref="drawer" :showTitle="false" bgColor="#FFFFFF" round="12px">
		<view class="map-wrapper">
			<map id="map" style="width: 100%;height: 480rpx;"/>
		</view>
		<view class="info-wrapper">
			<view class="map-location-wrapper">
				<view class="tag" :class="{ 'zhuang': info.type === 1, 'xie': info.type === 2 }">{{ info.type === 1 ? '装货地' : '卸货地' }}</view>
				<view class="name">{{ info.name }}</view>
				<view class="address">{{ info.address }}</view>
				<template v-if="info.user || info.phone">
					<uv-line color="#E3E9EF" margin="28rpx 0 32rpx"/>
					<view class="person" v-if="info.user || info.phone">
						<text style="margin-right: 24rpx;" v-if="info.user">{{ info.user }}</text>
						<text v-if="info.phone">{{ info.phone }}</text>
					</view>
				</template>
			</view>
		</view>

		<template #footer>
			<view class="map-footer">
				<view class="btn" style="margin-right: 22rpx;">
					<uv-button color="#E7F9E9"
						:custom-style="{ height: '96rpx', border: '1px solid var(--main-color)', borderRadius: '16rpx', color: 'var(--main-color)' }" @click="makePhone">
						<uv-image src="/static/images/phone.png" width="40rpx" height="40rpx" :duration="0"
							:custom-style="{ marginRight: '4rpx' }" />
						呼叫
					</uv-button>
				</view>
				<view class="btn">
					<uv-button color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%)"
						:custom-style="{ height: '96rpx',borderRadius: '16rpx' }"  @click="openApp">
						<uv-image src="/static/images/location.png" width="40rpx" height="40rpx" :duration="0" :custom-style="{ marginRight: '4rpx' }"/>
						导航
					</uv-button>
				</view>
			</view>
		</template>
	</my-drawer>
</template>

<script setup>
	import {
		ref,
		onMounted,
		getCurrentInstance,
		reactive
	} from 'vue';
	import { sleep } from '@/utils/index.js';
	
	const { ctx } = getCurrentInstance();
	const drawer = ref();
	
	const mapContext = ref();
	onMounted(() => {
		mapContext.value = uni.createMapContext("map", ctx);
	})
	
	function makePhone() {
		if(!info.phone) {
			return;
		}
		
		uni.makePhoneCall({
			phoneNumber: info.phone
		})
	}
	function openApp() {
		uni.openLocation({
			longitude: info.longitude,
			latitude: info.latitude,
			name: info.name,
			address: info.address
		})
	}
	
	const info = reactive({
		type: '',
		name: '',
		address: '',
		user: '',
		phone: ''
	})
	async function open(data) {
		console.log('打开地图 data', data)
		info.type = data?.type ?? '';
		info.name = data?.name ?? '';
		info.address = data?.address ?? '';
		info.user = data?.user ?? '';
		info.phone = data?.phone ?? '';
		info.longitude = data?.longitude ?? '';
		info.latitude = data?.latitude ?? '';
		drawer.value.popup.open();
		
		await sleep(300);
		const marker = {
			id: 123,
			longitude: data.longitude,
			latitude: data.latitude,
			iconPath: '/static/images/map-marker.png',
			width: '30rpx',
			height: '42rpx',
			customCallout: {
				display: 'ALWAYS',
				anchorX: 0,
				anchorY: -12
			}
		}
		mapContext.value.addMarkers({
			markers: [marker],
			clear: true
		})
		mapContext.value.moveToLocation({
			longitude: info.longitude,
			latitude: info.latitude,
		})
	}


	defineExpose({
		open
	})
</script>

<style lang="scss" scoped>
	.map-wrapper {
		border-radius: 12px;
		overflow: hidden;
		transform: translateY(0)
	}
	.info-wrapper {
		padding: 24rpx;
		background-color: var(--page-bg);
		border-radius: 24rpx 24rpx 0 0;
		margin-top: -40rpx;
		position: relative;
		z-index: 200;
	}
	.map-location-wrapper {
		padding: 28rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		overflow: hidden;
		.tag {
			width: fit-content;
			display: flex;
			align-items: center;
			padding: 0 12rpx;
			height: 44rpx;
			border-radius: 8rpx;
			font-weight: 500;
			font-size: 26rpx;
			color: #FFFFFF;
			margin-bottom: 20rpx;

			&.xie {
				background-color: #FC7E2C;
			}
			&.zhuang {
				background-color: var(--main-color);
			}
		}

		.name {
			color: var(--title-color);
			font-weight: bold;
			font-size: 36rpx;
			line-height: 44rpx;
			margin-bottom: 20rpx;
		}

		.address {
			font-size: 26rpx;
			color: var(--sub-color);
			line-height: 32rpx;
		}

		.person {
			font-weight: bold;
			font-size: 28rpx;
			color: var(--title-color);
			line-height: 48rpx;
		}
	}

	.map-footer {
		display: flex;
		.btn {
			flex: 1;
		}
	}
</style>
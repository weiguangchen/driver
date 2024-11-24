<template>
	<my-drawer ref="drawer" :showTitle="false" bgColor="#FFFFFF" round="12px">
		<view class="map-wrapper">
			<map id="map" style="width: 100%;height: 480rpx;"/>
		</view>
		<view class="info-wrapper">
			<view class="map-location-wrapper">
				<view class="tag xie">卸货地</view>
				<view class="name">河南腾圃建材有限公司</view>
				<view class="address">天津市河西区陈塘庄街道88号</view>
				<uv-line color="#E3E9EF" margin="28rpx 0 32rpx" />
				<view class="person">
					<text style="margin-right: 24rpx;">霍了了</text>
					<text>18608086666</text>
				</view>
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
		getCurrentInstance
	} from 'vue';
	const { ctx } = getCurrentInstance();
	const drawer = ref();
	
	const mapContext = ref();
	onMounted(() => {
		mapContext.value = uni.createMapContext("map", ctx);
		
		mapContext.value.moveToLocation({
			longitude: 117.216188,
			latitude: 39.113613,
		})
	})
	
	function makePhone() {
		uni.openLocation({
			longitude: 117.216188,
			latitude: 39.113613,
		})
	}
	
	function openApp() {
		mapContext.value.openMapApp({
			longitude: 117.216188,
			latitude: 39.113613,
			destination: '天津国贸购物中心'
		});
	}

	function open() {
		drawer.value.popup.open();
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
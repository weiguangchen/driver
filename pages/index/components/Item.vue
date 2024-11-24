<template>
	<view class="bill-wrapper">
		<view class="mfrs">
			<view class="name" v-if="record.OwnerEnt">{{ record.OwnerEnt ? record.OwnerEnt.OwnerName : '' }}</view>
			<view class="date">{{ record.CreatorTime }}</view>
		</view>
		<view class="cate">{{ record.MatList.length > 0 ? record.MatList[0].MaterialName : '' }} 等 {{ record.MatList.length }} 物料</view>
		<view class="location-wrapper">
			<view class="from" v-if="record.SupEnt">
				<view class="line">
					<view class="dot" v-for="dot in 3" />
				</view>
				<uv-image src="/static/images/dot1.png" width="16rpx" height="16rpx" :duration="0"
					:custom-style="{ marginRight: '16rpx' }" />
				<view class="city uv-line-1">{{ record.SupEnt ? record.SupEnt.City : '' }}</view>
				<view class="name uv-line-1">{{ record.SupEnt ? record.SupEnt.SupplierName : '' }}</view>
				<view class="dis" v-if="record.District">{{ record.District }} km</view>
			</view>
			<view class="to" v-if="record.UnloadEnt">
				<uv-image src="/static/images/dot2.png" width="16rpx" height="16rpx" :duration="0"
					:custom-style="{ marginRight: '16rpx' }" />
				<view class="city uv-line-1">{{ record.UnloadEnt ? record.UnloadEnt.City : '' }}</view>
				<view class="name uv-line-1">{{ record.UnloadEnt ? record.UnloadEnt.PlaceName : '' }}</view>
			</view>
		</view>
		<view class="footer">
			<uv-button text="查看详情" color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"
				:customStyle="{ height: '92rpx', borderRadius:'16rpx' }" @click="toDetail" />
		</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		record: {
			default: () => {},
			type: Object
		}
	})
	
	function toDetail() {
		uni.navigateTo({
			url: `/pages/billDetail/billDetail?assignId=${props.record.Id}`
		})
	}
	
</script>

<style lang="scss">
	.bill-wrapper {
		padding: 28rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		margin-bottom: 20rpx;

		.mfrs {
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: var(--title-color);
			line-height: 48rpx;

			.name {
				font-weight: bold;
				font-size: 32rpx;
			}

			.date {
				font-size: 26rpx;
				color: var(--sub-color);
			}
		}

		.cate {
			font-size: 26rpx;
			color: var(--sub-color);
			line-height: 48rpx;
			margin-bottom: 20rpx;
		}

		.location-wrapper {
			padding: 24rpx 20rpx;
			background: var(--page-bg);
			border-radius: 16rpx;
			margin-bottom: 28rpx;

			.line {
				position: absolute;
				height: 24rpx;
				top: 34rpx;
				left: 6rpx;

				.dot {
					width: 4rpx;
					height: 4rpx;
					border-radius: 50%;
					background-color: #C8D4DF;

					&:not(:last-child) {
						margin-bottom: 6rpx;
					}
				}
			}

			.from,
			.to {
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 26rpx;
				line-height: 36rpx;

				.city {
					color: var(--title-color);
					margin-right: 16rpx;
					max-width: 120rpx;
				}

				.name {
					flex: 1;
					color: var(--content-color);
				}

				.dis {
					color: var(--main-color);
					margin-left: 12rpx;
				}
			}

			.from {
				position: relative;
				margin-bottom: 20rpx;
			}
		}
	}
</style>
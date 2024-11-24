<template>
	<view class="my-plate" :class="[color]" :style="[customStyle]">
		<view class="inner">
			<view class="left">{{ left }}</view>
			<view class="right">{{ right }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		options: {
			virtualHost: true
		}
	}
</script>
<script setup>
	import {
		ref,
		computed,
		watchEffect
	} from 'vue';
	const props = defineProps({
		customStyle: {
			default: () => {},
			type: Object
		},
		plate: {
			default: '京ATY8902',
			type: String
		},
		color: {
			default: 'yellow',
			validator(value, props) {
				return ['yellow', 'kelly', 'blue', 'gren'].includes(value)
			}
		}
	})
	const left = ref()
	const right = ref();
	watchEffect(() => {
		if (!props.plate) return;
		left.value = props.plate.slice(0, 2);
		right.value = props.plate.slice(2);
	})
</script>

<style lang="scss">
	.my-plate {
		width: fit-content;
		display: flex;
		padding: 4rpx;
		height: 64rpx;
		border-radius: 12rpx;
		color: var(--title-color);
		font-weight: bold;

		.inner {
			font-family: misans;
			flex: 1;
			display: flex;
			border-radius: 10rpx;
			overflow: hidden;
			border: 2rpx solid var(--title-color);

			.left {
				padding: 0 10rpx;
				position: relative;
				display: flex;
				align-items: center;

				&::after {
					content: '';
					display: block;
					position: absolute;
					width: 8rpx;
					height: 8rpx;
					border-radius: 50%;
					background-color: var(--title-color);
					top: 50%;
					right: 0;
					transform: translate(50%, -50%);
				}
			}

			.right {
				display: flex;
				align-items: center;
				padding:0 10rpx;
			}
		}
	
		
		&.yellow {
			background: #FFBD00;
		}
		&.kelly {
			background-color: #FFBD00;
			.left {
				background-color: transparent;
			}
			.right {
				background-color: #00EC7B;
			}
		}
		&.blue {
			background-color: #3773FF;
			color: #ffffff;
			.inner {
				border: 2rpx solid #ffffff;
				.left {
					&::after {
						background-color: #ffffff;
					}
				}
			}
		}
		&.gren {
			background: linear-gradient(180deg, #F8F8F8 0%, #00EC7B 100%);
		}
	}
</style>
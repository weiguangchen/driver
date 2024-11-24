<template>
	<view @click="showDrawer">
		<uv-input v-model="text" input-align="right" placeholder="请选择" readonly border="none"
			placeholder-style="color:var(--intr-color);">
			<template v-slot:suffix>
				<uv-image src="/static/images/arrow.png" width="18rpx" height="18rpx" :duration="0" />
			</template>
		</uv-input>
	</view>


	<my-drawer ref="drawer" title="选择车牌颜色">
		<view class="my-dropdown-items">
			<view class="my-dropdown-item" :class="{'active': modelValue === item.value }" v-for="item in ColorDict"
				@click="select(item)">
				<view class="color" :class="{
					'yellow': item.value === 'yellow',
					'yellow-green': item.value === 'kelly',
					'blue': item.value === 'blue',
					'green': item.value === 'gren',
				}"></view>
				<view class="name">{{ item.label }}</view>
				<uv-image v-if="modelValue === item.value" src="/static/images/check.png" :duration="0" width="32rpx"
					height="32rpx" />
			</view>
		</view>
	</my-drawer>
</template>

<script>
	import { ColorDict } from '@/utils/dict.js'
	export default {
		name: 'select-color',
		data() {
			return {
				ColorDict,
				text: ''
			}
		},
		props: {
			modelValue: {
				default: ''
			}
		},
		watch: {
			modelValue: {
				handler() {
					const find = ColorDict.find(m => m.value === this.modelValue)
					console.log('find', find)
					if (find) {
						this.text = find.label;
					}
				},
				immediate: true
			}
		},
		methods: {
			showDrawer() {
				this.$refs.drawer.popup.open()
			},
			select(item) {
				this.$emit('change',item)
				this.$emit('update:modelValue', item.value)
				this.$nextTick(() => {
					this.$uv.formValidate(this, 'change')
				})

				this.$refs.drawer.popup.close()
			}
		}
	}
</script>

<style lang="scss">
	.my-dropdown-items {
		padding: 0 24rpx 24rpx;
		.my-dropdown-item {
			padding: 48rpx 32rpx !important;
		
			.color {
				width: 144rpx;
				height: 48rpx;
				border-radius: 8rpx;
		
				&.yellow {
					background: #FFBD00;
				}
		
				&.yellow-green {
					display: flex;
					justify-content: flex-end;
					position: relative;
					background: #FFBD00;
					padding: 4rpx;
		
					&::after {
						content: '';
						display: block;
						width: 92rpx;
						height: 40rpx;
						background: var(--main-color);
						border-radius: 6rpx;
					}
				}
		
				&.blue {
					background: #3773FF;
				}
		
				&.green {
					background: linear-gradient(180deg, #F8F8F8 0%, var(--main-color) 100%);
				}
			}
		
			.name {
				flex: 1;
				margin: 0 24rpx;
			}
		}
	}
	
</style>
<template>
	<view class="uv-number-box">
		<view
		  class="uv-number-box__slot"
		  @tap.stop="clickHandler('minus')"
		  @touchstart="onTouchStart('minus')"
		  @touchend.stop="clearTimeout"
		  v-if="showMinus && $slots.minus"
		>
			<slot name="minus" />
		</view>
		<view
		  v-else-if="showMinus"
		  class="uv-number-box__minus"
		  @tap.stop="clickHandler('minus')"
		  @touchstart="onTouchStart('minus')"
		  @touchend.stop="clearTimeout"
		  hover-class="uv-number-box__minus--hover"
		  hover-stay-time="150"
		  :class="{ 'uv-number-box__minus--disabled': isDisabled('minus') }"
		  :style="[buttonStyle('minus')]"
		>
			<!-- <uv-icon
			  name="minus"
			  :color="isDisabled('minus') ? '#c8c9cc' : 'var(--title-color)'"
			  size="15"
			  bold
				:customStyle="iconStyle"
			></uv-icon> -->
			<uv-image
				v-if="isDisabled('minus')"
				src="/static/images/myNumberBox/minus_disabled.png"
				width="64rpx"
				height="64rpx"
				:duration="0"
			/>
			<uv-image
				v-else
				src="/static/images/myNumberBox/minus.png"
				width="64rpx"
				height="64rpx"
				:duration="0"
			/>
		</view>
		<!-- <slot name="input"> -->
			<view class="input-wrapper">
				<input
				  ref="inputRef"
				  :disabled="disabledInput || disabled"
				  :cursor-spacing="getCursorSpacing"
				  :class="{ 'uv-number-box__input--disabled': disabled || disabledInput }"
				  v-model="currentValue"
				  class="uv-number-box__input"
				  @blur="onBlur"
				  @focus="onFocus"
				  @input="onInput"
				  type="number"
				  :style="[inputStyle]"
				/>
				<view class="unit">{{ unit }}</view>
			</view>
		<!-- </slot> -->
		<view
		  class="uv-number-box__slot"
		  @tap.stop="clickHandler('plus')"
		  @touchstart="onTouchStart('plus')"
		  @touchend.stop="clearTimeout"
		  v-if="showPlus && $slots.plus"
		>
			<slot name="plus" />
		</view>
		<view
		  v-else-if="showPlus"
		  class="uv-number-box__plus"
		  @tap.stop="clickHandler('plus')"
		  @touchstart="onTouchStart('plus')"
		  @touchend.stop="clearTimeout"
		  hover-class="uv-number-box__plus--hover"
		  hover-stay-time="150"
		  :class="{ 'uv-number-box__minus--disabled': isDisabled('plus') }"
		  :style="[buttonStyle('plus')]"
		>
			<!-- <uv-icon
			  name="plus"
			  :color="isDisabled('plus') ? '#c8c9cc' : 'var(--title-color)'"
			  size="15"
			  bold
				:customStyle="iconStyle"
			></uv-icon> -->
			<uv-image
				v-if="isDisabled('plus')"
				src="/static/images/myNumberBox/plus_disabled.png"
				width="64rpx"
				height="64rpx"
				:duration="0"
			/>
			<uv-image
				v-else
				src="/static/images/myNumberBox/plus.png"
				width="64rpx"
				height="64rpx"
				:duration="0"
			/>
		</view>
	</view>
</template>
<script>
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
	import props from '@/uni_modules/uv-number-box/components/uv-number-box/props.js';
	import Big from 'big.js';
	/**
	 * numberBox 步进器
	 * @description 该组件一般用于商城购物选择物品数量的场景。
	 * @tutorial https://www.uvui.cn/components/numberBox.html
	 * @property {String | Number}	value / v-model			用于双向绑定的值，初始化时设置设为默认min值(最小值)  （默认 0 ）
	 * @property {String | Number}	name			步进器标识符，在change回调返回
	 * @property {String | Number}	min				最小值 （默认 1 ）
	 * @property {String | Number}	max				最大值 （默认 Number.MAX_SAFE_INTEGER ）
	 * @property {String | Number}	step			加减的步长，可为小数 （默认 1 ）
	 * @property {Boolean}			integer			是否只允许输入整数 （默认 false ）
	 * @property {Boolean}			disabled		是否禁用，包括输入框，加减按钮 （默认 false ）
	 * @property {Boolean}			disabledInput	是否禁用输入框 （默认 false ）
	 * @property {Boolean}			asyncChange		是否开启异步变更，开启后需要手动控制输入值 （默认 false ）
	 * @property {String | Number}	inputWidth		输入框宽度，单位为px （默认 35 ）
	 * @property {Boolean}			showMinus		是否显示减少按钮 （默认 true ）
	 * @property {Boolean}			showPlus		是否显示增加按钮 （默认 true ）
	 * @property {String | Number}	decimalLength	显示的小数位数
	 * @property {Boolean}			longPress		是否开启长按加减手势 （默认 true ）
	 * @property {String}			color			输入框文字和加减按钮图标的颜色 （默认 '#323233' ）
	 * @property {String | Number}	buttonSize		按钮大小，宽高等于此值，单位px，输入框高度和此值保持一致 （默认 30 ）
	 * @property {String}			bgColor			输入框和按钮的背景颜色 （默认 '#EBECEE' ）
	 * @property {String | Number}	cursorSpacing	指定光标于键盘的距离，避免键盘遮挡输入框，单位px （默认 100 ）
	 * @property {Boolean}			disablePlus		是否禁用增加按钮 （默认 false ）
	 * @property {Boolean}			disableMinus	是否禁用减少按钮 （默认 false ）
	 * @property {Object ｜ String}	iconStyle		加减按钮图标的样式
	 * @event {Function}	onFocus	输入框活动焦点
	 * @event {Function}	onBlur	输入框失去焦点
	 * @event {Function}	onInput	输入框值发生变化
	 * @event {Function}	onChange
	 * @example <uv-number-box v-model="value" @change="valChange"></uv-number-box>
	 */
	export default {
		name: 'uv-number-box',
		mixins: [mpMixin, mixin, props],
		props: {
			min: {
				default: 0,
				type: Number
			},
			unit: {
				default: '吨',
				type: String
			},
			minLimitMsg: {
				default: null,
				type: Function
			},
			maxLimitMsg: {
				default: null,
				type: Function
			}
		},
		data() {
			return {
				// 输入框实际操作的值
				currentValue: '',
				// 定时器
				longPressTimer: null
			}
		},
		watch: {
			// 多个值之间，只要一个值发生变化，都要重新检查check()函数
			watchChange(n) {
				this.check()
			},
			value(newVal) {
				if (newVal !== this.currentValue) {
					this.currentValue = this.format(this.value)
				}
			},
			modelValue(newVal) {
				// if (newVal !== this.currentValue) {
					this.currentValue = this.formatter(this.format(this.modelValue))
				// }
			}
		},
		computed: {
			getCursorSpacing() {
				// 判断传入的单位，如果为px单位，需要转成px
				return this.$uv.getPx(this.cursorSpacing)
			},
			// 按钮的样式
			buttonStyle() {
				return (type) => {
					const style = {
						// height: this.$uv.addUnit(this.buttonSize),
						color: this.color
					}
					if (this.isDisabled(type)) {
						style.backgroundColor = '#f7f8fa'
					}
					return style
				}
			},
			// 输入框的样式
			inputStyle() {
				const disabled = this.disabled || this.disabledInput
				const style = {
					color: this.color,
					// backgroundColor: this.bgColor,
					// height: this.$uv.addUnit(this.buttonSize),
					// width: this.$uv.addUnit(this.inputWidth)
				}
				return style
			},
			// 用于监听多个值发生变化
			watchChange() {
				return [this.integer, this.decimalLength, this.min, this.max]
			},
			isDisabled() {
				return (type) => {
					const value = this.filter(this.currentValue);
					const newVal = value === '' ? 0 : +value;
					if (type === 'plus') {
						// 在点击增加按钮情况下，判断整体的disabled，是否单独禁用增加按钮，以及当前值是否大于最大的允许值					   
						return (
							this.disabled ||
							this.disablePlus ||
							newVal >= this.max
						)
					}
					// 点击减少按钮同理
					return (
						this.disabled ||
						this.disableMinus ||
						newVal <= this.min
					)
				}
			},
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				const value = this.value || this.modelValue;
				// this.currentValue = this.format(value)
				let val = this.format(value)
				this.currentValue = this.formatter(val);
				this.emitChange(val)
			},
			// 格式化整理数据，限制范围
			format(value) {
				value = this.filter(value)
				// 如果为空字符串，那么设置为0，同时将值转为Number类型
				value = value === '' ? 0 : +value
				// 对比最大最小值，取在min和max之间的值
				console.log('max',this.max,'min',this.min,'value',value);
				if(!!value && Big(value || 0).gt(this.max || 0)) {
					let maxMsg = `最大值为${this.max}`;
					if(this.maxLimitMsg && typeof this.maxLimitMsg === 'function') {
						maxMsg = this.maxLimitMsg(this.max);
					}
					uni.showToast({
						title: maxMsg,
						icon: 'none'
					})
				}
				if(!!value && Big(value || 0).lt(this.min || 0)) {
					let minMsg = `最小值为${this.min}`;
					if(this.minLimitMsg && typeof this.minLimitMsg === 'function') {
						minMsg = this.minLimitMsg(this.min);
					}
					uni.showToast({
						title: minMsg,
						icon: 'none'
					})
				}
				value = Math.max(Math.min(this.max, value), this.min)
				// 如果设定了最大的小数位数，使用toFixed去进行格式化
				if (this.decimalLength !== null) {
					value = value.toFixed(this.decimalLength)
				}
				return value
			},
			formatter(value) {
				return value;
				// return `${value} ${this.unit}`
			},
			// 过滤非法的字符
			filter(value) {
				// 只允许0-9之间的数字，"."为小数点，"-"为负数时候使用
				value = String(value).replace(/[^0-9.-]/g, '')
				// 如果只允许输入整数，则过滤掉小数点后的部分
				if (this.integer && value.indexOf('.') !== -1) {
					value = value.split('.')[0]
				}
				return value;
			},
			check() {
				// 格式化了之后，如果前后的值不相等，那么设置为格式化后的值
				const val = this.format(this.currentValue);
				if (val !== this.currentValue) {
					this.currentValue = val
				}
			},
			// 输入框活动焦点
			onFocus(event) {
				this.$emit('focus', {
					...event.detail,
					name: this.name,
				})
			},
			// 输入框失去焦点
			onBlur(event) {
				// 对输入值进行格式化
				let value = this.format(event.detail.value)
				// value = this.formatter(value);
				if (!this.asyncChange) {
					console.log('onBlur',value)
					this.$nextTick(() => {
						this.$emit('input', value);
						this.$emit('update:modelValue', value);
						this.currentValue = this.formatter(value);
						this.$forceUpdate();
					})
				}
				// 发出blur事件
				this.$emit(
					'blur', {
						...event.detail,
						name: this.name,
					}
				)
			},
			// 输入框值发生变化
			onInput(e) {
				const {
					value = ''
				} = e.detail || {}
				// 为空返回
				// if (value === '') return;
				let formatted = this.filter(value)
				// 最大允许的小数长度
				// if (this.decimalLength !== null && formatted.indexOf('.') !== -1) {
				// 	const pair = formatted.split('.');
				// 	formatted = `${pair[0]}.${pair[1].slice(0, this.decimalLength)}`
				// }
				// formatted = this.format(formatted)
				// this.emitChange(formatted);
			},
			// 发出change事件
			emitChange(value) {
				// 如果开启了异步变更值，则不修改内部的值，需要用户手动在外部通过v-model变更
				if (!this.asyncChange) {
					this.$nextTick(() => {
						this.$emit('input', value)
						this.$emit('update:modelValue', value)
						// this.currentValue = value;
						this.currentValue = this.formatter(value)
						this.$forceUpdate()
					})
				}
				this.$emit('change', {
					value,
					name: this.name,
				});
			},
			onChange() {
				const {
					type
				} = this
				if (this.isDisabled(type)) {
					return this.$emit('overlimit', type)
				}
				const diff = type === 'minus' ? -this.step : +this.step;
				const inputValue = this.filter(this.currentValue)
				let value = this.format(this.add(+inputValue, diff))
				// value = this.formatter(value);
				this.emitChange(value)
				this.$emit(type)
			},
			// 对值扩大后进行四舍五入，再除以扩大因子，避免出现浮点数操作的精度问题
			add(num1, num2) {
				const cardinal = Math.pow(10, 10);
				return Math.round((num1 + num2) * cardinal) / cardinal
			},
			// 点击加减按钮
			clickHandler(type) {
				this.type = type
				this.onChange()
			},
			longPressStep() {
				// 每隔一段时间，重新调用longPressStep方法，实现长按加减
				this.clearTimeout()
				this.longPressTimer = setTimeout(() => {
					this.onChange()
					this.longPressStep()
				}, 250);
			},
			onTouchStart(type) {
				if (!this.longPress) return
				this.clearTimeout()
				this.type = type
				// 一定时间后，默认达到长按状态
				this.longPressTimer = setTimeout(() => {
					this.onChange()
					this.longPressStep()
				}, 600)
			},
			// 触摸结束，清除定时器，停止长按加减
			onTouchEnd() {
				if (!this.longPress) return
				this.clearTimeout()
			},
			// 清除定时器
			clearTimeout() {
				clearTimeout(this.longPressTimer)
				this.longPressTimer = null
			},
			clickUnit() {
				console.log(this.$refs['inputRef'])
				// this.$refs.input.focus()
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/uni_modules/uv-ui-tools/libs/css/components.scss';
	@import '@/uni_modules/uv-ui-tools/libs/css/color.scss';
	$uv-numberBox-hover-bgColor: #E6E6E6 !default;
	$uv-numberBox-disabled-color: #c8c9cc !default;
	$uv-numberBox-disabled-bgColor: #f7f8fa !default;
	$uv-numberBox-plus-radius: 4px !default;
	$uv-numberBox-minus-radius: 4px !default;
	$uv-numberBox-input-text-align: center !default;
	$uv-numberBox-input-font-size: 15px !default;
	$uv-numberBox-input-padding: 0 !default;
	$uv-numberBox-input-margin: 0 2px !default;
	$uv-numberBox-input-disabled-color: #c8c9cc !default;
	$uv-numberBox-input-disabled-bgColor: #f2f3f5 !default;
	.uv-number-box {
		@include flex(row);
		align-items: center;
		&__slot {
			/* #ifndef APP-NVUE */
			touch-action: none;
			/* #endif */
		}
		&__plus,
		&__minus {
			width: 112rpx;
			height: 88rpx;
			@include flex;
			justify-content: center;
			align-items: center;
			background-color: var(--page-bg);
			font-weight: bold;
			/* #ifndef APP-NVUE */
			touch-action: none;
			/* #endif */
			&--hover {
				background-color: $uv-numberBox-hover-bgColor !important;
			}
			&--disabled {
				color: $uv-numberBox-disabled-color;
				background-color: $uv-numberBox-disabled-bgColor;
			}
		}
		&__plus {
			border-top-right-radius: 40rpx;
			border-bottom-right-radius: 40rpx;
		}
		&__minus {
			border-top-left-radius: 40rpx;
			border-bottom-left-radius: 40rpx;
		}
		
		.input-wrapper {
			display: flex;
			flex-direction: row;
			align-items: center;
			flex:none;
			width: 304rpx;
			padding: 0 20rpx;
			height: 88rpx;
			border: 2rpx solid var(--page-bg);
			.unit {
				flex:none;
				font-weight: bold;
				font-size: 28rpx;
				color: var(--title-color);
			}
		}
		&__input {
			flex:1;
			position: relative;
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
			// padding: $uv-numberBox-input-padding;
			// margin: $uv-numberBox-input-margin;
			@include flex;
			align-items: center;
			justify-content: center;
			&--disabled {
				color: $uv-numberBox-input-disabled-color;
				background-color: $uv-numberBox-input-disabled-bgColor;
			}
		}
	}
</style>
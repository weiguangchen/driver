<template>
  <view
    v-if="showPopup"
    class="uv-popup"
    :class="[popupClass, isDesktop ? 'fixforpc-z-index' : '']"
    :style="[{ zIndex: zIndex }]"
  >
    <view @touchstart="touchstart">
      <!-- 遮罩层 -->
      <uv-overlay
        key="1"
        v-if="maskShow && overlay"
        :show="showTrans"
        :duration="duration"
        :custom-style="overlayStyle"
        :opacity="overlayOpacity"
        :zIndex="zIndex"
        @click="onTap"
      ></uv-overlay>
      <uv-transition
        key="2"
        :mode="ani"
        name="content"
        :custom-style="transitionStyle"
        :duration="duration"
        :show="showTrans"
        @click="onTap"
      >
        <view
          class="uv-popup__content"
          :style="[contentStyle]"
          :class="[popupClass]"
          @click="clear"
        >
          <uv-status-bar v-if="safeAreaInsetTop"></uv-status-bar>
          <uv-image
            src="/static/images/login/banner.png"
            width="100%"
            height="auto"
            mode="widthFix"
            :duration="0"
          />
          <view class="footer-wrapper">
            <view class="button-wrapper">
              <uv-button
                text="手机号快速登录"
                color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"
                @click="confirm"
                :loading="loading"
                :custom-style="{
                  borderRadius: '16rpx',
                  height: '96rpx',
                  fontWeight: 'bold',
                  fontSize: '30rpx',
                  marginBottom: '24rpx',
                }"
                open-type="getPhoneNumber"
                @getphonenumber="getPhoneNumber"
                :disabled="disabled"
              />
              <view class="mask" v-if="disabled" @click="maskClick" />
            </view>
            <view class="agreement-box">
              <uv-checkbox-group
                activeColor="var(--main-color)"
                shape="circle"
                v-model="checkboxValue"
                :customStyle="{ flex: 'none' }"
                size="16px"
                icon-size="12px"
                @change="changeCheckbox"
              >
                <uv-checkbox
                  :customStyle="{
                    fontSize: '28rpx',
                    color: 'var(--content-color)',
                  }"
                  >请详细阅读并同意</uv-checkbox
                >
              </uv-checkbox-group>
              <view class="agreement" @click="toAgreement('driverxy')"
                >《用户服务协议》</view
              >
              <text style="color: var(--content-color); font-size: 14px"
                >和</text
              >
              <view class="agreement" @click="toAgreement('driverzc')"
                >《隐私协议》</view
              >
            </view>
          </view>
          <uv-safe-bottom v-if="safeAreaInsetBottom"></uv-safe-bottom>
          <view
            v-if="closeable"
            @tap.stop="close"
            class="uv-popup__content__close"
            :class="['uv-popup__content__close--' + closeIconPos]"
            hover-class="uv-popup__content__close--hover"
            hover-stay-time="150"
          >
            <uv-image
              src="/static/images/login/close.png"
              width="64rpx"
              height="64rpx"
              :duration="0"
            />
          </view>
        </view>
      </uv-transition>
    </view>
    <!-- #ifdef H5 -->
    <keypress v-if="maskShow" @esc="onTap" />
    <!-- #endif -->
  </view>
</template>

<script>
import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
import {
	mapStores
} from 'pinia'
import {
	useUserStore
} from '@/stores/user.js'
import {
	getPhoneByCode
} from '@/api/index.js'
/**
 * PopUp 弹出层
 * @description 弹出层组件，为了解决遮罩弹层的问题
 * @tutorial https://www.uvui.cn/components/popup.html
 * @property {String} mode = [top|center|bottom|left|right] 弹出方式
 * 	@value top 顶部弹出
 * 	@value center 中间弹出
 * 	@value bottom 底部弹出
 * 	@value left		左侧弹出
 * 	@value right  右侧弹出
 * @property {Number} duration 动画时长，默认300
 * @property {Boolean} overlay 是否显示遮罩，默认true
 * @property {Boolean} overlayOpacity 遮罩透明度，默认0.5
 * @property {Object} overlayStyle 遮罩自定义样式
 * @property {Boolean} closeOnClickOverlay = [true|false] 蒙版点击是否关闭弹窗，默认true
 * @property {Number | String} zIndex 弹出层的层级
 * @property {Boolean} safeAreaInsetTop 是否留出顶部安全区（状态栏高度），默认false
 * @property {Boolean} safeAreaInsetBottom 是否为留出底部安全区适配，默认true
 * @property {Boolean} closeable 是否显示关闭图标，默认false
 * @property {Boolean} closeIconPos 自定义关闭图标位置，`top-left`-左上角，`top-right`-右上角，`bottom-left`-左下角，`bottom-right`-右下角，默认top-right
 * @property {String}  bgColor 主窗口背景色
 * @property {String}  maskBackgroundColor 蒙版颜色
 * @property {Boolean} customStyle 自定义样式
 * @event {Function} change 打开关闭弹窗触发，e={show: false}
 * @event {Function} maskClick 点击遮罩触发
 */
export default {
	name: 'uv-popup',
	mixins: [mpMixin, mixin],
	emits: ['change', 'maskClick'],
	props: {
		// 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
		// message: 消息提示 ; dialog : 对话框
		mode: {
			type: String,
			default: 'bottom'
		},
		// 动画时长，单位ms
		duration: {
			type: [String, Number],
			default: 300
		},
		// 层级
		zIndex: {
			type: [String, Number],
			// #ifdef H5
			default: 997
			// #endif
			// #ifndef H5
			default: 10075
			// #endif
		},
		bgColor: {
			type: String,
			default: '#ffffff'
		},
		safeArea: {
			type: Boolean,
			default: true
		},
		// 是否显示遮罩
		overlay: {
			type: Boolean,
			default: true
		},
		// 点击遮罩是否关闭弹窗
		closeOnClickOverlay: {
			type: Boolean,
			default: true
		},
		// 遮罩的透明度，0-1之间
		overlayOpacity: {
			type: [Number, String],
			default: 0.4
		},
		// 自定义遮罩的样式
		overlayStyle: {
			type: [Object, String],
			default: ''
		},
		// 是否为iPhoneX留出底部安全距离
		safeAreaInsetBottom: {
			type: Boolean,
			default: true
		},
		// 是否留出顶部安全距离（状态栏高度）
		safeAreaInsetTop: {
			type: Boolean,
			default: false
		},
		// 是否显示关闭图标
		closeable: {
			type: Boolean,
			default: true
		},
		// 自定义关闭图标位置，top-left为左上角，top-right为右上角，bottom-left为左下角，bottom-right为右下角
		closeIconPos: {
			type: String,
			default: 'top-right'
		},
		// mode=center，也即中部弹出时，是否使用缩放模式
		zoom: {
			type: Boolean,
			default: true
		},
		round: {
			type: [Number, String],
			default: '24rpx'
		},
		customStyle: {
			default: 'minHeight: 400rpx'
		},
		height: {
			default: '292px'
		},
		...uni.$uv?.props?.popup
	},
	watch: {
		/**
		 * 监听type类型
		 */
		type: {
			handler: function(type) {
				if (!this.config[type]) return
				this[this.config[type]](true)
			},
			immediate: true
		},
		isDesktop: {
			handler: function(newVal) {
				if (!this.config[newVal]) return
				this[this.config[this.mode]](true)
			},
			immediate: true
		},
		// H5 下禁止底部滚动
		showPopup(show) {
			// #ifdef H5
			// fix by mehaotian 处理 h5 滚动穿透的问题
			document.getElementsByTagName('body')[0].style.overflow = show ? 'hidden' : 'visible'
			// #endif
		}
	},
	data() {
		return {
			ani: [],
			showPopup: false,
			showTrans: false,
			popupWidth: 0,
			popupHeight: 0,
			config: {
				top: 'top',
				bottom: 'bottom',
				center: 'center',
				left: 'left',
				right: 'right',
				message: 'top',
				dialog: 'center',
				share: 'bottom'
			},
			transitionStyle: {
				position: 'fixed',
				left: 0,
				right: 0
			},
			maskShow: true,
			mkclick: true,
			popupClass: this.isDesktop ? 'fixforpc-top' : 'top',
			direction: '',
			// 隐私
			disabled: true,
			checkboxValue: [],
			loading: false
		}
	},
	computed: {
		...mapStores(useUserStore),
		isDesktop() {
			return this.popupWidth >= 500 && this.popupHeight >= 500
		},
		bg() {
			if (this.bgColor === '' || this.bgColor === 'none' || this.$uv.getPx(this.round) > 0) {
				return 'transparent'
			}
			return this.bgColor
		},
		contentStyle() {
			const style = {};
			if (this.bgColor) {
				style.backgroundColor = this.bg
			}
			if (this.round) {
				const value = this.$uv.addUnit(this.round)
				const mode = this.direction ? this.direction : this.mode
				style.backgroundColor = this.bgColor
				if (mode === 'top') {
					style.borderBottomLeftRadius = value
					style.borderBottomRightRadius = value
				} else if (mode === 'bottom') {
					style.borderTopLeftRadius = value
					style.borderTopRightRadius = value
				} else if (mode === 'center') {
					style.borderRadius = value
				}
			}
			return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle))
		}
	},
	// #ifndef VUE3
	// TODO vue2
	destroyed() {
		this.setH5Visible()
	},
	// #endif
	// #ifdef VUE3
	// TODO vue3
	unmounted() {
		this.setH5Visible()
	},
	// #endif
	created() {
		// TODO 处理 message 组件生命周期异常的问题
		this.messageChild = null
		// TODO 解决头条冒泡的问题
		this.clearPropagation = false
	},
	methods: {
		toAgreement(type) {
			uni.navigateTo({
				url: `/pages/agreement/agreement?type=${type}`
			})
		},
		setH5Visible() {
			// #ifdef H5
			// fix by mehaotian 处理 h5 滚动穿透的问题
			document.getElementsByTagName('body')[0].style.overflow = 'visible'
			// #endif
		},
		/**
		 * 公用方法，不显示遮罩层
		 */
		closeMask() {
			this.maskShow = false
		},
		// TODO nvue 取消冒泡
		clear(e) {
			// #ifndef APP-NVUE
			e.stopPropagation()
			// #endif
			this.clearPropagation = true
		},

		open(direction) {
			this.disabled = true;
			this.checkboxValue = [];
			// fix by mehaotian 处理快速打开关闭的情况
			if (this.showPopup) {
				return
			}
			let innerType = ['top', 'center', 'bottom', 'left', 'right', 'message', 'dialog', 'share']
			if (!(direction && innerType.indexOf(direction) !== -1)) {
				direction = this.mode
			} else {
				this.direction = direction;
			}
			if (!this.config[direction]) {
				return this.$uv.error(`缺少类型：${direction}`);
			}
			this[this.config[direction]]()
			this.$emit('change', {
				show: true,
				type: direction
			})
		},
		close(type) {
			this.showTrans = false
			this.$emit('change', {
				show: false,
				type: this.mode
			})
			clearTimeout(this.timer)
			// // 自定义关闭事件
			this.timer = setTimeout(() => {
				this.showPopup = false
			}, 300)
		},
		// TODO 处理冒泡事件，头条的冒泡事件有问题 ，先这样兼容
		touchstart() {
			this.clearPropagation = false
		},
		onTap() {
			if (this.clearPropagation) {
				// fix by mehaotian 兼容 nvue
				this.clearPropagation = false
				return
			}
			this.$emit('maskClick')
			if (!this.closeOnClickOverlay) return
			this.close()
		},
		/**
		 * 顶部弹出样式处理
		 */
		top(type) {
			this.popupClass = this.isDesktop ? 'fixforpc-top' : 'top'
			this.ani = ['slide-top']
			this.transitionStyle = {
				position: 'fixed',
				zIndex: this.zIndex,
				left: 0,
				right: 0,
				backgroundColor: this.bg
			}
			// TODO 兼容 type 属性 ，后续会废弃
			if (type) return
			this.showPopup = true
			this.showTrans = true
			this.$nextTick(() => {
				if (this.messageChild && this.mode === 'message') {
					this.messageChild.timerClose()
				}
			})
		},
		/**
		 * 底部弹出样式处理
		 */
		bottom(type) {
			this.popupClass = 'bottom'
			this.ani = ['slide-bottom']
			this.transitionStyle = {
				position: 'fixed',
				zIndex: this.zIndex,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: this.bg
			}
			// TODO 兼容 type 属性 ，后续会废弃
			if (type) return
			this.showPopup = true
			this.showTrans = true
		},
		/**
		 * 中间弹出样式处理
		 */
		center(type) {
			this.popupClass = 'center'
			this.ani = this.zoom ? ['zoom-in', 'fade'] : ['fade'];
			this.transitionStyle = {
				position: 'fixed',
				zIndex: this.zIndex,
				/* #ifndef APP-NVUE */
				display: 'flex',
				flexDirection: 'column',
				/* #endif */
				bottom: 0,
				left: 0,
				right: 0,
				top: 0,
				justifyContent: 'center',
				alignItems: 'center'
			}
			// TODO 兼容 type 属性 ，后续会废弃
			if (type) return
			this.showPopup = true
			this.showTrans = true
		},
		left(type) {
			this.popupClass = 'left'
			this.ani = ['slide-left']
			this.transitionStyle = {
				position: 'fixed',
				zIndex: this.zIndex,
				left: 0,
				bottom: 0,
				top: 0,
				backgroundColor: this.bg,
				/* #ifndef APP-NVUE */
				display: 'flex',
				flexDirection: 'column'
				/* #endif */
			}
			// TODO 兼容 type 属性 ，后续会废弃
			if (type) return
			this.showPopup = true
			this.showTrans = true
		},
		right(type) {
			this.popupClass = 'right'
			this.ani = ['slide-right']
			this.transitionStyle = {
				position: 'fixed',
				zIndex: this.zIndex,
				bottom: 0,
				right: 0,
				top: 0,
				backgroundColor: this.bg,
				/* #ifndef APP-NVUE */
				display: 'flex',
				flexDirection: 'column'
				/* #endif */
			}
			// TODO 兼容 type 属性 ，后续会废弃
			if (type) return
			this.showPopup = true
			this.showTrans = true
		},
		async getPhoneNumber(e) {
			const code = e.code;
			if (!code) return;
			this.loading = true;
			try {
				const login = await wx.login();
				const mobile = await getPhoneByCode({
					pcode: code,
					loginCode: login.code
				})
				this.$emit('success', mobile)
				this.close()
			} catch (err) {
				uni.showToast({
					icon: 'none',
					title: '登录失败',
				})
				console.log('err', err)
			} finally {
				this.loading = false;
			}
		},
		changeCheckbox(value) {
			this.disabled = value.length === 0;
		},
		maskClick() {
			uni.showToast({
				title: '请勾选隐私协议',
				icon: 'none'
			})
		}
	},
}
</script>
<style lang="scss" scoped>
.uv-popup {
  position: fixed;
  /* #ifndef APP-NVUE */
  z-index: 99;

  /* #endif */
  &.top,
  &.left,
  &.right {
    /* #ifdef H5 */
    top: var(--window-top);
    /* #endif */
    /* #ifndef H5 */
    top: 0;
    /* #endif */
  }

  .uv-popup__content {
    /* #ifndef APP-NVUE */
    display: block;
    overflow: hidden;
    /* #endif */
    position: relative;

    &.left,
    &.right {
      /* #ifdef H5 */
      padding-top: var(--window-top);
      /* #endif */
      /* #ifndef H5 */
      padding-top: 0;
      /* #endif */
      flex: 1;
    }

    &__close {
      position: absolute;

      &--hover {
        opacity: 0.4;
      }
    }

    &__close--top-left {
      top: 15px;
      left: 15px;
    }

    &__close--top-right {
      top: 15px;
      right: 15px;
    }

    &__close--bottom-left {
      bottom: 15px;
      left: 15px;
    }

    &__close--bottom-right {
      right: 15px;
      bottom: 15px;
    }
  }
}

.fixforpc-z-index {
  /* #ifndef APP-NVUE */
  z-index: 999;
  /* #endif */
}

.fixforpc-top {
  top: 0;
}

.button-wrapper {
  position: relative;

  .mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
  }
}

.footer-wrapper {
  padding: 32rpx 24rpx 92rpx;

  .agreement-box {
    display: flex;
    align-items: center;

    .agreement {
      color: var(--main-color);
      font-size: 28rpx;
    }
  }
}
</style>

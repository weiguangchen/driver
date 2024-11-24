"use strict";
var _a, _b;
const common_vendor = require("../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../uni_modules/uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../uni_modules/uv-ui-tools/libs/mixin/mixin.js");
const stores_user = require("../../stores/user.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  name: "uv-popup",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin],
  emits: ["change", "maskClick"],
  props: {
    // 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
    // message: 消息提示 ; dialog : 对话框
    mode: {
      type: String,
      default: "bottom"
    },
    // 动画时长，单位ms
    duration: {
      type: [String, Number],
      default: 300
    },
    // 层级
    zIndex: {
      type: [String, Number],
      default: 10075
    },
    bgColor: {
      type: String,
      default: "#ffffff"
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
      default: ""
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
      default: "top-right"
    },
    // mode=center，也即中部弹出时，是否使用缩放模式
    zoom: {
      type: Boolean,
      default: true
    },
    round: {
      type: [Number, String],
      default: "24rpx"
    },
    customStyle: {
      default: "minHeight: 400rpx"
    },
    height: {
      default: "292px"
    },
    ...(_b = (_a = common_vendor.index.$uv) == null ? void 0 : _a.props) == null ? void 0 : _b.popup
  },
  watch: {
    /**
     * 监听type类型
     */
    type: {
      handler: function(type) {
        if (!this.config[type])
          return;
        this[this.config[type]](true);
      },
      immediate: true
    },
    isDesktop: {
      handler: function(newVal) {
        if (!this.config[newVal])
          return;
        this[this.config[this.mode]](true);
      },
      immediate: true
    },
    // H5 下禁止底部滚动
    showPopup(show) {
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
        top: "top",
        bottom: "bottom",
        center: "center",
        left: "left",
        right: "right",
        message: "top",
        dialog: "center",
        share: "bottom"
      },
      transitionStyle: {
        position: "fixed",
        left: 0,
        right: 0
      },
      maskShow: true,
      mkclick: true,
      popupClass: this.isDesktop ? "fixforpc-top" : "top",
      direction: "",
      // 隐私
      disabled: true,
      checkboxValue: [],
      loading: false
    };
  },
  computed: {
    ...common_vendor.mapStores(stores_user.useUserStore),
    isDesktop() {
      return this.popupWidth >= 500 && this.popupHeight >= 500;
    },
    bg() {
      if (this.bgColor === "" || this.bgColor === "none" || this.$uv.getPx(this.round) > 0) {
        return "transparent";
      }
      return this.bgColor;
    },
    contentStyle() {
      const style = {};
      if (this.bgColor) {
        style.backgroundColor = this.bg;
      }
      if (this.round) {
        const value = this.$uv.addUnit(this.round);
        const mode = this.direction ? this.direction : this.mode;
        style.backgroundColor = this.bgColor;
        if (mode === "top") {
          style.borderBottomLeftRadius = value;
          style.borderBottomRightRadius = value;
        } else if (mode === "bottom") {
          style.borderTopLeftRadius = value;
          style.borderTopRightRadius = value;
        } else if (mode === "center") {
          style.borderRadius = value;
        }
      }
      return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle));
    }
  },
  // TODO vue3
  unmounted() {
    this.setH5Visible();
  },
  created() {
    this.messageChild = null;
    this.clearPropagation = false;
  },
  methods: {
    toAgreement(type) {
      common_vendor.index.navigateTo({
        url: `/pages/agreement/agreement?type=${type}`
      });
    },
    setH5Visible() {
    },
    /**
     * 公用方法，不显示遮罩层
     */
    closeMask() {
      this.maskShow = false;
    },
    // TODO nvue 取消冒泡
    clear(e) {
      e.stopPropagation();
      this.clearPropagation = true;
    },
    open(direction) {
      this.disabled = true;
      this.checkboxValue = [];
      if (this.showPopup) {
        return;
      }
      let innerType = ["top", "center", "bottom", "left", "right", "message", "dialog", "share"];
      if (!(direction && innerType.indexOf(direction) !== -1)) {
        direction = this.mode;
      } else {
        this.direction = direction;
      }
      if (!this.config[direction]) {
        return this.$uv.error(`缺少类型：${direction}`);
      }
      this[this.config[direction]]();
      this.$emit("change", {
        show: true,
        type: direction
      });
    },
    close(type) {
      this.showTrans = false;
      this.$emit("change", {
        show: false,
        type: this.mode
      });
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.showPopup = false;
      }, 300);
    },
    // TODO 处理冒泡事件，头条的冒泡事件有问题 ，先这样兼容
    touchstart() {
      this.clearPropagation = false;
    },
    onTap() {
      if (this.clearPropagation) {
        this.clearPropagation = false;
        return;
      }
      this.$emit("maskClick");
      if (!this.closeOnClickOverlay)
        return;
      this.close();
    },
    /**
     * 顶部弹出样式处理
     */
    top(type) {
      this.popupClass = this.isDesktop ? "fixforpc-top" : "top";
      this.ani = ["slide-top"];
      this.transitionStyle = {
        position: "fixed",
        zIndex: this.zIndex,
        left: 0,
        right: 0,
        backgroundColor: this.bg
      };
      if (type)
        return;
      this.showPopup = true;
      this.showTrans = true;
      this.$nextTick(() => {
        if (this.messageChild && this.mode === "message") {
          this.messageChild.timerClose();
        }
      });
    },
    /**
     * 底部弹出样式处理
     */
    bottom(type) {
      this.popupClass = "bottom";
      this.ani = ["slide-bottom"];
      this.transitionStyle = {
        position: "fixed",
        zIndex: this.zIndex,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: this.bg
      };
      if (type)
        return;
      this.showPopup = true;
      this.showTrans = true;
    },
    /**
     * 中间弹出样式处理
     */
    center(type) {
      this.popupClass = "center";
      this.ani = this.zoom ? ["zoom-in", "fade"] : ["fade"];
      this.transitionStyle = {
        position: "fixed",
        zIndex: this.zIndex,
        display: "flex",
        flexDirection: "column",
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        justifyContent: "center",
        alignItems: "center"
      };
      if (type)
        return;
      this.showPopup = true;
      this.showTrans = true;
    },
    left(type) {
      this.popupClass = "left";
      this.ani = ["slide-left"];
      this.transitionStyle = {
        position: "fixed",
        zIndex: this.zIndex,
        left: 0,
        bottom: 0,
        top: 0,
        backgroundColor: this.bg,
        display: "flex",
        flexDirection: "column"
      };
      if (type)
        return;
      this.showPopup = true;
      this.showTrans = true;
    },
    right(type) {
      this.popupClass = "right";
      this.ani = ["slide-right"];
      this.transitionStyle = {
        position: "fixed",
        zIndex: this.zIndex,
        bottom: 0,
        right: 0,
        top: 0,
        backgroundColor: this.bg,
        display: "flex",
        flexDirection: "column"
      };
      if (type)
        return;
      this.showPopup = true;
      this.showTrans = true;
    },
    async getPhoneNumber(e) {
      const code = e.code;
      if (!code)
        return;
      this.loading = true;
      try {
        const mobile = await api_index.getPhoneByCode({
          pcode: code
        });
        this.$emit("success", mobile);
        this.close();
      } catch (err) {
        common_vendor.index.showToast({
          icon: "none",
          title: "登录失败"
        });
        console.log("err", err);
      } finally {
        this.loading = false;
      }
    },
    changeCheckbox(value) {
      this.disabled = value.length === 0;
    },
    maskClick() {
      common_vendor.index.showToast({
        title: "请勾选隐私协议",
        icon: "none"
      });
    }
  }
};
if (!Array) {
  const _easycom_uv_overlay2 = common_vendor.resolveComponent("uv-overlay");
  const _easycom_uv_status_bar2 = common_vendor.resolveComponent("uv-status-bar");
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_uv_checkbox2 = common_vendor.resolveComponent("uv-checkbox");
  const _easycom_uv_checkbox_group2 = common_vendor.resolveComponent("uv-checkbox-group");
  const _easycom_uv_safe_bottom2 = common_vendor.resolveComponent("uv-safe-bottom");
  const _easycom_uv_transition2 = common_vendor.resolveComponent("uv-transition");
  (_easycom_uv_overlay2 + _easycom_uv_status_bar2 + _easycom_uv_image2 + _easycom_uv_button2 + _easycom_uv_checkbox2 + _easycom_uv_checkbox_group2 + _easycom_uv_safe_bottom2 + _easycom_uv_transition2)();
}
const _easycom_uv_overlay = () => "../../uni_modules/uv-overlay/components/uv-overlay/uv-overlay.js";
const _easycom_uv_status_bar = () => "../../uni_modules/uv-status-bar/components/uv-status-bar/uv-status-bar.js";
const _easycom_uv_image = () => "../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_uv_checkbox = () => "../../uni_modules/uv-checkbox/components/uv-checkbox/uv-checkbox.js";
const _easycom_uv_checkbox_group = () => "../../uni_modules/uv-checkbox/components/uv-checkbox-group/uv-checkbox-group.js";
const _easycom_uv_safe_bottom = () => "../../uni_modules/uv-safe-bottom/components/uv-safe-bottom/uv-safe-bottom.js";
const _easycom_uv_transition = () => "../../uni_modules/uv-transition/components/uv-transition/uv-transition.js";
if (!Math) {
  (_easycom_uv_overlay + _easycom_uv_status_bar + _easycom_uv_image + _easycom_uv_button + _easycom_uv_checkbox + _easycom_uv_checkbox_group + _easycom_uv_safe_bottom + _easycom_uv_transition)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.showPopup
  }, $data.showPopup ? common_vendor.e({
    b: $data.maskShow && $props.overlay
  }, $data.maskShow && $props.overlay ? {
    c: common_vendor.o($options.onTap),
    d: common_vendor.p({
      show: $data.showTrans,
      duration: $props.duration,
      ["custom-style"]: $props.overlayStyle,
      opacity: $props.overlayOpacity,
      zIndex: $props.zIndex
    })
  } : {}, {
    e: $props.safeAreaInsetTop
  }, $props.safeAreaInsetTop ? {} : {}, {
    f: common_vendor.p({
      src: "/static/images/login/banner.png",
      width: "100%",
      height: "auto",
      mode: "widthFix",
      duration: 0
    }),
    g: common_vendor.o(_ctx.confirm),
    h: common_vendor.o($options.getPhoneNumber),
    i: common_vendor.p({
      text: "手机号快速登录",
      color: "linear-gradient( 270deg, #31CE57 0%, #07B130 100%);",
      loading: $data.loading,
      ["custom-style"]: {
        borderRadius: "16rpx",
        height: "96rpx",
        fontWeight: "bold",
        fontSize: "30rpx",
        marginBottom: "24rpx"
      },
      ["open-type"]: "getPhoneNumber",
      disabled: $data.disabled
    }),
    j: $data.disabled
  }, $data.disabled ? {
    k: common_vendor.o((...args) => $options.maskClick && $options.maskClick(...args))
  } : {}, {
    l: common_vendor.p({
      customStyle: {
        fontSize: "28rpx",
        color: "var(--content-color)"
      }
    }),
    m: common_vendor.o($options.changeCheckbox),
    n: common_vendor.o(($event) => $data.checkboxValue = $event),
    o: common_vendor.p({
      activeColor: "var(--main-color)",
      shape: "circle",
      customStyle: {
        flex: "none"
      },
      size: "16px",
      ["icon-size"]: "12px",
      modelValue: $data.checkboxValue
    }),
    p: common_vendor.o(($event) => $options.toAgreement("driverxy")),
    q: common_vendor.o(($event) => $options.toAgreement("driverzc")),
    r: $props.safeAreaInsetBottom
  }, $props.safeAreaInsetBottom ? {} : {}, {
    s: $props.closeable
  }, $props.closeable ? {
    t: common_vendor.p({
      src: "/static/images/login/close.png",
      width: "64rpx",
      height: "64rpx",
      duration: 0
    }),
    v: common_vendor.o((...args) => $options.close && $options.close(...args)),
    w: common_vendor.n("uv-popup__content__close--" + $props.closeIconPos)
  } : {}, {
    x: common_vendor.s($options.contentStyle),
    y: common_vendor.n($data.popupClass),
    z: common_vendor.o((...args) => $options.clear && $options.clear(...args)),
    A: common_vendor.o($options.onTap),
    B: common_vendor.p({
      mode: $data.ani,
      name: "content",
      ["custom-style"]: $data.transitionStyle,
      duration: $props.duration,
      show: $data.showTrans
    }),
    C: common_vendor.o((...args) => $options.touchstart && $options.touchstart(...args)),
    D: common_vendor.n($data.popupClass),
    E: common_vendor.n($options.isDesktop ? "fixforpc-z-index" : ""),
    F: common_vendor.s({
      zIndex: $props.zIndex
    })
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fa973ad9"], ["__file", "/Users/wei/driver/components/my-login-drawer/login-drawer.vue"]]);
wx.createComponent(Component);

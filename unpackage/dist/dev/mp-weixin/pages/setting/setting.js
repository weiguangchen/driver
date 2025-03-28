"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const utils_token = require("../../utils/token.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uv_avatar2 = common_vendor.resolveComponent("uv-avatar");
  const _easycom_uv_icon2 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_my_confirm2 = common_vendor.resolveComponent("my-confirm");
  (_easycom_uv_avatar2 + _easycom_uv_icon2 + _easycom_uv_button2 + _easycom_my_confirm2)();
}
const _easycom_uv_avatar = () => "../../uni_modules/uv-avatar/components/uv-avatar/uv-avatar.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_my_confirm = () => "../../components/my-confirm/my-confirm.js";
if (!Math) {
  (_easycom_uv_avatar + _easycom_uv_icon + _easycom_uv_button + _easycom_my_confirm + NicknameModal)();
}
const NicknameModal = () => "../../components/my-login-drawer/nickname-modal.js";
const _sfc_main = {
  __name: "setting",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    const nicknameRef = common_vendor.ref();
    function handleNickname() {
      const name = utils_token.getToken().userInfo.Nickname || "";
      nicknameRef.value.open(name);
    }
    async function nicknameSuccess(nickName) {
      console.log("nicknameSuccess", nickName);
      try {
        await api_index.UptDriverNickName({
          nickName
        });
        nicknameRef.value.close();
        const tokenData = utils_token.getToken();
        await utils_token.setToken({
          ...tokenData,
          userInfo: {
            ...tokenData.userInfo,
            Nickname: nickName
          }
        });
        userStore.setUserInfo({
          ...tokenData.userInfo,
          Nickname: nickName
        });
        common_vendor.index.showToast({
          title: "修改成功",
          icon: "none"
        });
      } catch (error) {
        console.log("error", error);
        nicknameRef.value.closeLoading();
      }
    }
    function toAgreement(type) {
      common_vendor.index.navigateTo({
        url: `/pages/agreement/agreement?type=${type}`
      });
    }
    const confirm = common_vendor.ref(null);
    function logout() {
      confirm.value.confirm({
        title: "确定退出登录？",
        cancelText: "再想想",
        confirmText: "退出",
        async confirm() {
          userStore.logout();
          common_vendor.index.reLaunch({
            url: "/pages/index/index"
          });
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          src: "/static/images/mine/avatar.png",
          size: 32
        }),
        b: common_vendor.t(common_vendor.unref(userInfo).Nickname),
        c: common_vendor.p({
          name: "arrow-right",
          color: "#A0AFBA",
          size: "24rpx",
          ["custom-style"]: {
            marginLeft: "16rpx"
          }
        }),
        d: common_vendor.o(handleNickname),
        e: common_vendor.t(common_vendor.unref(userInfo).Mobile),
        f: common_vendor.p({
          name: "arrow-right",
          color: "#A0AFBA",
          size: "24rpx"
        }),
        g: common_vendor.o(($event) => toAgreement("driverzc")),
        h: common_vendor.p({
          name: "arrow-right",
          color: "#A0AFBA",
          size: "24rpx"
        }),
        i: common_vendor.o(($event) => toAgreement("driverxy")),
        j: common_vendor.o(logout),
        k: common_vendor.p({
          text: "退出登录",
          color: "#FFFFFF",
          ["custom-style"]: {
            height: "96rpx",
            borderRadius: "16rpx"
          },
          customTextStyle: {
            color: "var(--red-color)"
          }
        }),
        l: common_vendor.sr(confirm, "322f096b-5", {
          "k": "confirm"
        }),
        m: common_vendor.sr(nicknameRef, "322f096b-6", {
          "k": "nicknameRef"
        }),
        n: common_vendor.o(nicknameSuccess),
        o: common_vendor.p({
          closeOnClickOverlay: true,
          showCancelButton: true
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/setting/setting.vue"]]);
wx.createPage(MiniProgramPage);

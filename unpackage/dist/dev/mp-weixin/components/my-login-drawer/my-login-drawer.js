"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const api_index = require("../../api/index.js");
const utils_token = require("../../utils/token.js");
if (!Math) {
  (LoginDrawer + NicknameModal)();
}
const LoginDrawer = () => "./login-drawer.js";
const NicknameModal = () => "./nickname-modal.js";
const _sfc_main = {
  __name: "my-login-drawer",
  emits: ["success"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const userStore = stores_user.useUserStore();
    const emits = __emit;
    const loginRef = common_vendor.ref();
    const nicknameRef = common_vendor.ref();
    async function loginSuccess(mobile) {
      console.log("loginSuccess", mobile);
      const userInfo = await userStore.login({
        mobile
      });
      console.log("登陆成功");
      if (!userInfo.Nickname) {
        nicknameRef.value.open();
      } else {
        emits("success");
      }
    }
    async function nicknameSuccess(nickName) {
      console.log("nicknameSuccess", nickName);
      try {
        await api_index.UptDriverNickName({
          nickName
        });
        nicknameRef.value.close();
        const tokenData = utils_token.getToken();
        utils_token.setToken({
          ...tokenData,
          userInfo: {
            ...tokenData.userInfo,
            Nickname: nickName
          }
        });
        emits("success");
      } catch {
        nicknameRef.value.closeLoading();
      }
    }
    function open() {
      loginRef.value.open();
    }
    __expose({
      open
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.sr(loginRef, "c0405062-0", {
          "k": "loginRef"
        }),
        b: common_vendor.o(loginSuccess),
        c: common_vendor.sr(nicknameRef, "c0405062-1", {
          "k": "nicknameRef"
        }),
        d: common_vendor.o(nicknameSuccess)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/components/my-login-drawer/my-login-drawer.vue"]]);
wx.createComponent(Component);

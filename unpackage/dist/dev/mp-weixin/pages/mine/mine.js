"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_app = require("../../stores/app.js");
const utils_token = require("../../utils/token.js");
const stores_user = require("../../stores/user.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uv_navbar2 = common_vendor.resolveComponent("uv-navbar");
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_my_login_drawer2 = common_vendor.resolveComponent("my-login-drawer");
  const _easycom_my_tabbar2 = common_vendor.resolveComponent("my-tabbar");
  (_easycom_uv_navbar2 + _easycom_uv_image2 + _easycom_my_login_drawer2 + _easycom_my_tabbar2)();
}
const _easycom_uv_navbar = () => "../../uni_modules/uv-navbar/components/uv-navbar/uv-navbar.js";
const _easycom_uv_image = () => "../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_my_login_drawer = () => "../../components/my-login-drawer/my-login-drawer.js";
const _easycom_my_tabbar = () => "../../components/my-tabbar/my-tabbar.js";
if (!Math) {
  (_easycom_uv_navbar + _easycom_uv_image + _easycom_my_login_drawer + QrcodeModal + _easycom_my_tabbar)();
}
const QrcodeModal = () => "./components/qrcodeModal.js";
const _sfc_main = {
  __name: "mine",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const { userInfo, defaultCar } = common_vendor.storeToRefs(userStore);
    const appStore = stores_app.useAppStore();
    common_vendor.onLoad(() => {
      appStore.switchTab(2);
    });
    function navigate(type) {
      if (!utils_token.getToken()) {
        openLoginDrawer();
        return;
      }
      switch (type) {
        case "扫码":
          handleScan();
          break;
        case "二维码":
          openQrcode();
          break;
        case "车辆管理":
          common_vendor.index.navigateTo({
            url: "/pages/carList/carList"
          });
          break;
        case "数据统计":
          common_vendor.index.showToast({
            title: "敬请期待",
            icon: "none"
          });
          return;
        case "卸货地址":
          common_vendor.index.navigateTo({
            url: "/pages/addressList/addressList"
          });
          break;
        case "我的订单":
          common_vendor.index.navigateTo({
            url: "/pages/orderList/orderList"
          });
          break;
        case "我的货单":
          common_vendor.index.navigateTo({
            url: "/pages/manifestList/manifestList"
          });
          break;
        case "问题反馈":
          break;
        case "设置":
          common_vendor.index.navigateTo({
            url: "/pages/setting/setting"
          });
          break;
      }
    }
    async function handleScan() {
      if (!defaultCar.value) {
        common_vendor.index.showToast({
          title: "请先添加车辆",
          icon: "none"
        });
        return;
      }
      let params = {};
      try {
        const res = await common_vendor.index.scanCode();
        console.log(res);
        params = JSON.parse(res.result);
        console.log(params);
        const { htQRType } = params;
        if (!htQRType) {
          common_vendor.index.showToast({
            title: "无效二维码",
            icon: "none"
          });
          return;
        }
      } catch (err) {
        console.log("无效二维码", err);
        common_vendor.index.showToast({
          title: "无效二维码",
          icon: "none"
        });
        return;
      }
      try {
        common_vendor.index.showLoading({
          mask: true
        });
        const param = {
          scanParam: JSON.stringify({
            ...params
          })
        };
        console.log(param);
        await api_index.ScanQR(param);
        console.log("允许扫码");
        common_vendor.index.hideLoading();
        const { assignId } = params;
        common_vendor.index.navigateTo({
          url: `/pages/billDetail/billDetail?assignId=${assignId}`
        });
      } catch (err) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: err.data,
          icon: "none"
        });
      }
    }
    const qrcode = common_vendor.ref();
    function openQrcode() {
      qrcode.value.open();
    }
    function follow() {
      const src = "https://mp.weixin.qq.com/s?__biz=MzkxOTcyODM5OA==&mid=2247483675&idx=1&sn=3f1378b5f85fe5ed6144eb9446f63a32&chksm=c19cf97af6eb706cee30883335ba2e11ab4ebd79c23dac68af13106c2b56e20eee02ddfe656c#rd";
      common_vendor.index.openOfficialAccountArticle({
        url: src
      });
    }
    function toGuide() {
      const src = "https://mp.weixin.qq.com/s/6Hqb9mbfT_Te9Tu4cD26DQ";
      common_vendor.index.openOfficialAccountArticle({
        url: src
      });
    }
    const loginDrawer = common_vendor.ref();
    function openLoginDrawer() {
      loginDrawer.value.open();
    }
    function loginSuccess() {
      common_vendor.index.reLaunch({
        url: "/pages/mine/mine"
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          ["left-icon"]: "",
          placeholder: true,
          ["bg-color"]: "transparent"
        }),
        b: common_vendor.p({
          src: common_vendor.unref(utils_token.getToken)() ? "/static/images/mine/avatar.png" : "/static/images/mine/no-avatar.png",
          width: "100%",
          height: "100%",
          duration: 0
        }),
        c: common_vendor.unref(utils_token.getToken)()
      }, common_vendor.unref(utils_token.getToken)() ? {
        d: common_vendor.t(common_vendor.unref(userInfo).Nickname || "暂无昵称"),
        e: common_vendor.t(common_vendor.unref(userInfo).Mobile || "")
      } : {
        f: common_vendor.p({
          src: "/static/images/arrow3.png",
          duration: 0,
          width: "32rpx",
          height: "32rpx",
          ["custom-style"]: {
            flex: "none"
          }
        }),
        g: common_vendor.o(openLoginDrawer)
      }, {
        h: common_vendor.p({
          src: "/static/images/mine/scan.png",
          width: "56rpx",
          height: "56rpx",
          duration: 0
        }),
        i: common_vendor.o(($event) => navigate("扫码")),
        j: common_vendor.p({
          src: "/static/images/mine/qrcode.png",
          width: "56rpx",
          height: "56rpx",
          duration: 0
        }),
        k: common_vendor.o(($event) => navigate("二维码")),
        l: common_vendor.o(($event) => navigate("车辆管理")),
        m: common_vendor.o(($event) => navigate("数据统计")),
        n: common_vendor.p({
          width: "100%",
          height: "100%",
          duration: 0,
          src: "/static/images/mine/banner.png"
        }),
        o: common_vendor.o(follow),
        p: common_vendor.p({
          src: "/static/images/mine/wechat.png",
          width: "56rpx",
          height: "56rpx",
          ["custom-style"]: {
            marginBottom: "4rpx"
          },
          duration: 0
        }),
        q: common_vendor.o(follow),
        r: common_vendor.p({
          src: "/static/images/mine/service.png",
          width: "56rpx",
          height: "56rpx",
          ["custom-style"]: {
            marginBottom: "4rpx"
          },
          duration: 0
        }),
        s: common_vendor.p({
          src: "/static/images/mine/guide.png",
          width: "56rpx",
          height: "56rpx",
          ["custom-style"]: {
            marginBottom: "4rpx"
          },
          duration: 0
        }),
        t: common_vendor.o(toGuide),
        v: common_vendor.p({
          src: "/static/images/mine/feedback.png",
          width: "56rpx",
          height: "56rpx",
          ["custom-style"]: {
            marginBottom: "4rpx"
          },
          duration: 0
        }),
        w: common_vendor.p({
          src: "/static/images/mine/setting.png",
          width: "56rpx",
          height: "56rpx",
          ["custom-style"]: {
            marginBottom: "4rpx"
          },
          duration: 0
        }),
        x: common_vendor.o(($event) => navigate("设置")),
        y: common_vendor.sr(loginDrawer, "ba8f522e-11", {
          "k": "loginDrawer"
        }),
        z: common_vendor.o(loginSuccess),
        A: common_vendor.sr(qrcode, "ba8f522e-12", {
          "k": "qrcode"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/mine/mine.vue"]]);
wx.createPage(MiniProgramPage);

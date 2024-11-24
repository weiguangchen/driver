"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_app = require("../../stores/app.js");
const stores_user = require("../../stores/user.js");
const stores_location = require("../../stores/location.js");
const utils_authorize = require("../../utils/authorize.js");
const utils_token = require("../../utils/token.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uv_status_bar2 = common_vendor.resolveComponent("uv-status-bar");
  const _easycom_uv_icon2 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_my_plate2 = common_vendor.resolveComponent("my-plate");
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_uv_line2 = common_vendor.resolveComponent("uv-line");
  const _easycom_uv_load_more2 = common_vendor.resolveComponent("uv-load-more");
  const _easycom_my_empty2 = common_vendor.resolveComponent("my-empty");
  const _easycom_my_login_drawer2 = common_vendor.resolveComponent("my-login-drawer");
  const _easycom_my_tabbar2 = common_vendor.resolveComponent("my-tabbar");
  (_easycom_uv_status_bar2 + _easycom_uv_icon2 + _easycom_uv_button2 + _easycom_my_plate2 + _easycom_uv_image2 + _easycom_uv_line2 + _easycom_uv_load_more2 + _easycom_my_empty2 + _easycom_my_login_drawer2 + _easycom_my_tabbar2)();
}
const _easycom_uv_status_bar = () => "../../uni_modules/uv-status-bar/components/uv-status-bar/uv-status-bar.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_my_plate = () => "../../components/my-plate/my-plate.js";
const _easycom_uv_image = () => "../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_uv_line = () => "../../uni_modules/uv-line/components/uv-line/uv-line.js";
const _easycom_uv_load_more = () => "../../uni_modules/uv-load-more/components/uv-load-more/uv-load-more.js";
const _easycom_my_empty = () => "../../components/my-empty/my-empty.js";
const _easycom_my_login_drawer = () => "../../components/my-login-drawer/my-login-drawer.js";
const _easycom_my_tabbar = () => "../../components/my-tabbar/my-tabbar.js";
if (!Math) {
  (_easycom_uv_status_bar + _easycom_uv_icon + _easycom_uv_button + _easycom_my_plate + _easycom_uv_image + _easycom_uv_line + SelectCargo + Item + _easycom_uv_load_more + _easycom_my_empty + _easycom_my_login_drawer + _easycom_my_tabbar)();
}
const SelectCargo = () => "./components/SelectCargo.js";
const Item = () => "./components/Item.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const appStore = stores_app.useAppStore();
    const userStore = stores_user.useUserStore();
    const locationStore = stores_location.useLocationStore();
    const { carList, defaultCar } = common_vendor.storeToRefs(userStore);
    const nickname = common_vendor.computed(() => {
      var _a;
      const tokenData = utils_token.getToken();
      return ((_a = tokenData == null ? void 0 : tokenData.userInfo) == null ? void 0 : _a.Nickname) ?? "司机师傅";
    });
    const isInit = common_vendor.ref(false);
    common_vendor.onLoad(async () => {
      console.log("onLoad");
      try {
        await utils_authorize.getLocationInfo();
        console.log("locationStore", locationStore);
      } catch {
      }
      isInit.value = true;
      if (!utils_token.getToken()) {
        return;
      }
      console.log("onload handle");
      await userStore.getCarList();
      await getCurrentCarnoCargoOptions();
      await getProcess();
    });
    common_vendor.onShow(async () => {
      console.log("onShow");
      appStore.switchTab(0);
      if (!isInit.value) {
        console.log("onShow is not init");
        return;
      }
      if (!utils_token.getToken()) {
        return;
      }
      console.log("onshow handle");
      await userStore.getCarList();
      await getProcess();
    });
    const processNumber = common_vendor.ref(0);
    async function getProcess() {
      const res = await api_index.GetDriverWayCount();
      processNumber.value = res;
    }
    function addCar() {
      common_vendor.index.navigateTo({
        url: "/pages/addCar/addCar"
      });
    }
    function changeCar() {
      common_vendor.index.navigateTo({
        url: "/pages/carList/carList"
      });
    }
    function toGuide() {
      common_vendor.index.navigateTo({
        url: "/pages/guide/guide"
      });
    }
    function follow() {
      const src = "https://mp.weixin.qq.com/s?__biz=MzkxOTcyODM5OA==&mid=2247483675&idx=1&sn=3f1378b5f85fe5ed6144eb9446f63a32&chksm=c19cf97af6eb706cee30883335ba2e11ab4ebd79c23dac68af13106c2b56e20eee02ddfe656c#rd";
      common_vendor.index.navigateTo({
        url: `/pages/webview/webview?src=${encodeURIComponent(src)}`
      });
    }
    function navigate(type) {
      if (!utils_token.getToken()) {
        openLoginDrawer();
        return;
      }
      switch (type) {
        case "数据统计":
          common_vendor.index.navigateTo({
            url: "/pages/statistics/statistics"
          });
          break;
        case "操作指南":
          common_vendor.index.navigateTo({
            url: "/pages/guide/guide"
          });
          break;
        case "问题反馈":
          common_vendor.index.navigateTo({
            url: "/pages/feedback/feedback"
          });
          break;
      }
    }
    const loginDrawer = common_vendor.ref();
    function openLoginDrawer() {
      loginDrawer.value.open();
    }
    function loginSuccess() {
      common_vendor.index.reLaunch({
        url: "/pages/index/index"
      });
    }
    const ownerId = common_vendor.ref("0");
    const currentCarnoCargoOptions = common_vendor.ref([]);
    async function getCurrentCarnoCargoOptions() {
      try {
        const res = await api_index.GetDriverTakeTicketOwnerList({
          carno: defaultCar.value.Carno
        });
        const cargos = res.map((m) => ({
          value: m.Id,
          label: m.Ownername
        }));
        currentCarnoCargoOptions.value = [{
          value: "0",
          label: "全部货主"
        }, ...cargos];
      } catch {
        ownerId.value = "0";
        currentCarnoCargoOptions.value = [{
          value: "0",
          label: "全部货主"
        }];
      }
    }
    common_vendor.watch(defaultCar, async (val, oldVal) => {
      console.log("切换默认车辆时，获取当前默认车牌号下可接运单", val, oldVal);
      if (val && !oldVal || val && oldVal && val.Id !== oldVal.Id) {
        console.log("重新获取列表");
        try {
          ownerId.value = "0";
          currentCarnoCargoOptions.value = [];
          await getCurrentCarnoCargoOptions();
        } catch {
        }
        getList();
      } else {
        console.log("不需重新获取");
      }
    }, {
      immediate: true
    });
    function changeCargo(item) {
      getList();
    }
    const assignCnt = common_vendor.ref(0);
    const assignList = common_vendor.ref([]);
    async function getList() {
      try {
        const res = await api_index.GetReceiveAssignList({
          ownerId: ownerId.value === "0" ? "" : ownerId.value,
          latitude: locationStore.location ? locationStore.location.latitude : "",
          longitude: locationStore.location ? locationStore.location.longitude : ""
        });
        assignCnt.value = res.assignCnt;
        assignList.value = res.assignList;
      } catch {
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(nickname.value),
        b: processNumber.value > 0
      }, processNumber.value > 0 ? {
        c: common_vendor.t(processNumber.value),
        d: common_vendor.p({
          name: "arrow-right",
          size: "20rpx",
          ["custom-style"]: {
            marginLeft: "4rpx"
          },
          color: "#ffffff"
        })
      } : {}, {
        e: !common_vendor.unref(utils_token.getToken)()
      }, !common_vendor.unref(utils_token.getToken)() ? {
        f: common_vendor.o(openLoginDrawer),
        g: common_vendor.p({
          shape: "circle",
          text: "请登录",
          color: "linear-gradient( 270deg, #31CE57 0%, #07B130 100%);",
          ["custom-style"]: {
            height: "72rpx",
            width: "268rpx"
          },
          customTextStyle: {
            fontSize: "28rpx"
          }
        })
      } : common_vendor.unref(carList) && common_vendor.unref(carList).length === 0 ? {
        i: common_vendor.o(addCar),
        j: common_vendor.p({
          shape: "circle",
          text: "添加车辆",
          icon: "plus",
          iconColor: "#ffffff",
          iconSize: "24rpx",
          color: "linear-gradient( 270deg, #31CE57 0%, #07B130 100%);",
          ["custom-style"]: {
            height: "72rpx",
            width: "268rpx"
          },
          customTextStyle: {
            fontSize: "28rpx"
          }
        })
      } : {
        k: common_vendor.p({
          plate: common_vendor.unref(defaultCar).Carno,
          color: common_vendor.unref(defaultCar).Color
        }),
        l: common_vendor.t(common_vendor.unref(defaultCar).Cartype),
        m: common_vendor.p({
          src: "/static/images/arrow2.png",
          duration: 0,
          width: "18rpx",
          height: "18rpx",
          ["custom-style"]: {
            marginLeft: "4rpx"
          }
        }),
        n: common_vendor.o(changeCar),
        o: common_vendor.unref(defaultCar).Cartype === "自卸车" ? 1 : "",
        p: common_vendor.unref(defaultCar).Cartype === "半挂车" ? 1 : "",
        q: common_vendor.unref(defaultCar).Cartype === "罐车" ? 1 : ""
      }, {
        h: common_vendor.unref(carList) && common_vendor.unref(carList).length === 0,
        r: common_vendor.p({
          color: "var(--divider)"
        }),
        s: common_vendor.p({
          src: "/static/images/home/scan.png",
          width: "80rpx",
          height: "80rpx",
          duration: 0,
          ["custom-style"]: {
            marginBottom: "14rpx"
          }
        }),
        t: common_vendor.p({
          src: "/static/images/home/statistics.png",
          width: "80rpx",
          height: "80rpx",
          duration: 0,
          ["custom-style"]: {
            marginBottom: "14rpx"
          }
        }),
        v: common_vendor.o(($event) => navigate("数据统计")),
        w: common_vendor.p({
          src: "/static/images/home/guide.png",
          width: "80rpx",
          height: "80rpx",
          duration: 0,
          ["custom-style"]: {
            marginBottom: "14rpx"
          }
        }),
        x: common_vendor.o(toGuide),
        y: common_vendor.p({
          src: "/static/images/home/feedback.png",
          width: "80rpx",
          height: "80rpx",
          duration: 0,
          ["custom-style"]: {
            marginBottom: "14rpx"
          }
        }),
        z: common_vendor.o(($event) => navigate("问题反馈")),
        A: common_vendor.p({
          width: "100%",
          height: "100%",
          duration: 0,
          src: "/static/images/mine/banner.png"
        }),
        B: common_vendor.o(follow),
        C: !common_vendor.unref(utils_token.getToken)()
      }, !common_vendor.unref(utils_token.getToken)() ? {
        D: common_vendor.p({
          src: "/static/images/empty/index.png",
          width: "176rpx",
          height: "176rpx",
          duration: 0
        })
      } : common_vendor.e({
        E: common_vendor.t(assignCnt.value),
        F: common_vendor.o(changeCargo),
        G: common_vendor.o(($event) => ownerId.value = $event),
        H: common_vendor.p({
          options: currentCarnoCargoOptions.value,
          modelValue: ownerId.value
        }),
        I: assignList.value.length > 0
      }, assignList.value.length > 0 ? {
        J: common_vendor.f(assignList.value, (item, index, i0) => {
          return {
            a: item.Id,
            b: "09b53fa2-14-" + i0,
            c: common_vendor.p({
              record: item
            })
          };
        }),
        K: common_vendor.p({
          status: "nomore",
          color: "#B0BECC",
          ["line-color"]: "#B0BECC",
          ["font-size"]: "24rpx"
        })
      } : {
        L: common_vendor.p({
          height: "200px",
          text: "暂无可接运单"
        })
      }), {
        M: common_vendor.sr(loginDrawer, "09b53fa2-17", {
          "k": "loginDrawer"
        }),
        N: common_vendor.o(loginSuccess)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);

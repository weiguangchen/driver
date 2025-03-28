"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_app = require("../../stores/app.js");
const utils_token = require("../../utils/token.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uv_search2 = common_vendor.resolveComponent("uv-search");
  const _easycom_uv_navbar2 = common_vendor.resolveComponent("uv-navbar");
  const _easycom_uv_tabs2 = common_vendor.resolveComponent("uv-tabs");
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_my_empty2 = common_vendor.resolveComponent("my-empty");
  const _easycom_my_login_drawer2 = common_vendor.resolveComponent("my-login-drawer");
  const _easycom_my_tabbar2 = common_vendor.resolveComponent("my-tabbar");
  (_easycom_uv_search2 + _easycom_uv_navbar2 + _easycom_uv_tabs2 + _easycom_uv_image2 + _easycom_my_empty2 + _easycom_my_login_drawer2 + _easycom_my_tabbar2)();
}
const _easycom_uv_search = () => "../../uni_modules/uv-search/components/uv-search/uv-search.js";
const _easycom_uv_navbar = () => "../../uni_modules/uv-navbar/components/uv-navbar/uv-navbar.js";
const _easycom_uv_tabs = () => "../../uni_modules/uv-tabs/components/uv-tabs/uv-tabs.js";
const _easycom_uv_image = () => "../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_my_empty = () => "../../components/my-empty/my-empty.js";
const _easycom_my_login_drawer = () => "../../components/my-login-drawer/my-login-drawer.js";
const _easycom_my_tabbar = () => "../../components/my-tabbar/my-tabbar.js";
if (!Math) {
  (_easycom_uv_search + FilterDrawer + _easycom_uv_navbar + _easycom_uv_tabs + _easycom_uv_image + _easycom_my_empty + Item + _easycom_my_login_drawer + _easycom_my_tabbar)();
}
const Item = () => "./components/item.js";
const FilterDrawer = () => "./components/FilterDrawer.js";
const _sfc_main = {
  __name: "waybill",
  setup(__props) {
    const appStore = stores_app.useAppStore();
    common_vendor.onLoad(() => {
      appStore.switchTab(1);
    });
    const loginDrawer = common_vendor.ref();
    function openLoginDrawer() {
      loginDrawer.value.open();
    }
    function loginSuccess() {
      common_vendor.index.reLaunch({
        url: "/pages/waybill/waybill"
      });
    }
    const show = common_vendor.ref(false);
    function changeFilterVisible(e) {
      show.value = e.show;
    }
    const navbarPad = common_vendor.ref(0);
    common_vendor.onMounted(() => {
      let menuButtonInfo = common_vendor.index.getMenuButtonBoundingClientRect();
      navbarPad.value = menuButtonInfo.width + 20;
    });
    const status = common_vendor.ref("");
    const tabs = common_vendor.ref([{
      name: "全部",
      value: ""
    }, {
      name: "已接单",
      value: "10"
    }, {
      name: "已完成",
      value: "8"
    }, {
      name: "已取消",
      value: "9"
    }]);
    function changeTabs({ value }) {
      status.value = value;
      getList();
    }
    const filter = common_vendor.ref();
    const isFilter = common_vendor.ref(false);
    const isFiltering = common_vendor.ref(false);
    function changeFilter(data) {
      console.log("changeFilter", data);
      isFiltering.value = true;
      isFilter.value = data.isFilter;
      params.value = data.params;
      getList();
    }
    const keyWord = common_vendor.ref("");
    const isKeyWord = common_vendor.ref(false);
    function handleSearch() {
      isFiltering.value = true;
      isKeyWord.value = !!keyWord.value;
      getList();
    }
    const list = common_vendor.ref([]);
    const params = common_vendor.ref({});
    const total = common_vendor.ref(0);
    async function getList() {
      const { dateMode, date, ...rest } = params.value;
      try {
        common_vendor.index.showLoading({
          mask: true
        });
        const res = await api_index.GetOnwayDriver({
          status: status.value,
          keyWord: keyWord.value,
          ...rest
        });
        list.value = res.onwayList;
        total.value = res.onwayCnt;
        await common_vendor.nextTick$1();
        common_vendor.index.hideLoading();
      } catch (err) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: err.data,
          icon: "none"
        });
      } finally {
        isFiltering.value = false;
      }
    }
    function reset() {
      keyWord.value = "";
      isKeyWord.value = false;
      filter.value.reset();
    }
    common_vendor.onShow(() => {
      if (utils_token.getToken()) {
        getList();
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: "overflow:" + (show.value ? "hidden" : "visible"),
        b: common_vendor.o(handleSearch),
        c: common_vendor.o(handleSearch),
        d: common_vendor.o(($event) => keyWord.value = $event),
        e: common_vendor.p({
          placeholder: "搜索运单号、车牌号",
          disabled: !common_vendor.unref(utils_token.getToken)(),
          showAction: false,
          modelValue: keyWord.value
        }),
        f: common_vendor.sr(filter, "093f1fb7-2,093f1fb7-0", {
          "k": "filter"
        }),
        g: common_vendor.o(changeFilter),
        h: common_vendor.o(changeFilterVisible),
        i: `${navbarPad.value}px`,
        j: common_vendor.p({
          placeholder: true,
          ["left-icon"]: ""
        }),
        k: common_vendor.o(changeTabs),
        l: common_vendor.p({
          activeStyle: {
            fontWeight: "bold",
            color: "var(--title-color)"
          },
          inactiveStyle: {
            color: "var(--sub-color)"
          },
          lineWidth: "32rpx",
          lineHeight: "8rpx",
          list: tabs.value,
          scrollable: false,
          lineColor: "var(--main-color)",
          customStyle: {
            background: "#ffffff"
          }
        }),
        m: isFilter.value && !isFiltering.value || isKeyWord.value && !isFiltering.value
      }, isFilter.value && !isFiltering.value || isKeyWord.value && !isFiltering.value ? {
        n: common_vendor.t(total.value),
        o: common_vendor.p({
          duration: 0,
          src: "/static/images/filter/redo.png",
          width: "28rpx",
          height: "28rpx",
          ["custom-style"]: {
            marginRight: "4rpx"
          }
        }),
        p: common_vendor.o(reset)
      } : {}, {
        q: !common_vendor.unref(utils_token.getToken)()
      }, !common_vendor.unref(utils_token.getToken)() ? {
        r: common_vendor.o(openLoginDrawer),
        s: common_vendor.p({
          showButton: true,
          buttonText: "登录",
          text: "登录后查看运单"
        })
      } : list.value.length === 0 ? {} : {
        v: common_vendor.f(list.value, (item, k0, i0) => {
          return {
            a: item.Id,
            b: common_vendor.o(getList, item.Id),
            c: "093f1fb7-7-" + i0,
            d: common_vendor.p({
              record: item
            })
          };
        })
      }, {
        t: list.value.length === 0,
        w: common_vendor.sr(loginDrawer, "093f1fb7-8", {
          "k": "loginDrawer"
        }),
        x: common_vendor.o(loginSuccess)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/waybill/waybill.vue"]]);
wx.createPage(MiniProgramPage);

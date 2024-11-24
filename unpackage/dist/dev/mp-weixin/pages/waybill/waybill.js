"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_app = require("../../stores/app.js");
const utils_token = require("../../utils/token.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uv_search2 = common_vendor.resolveComponent("uv-search");
  const _easycom_my_filter_drawer2 = common_vendor.resolveComponent("my-filter-drawer");
  const _easycom_uv_navbar2 = common_vendor.resolveComponent("uv-navbar");
  const _easycom_uv_tabs2 = common_vendor.resolveComponent("uv-tabs");
  const _easycom_my_empty2 = common_vendor.resolveComponent("my-empty");
  const _easycom_my_login_drawer2 = common_vendor.resolveComponent("my-login-drawer");
  const _easycom_my_tabbar2 = common_vendor.resolveComponent("my-tabbar");
  (_easycom_uv_search2 + _easycom_my_filter_drawer2 + _easycom_uv_navbar2 + _easycom_uv_tabs2 + _easycom_my_empty2 + _easycom_my_login_drawer2 + _easycom_my_tabbar2)();
}
const _easycom_uv_search = () => "../../uni_modules/uv-search/components/uv-search/uv-search.js";
const _easycom_my_filter_drawer = () => "../../components/my-filter-drawer/my-filter-drawer.js";
const _easycom_uv_navbar = () => "../../uni_modules/uv-navbar/components/uv-navbar/uv-navbar.js";
const _easycom_uv_tabs = () => "../../uni_modules/uv-tabs/components/uv-tabs/uv-tabs.js";
const _easycom_my_empty = () => "../../components/my-empty/my-empty.js";
const _easycom_my_login_drawer = () => "../../components/my-login-drawer/my-login-drawer.js";
const _easycom_my_tabbar = () => "../../components/my-tabbar/my-tabbar.js";
if (!Math) {
  (_easycom_uv_search + _easycom_my_filter_drawer + _easycom_uv_navbar + _easycom_uv_tabs + _easycom_my_empty + Item + _easycom_my_login_drawer + _easycom_my_tabbar)();
}
const Item = () => "./components/item.js";
const _sfc_main = {
  __name: "waybill",
  setup(__props) {
    const appStore = stores_app.useAppStore();
    common_vendor.onLoad(() => {
      appStore.switchTab(1);
    });
    const show = common_vendor.ref(false);
    function changeFilter(e) {
      show.value = e.show;
    }
    const navbarPad = common_vendor.ref(0);
    common_vendor.onMounted(() => {
      let menuButtonInfo = common_vendor.index.getMenuButtonBoundingClientRect();
      console.log("menuButtonInfo", menuButtonInfo);
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
    function searchFocus() {
      if (!utils_token.getToken()) {
        openLoginDrawer();
      }
    }
    const filter = common_vendor.ref();
    const loginDrawer = common_vendor.ref();
    function openLoginDrawer() {
      loginDrawer.value.open();
    }
    function loginSuccess() {
      common_vendor.index.reLaunch({
        url: "/pages/waybill/waybill"
      });
    }
    const list = common_vendor.ref([]);
    async function getList() {
      const res = await api_index.GetOnwayDriver({
        status: status.value
      });
      list.value = res.onwayList;
    }
    common_vendor.onShow(() => {
      if (utils_token.getToken()) {
        getList();
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: "overflow:" + (show.value ? "hidden" : "visible"),
        b: common_vendor.o(searchFocus),
        c: common_vendor.o(($event) => _ctx.keyword = $event),
        d: common_vendor.p({
          placeholder: "搜索运单号、车牌",
          showAction: false,
          modelValue: _ctx.keyword
        }),
        e: common_vendor.sr(filter, "093f1fb7-2,093f1fb7-0", {
          "k": "filter"
        }),
        f: common_vendor.o(changeFilter),
        g: `${navbarPad.value}px`,
        h: common_vendor.p({
          placeholder: true,
          ["left-icon"]: ""
        }),
        i: common_vendor.o(changeTabs),
        j: common_vendor.p({
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
        k: !common_vendor.unref(utils_token.getToken)()
      }, !common_vendor.unref(utils_token.getToken)() ? {
        l: common_vendor.o(openLoginDrawer),
        m: common_vendor.p({
          showButton: true,
          buttonText: "登录",
          text: "登录后查看运单"
        })
      } : list.value.length === 0 ? {} : {
        o: common_vendor.f(list.value, (item, k0, i0) => {
          return {
            a: item.Id,
            b: common_vendor.o(getList, item.Id),
            c: "093f1fb7-6-" + i0,
            d: common_vendor.p({
              record: item
            })
          };
        })
      }, {
        n: list.value.length === 0,
        p: common_vendor.sr(loginDrawer, "093f1fb7-7", {
          "k": "loginDrawer"
        }),
        q: common_vendor.o(loginSuccess)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/waybill/waybill.vue"]]);
wx.createPage(MiniProgramPage);

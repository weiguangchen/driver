"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_my_drawer2 = common_vendor.resolveComponent("my-drawer");
  _easycom_my_drawer2();
}
const _easycom_my_drawer = () => "../../../components/my-drawer/my-drawer.js";
if (!Math) {
  _easycom_my_drawer();
}
const _sfc_main = {
  __name: "StepDrawer",
  setup(__props, { expose: __expose }) {
    const list = common_vendor.ref([{
      name: "司机接单",
      date: "2023-09-08 20:08"
    }, {
      name: "司机到达装货厂家",
      date: "2023-09-08 20:08"
    }, {
      name: "车辆入厂",
      date: "2023-09-08 20:08"
    }, {
      name: "车辆入库",
      date: "2023-09-08 20:08"
    }, {
      name: "开始装车",
      date: "2023-09-08 20:08"
    }, {
      name: "装车完成",
      date: "2023-09-08 20:08"
    }, {
      name: "车辆出厂",
      date: "2023-09-08 20:08"
    }, {
      name: "司机/货主确认完成卸货",
      date: "2023-09-08 20:08"
    }, {
      name: "司机/货主取消运单",
      date: "2023-09-08 20:08"
    }]);
    const drawer = common_vendor.ref();
    function open() {
      drawer.value.popup.open();
    }
    __expose({
      open
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(list.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.date),
            c: index < list.value.length - 1
          }, index < list.value.length - 1 ? {} : {}, {
            d: index === list.value.length - 1 ? 1 : ""
          });
        }),
        b: common_vendor.sr(drawer, "41988d95-0", {
          "k": "drawer"
        }),
        c: common_vendor.p({
          title: "运单跟踪"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/billDetail/components/StepDrawer.vue"]]);
wx.createComponent(Component);

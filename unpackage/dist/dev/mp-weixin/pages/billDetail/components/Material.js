"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_index = require("../../../utils/index.js");
const api_index = require("../../../api/index.js");
const utils_token = require("../../../utils/token.js");
if (!Array) {
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_uv_switch2 = common_vendor.resolveComponent("uv-switch");
  const _easycom_uv_form_item2 = common_vendor.resolveComponent("uv-form-item");
  const _easycom_my_number_box2 = common_vendor.resolveComponent("my-number-box");
  const _easycom_uv_form2 = common_vendor.resolveComponent("uv-form");
  const _easycom_my_drawer2 = common_vendor.resolveComponent("my-drawer");
  (_easycom_uv_button2 + _easycom_uv_switch2 + _easycom_uv_form_item2 + _easycom_my_number_box2 + _easycom_uv_form2 + _easycom_my_drawer2)();
}
const _easycom_uv_button = () => "../../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_uv_switch = () => "../../../uni_modules/uv-switch/components/uv-switch/uv-switch.js";
const _easycom_uv_form_item = () => "../../../uni_modules/uv-form/components/uv-form-item/uv-form-item.js";
const _easycom_my_number_box = () => "../../../components/my-number-box/my-number-box.js";
const _easycom_uv_form = () => "../../../uni_modules/uv-form/components/uv-form/uv-form.js";
const _easycom_my_drawer = () => "../../../components/my-drawer/my-drawer.js";
if (!Math) {
  (_easycom_uv_button + _easycom_uv_switch + _easycom_uv_form_item + _easycom_my_number_box + _easycom_uv_form + _easycom_my_drawer)();
}
const __default__ = {
  options: {
    virtualHost: true
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "Material",
  props: {
    borderBottom: {
      default: false
    },
    record: {
      default: () => {
      }
    },
    bill: {
      default: () => {
      }
    }
  },
  emits: ["confirm"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const disabled = common_vendor.computed(() => {
      return ["0", "2"].includes(props.bill.EntryAuthened) || props.bill.EntryAuthened === "1" && props.record.ReceiveAble === "0";
    });
    const emits = __emit;
    const model = common_vendor.reactive({
      FullLoad: "0",
      Load: 0
    });
    const rules = common_vendor.reactive({
      Load: [{ require: true, message: "请填写预计总重" }]
    });
    common_vendor.watchEffect(() => {
      if (props.record) {
        model.FullLoad = props.record.FullLoad;
        model.Load = props.record.Load;
      }
    });
    async function changeIsFull(val) {
      console.log("val", val);
      await common_vendor.nextTick$1();
      drawer.value.resize();
    }
    const Suttle = common_vendor.computed(() => {
      var _a, _b, _c, _d, _e, _f;
      const map = {
        "半挂车": "bgTare",
        "自卸车": "zxTare",
        "罐车": "gcTare"
      };
      const carType = ((_b = (_a = props.bill) == null ? void 0 : _a.CarEnt) == null ? void 0 : _b.CarType) ?? "";
      const carTare = (map == null ? void 0 : map[carType]) ?? 0;
      const carWeight = ((_d = (_c = props.bill) == null ? void 0 : _c.ConfigEnt) == null ? void 0 : _d[carTare]) ?? 0;
      if (model.FullLoad === "1") {
        return common_vendor.Big(((_f = (_e = props.bill) == null ? void 0 : _e.ConfigEnt) == null ? void 0 : _f.fullLoadGross) || 0).minus(carWeight).toFixed(2);
      } else {
        return common_vendor.Big(model.Load || 0).minus(carWeight).toFixed(2);
      }
    });
    const drawer = common_vendor.ref();
    function openDrawer() {
      drawer.value.popup.open();
    }
    async function confirm() {
      var _a, _b, _c, _d, _e;
      await common_vendor.index.hideKeyboard();
      await utils_index.sleep(200);
      try {
        const tokenData = utils_token.getToken();
        const params = {
          AssignId: props.bill.Id,
          SupplyId: (_b = (_a = props.bill) == null ? void 0 : _a.SupEnt) == null ? void 0 : _b.Id,
          Customer: props.bill.OwnerEnt.Id,
          DriverId: (_c = tokenData == null ? void 0 : tokenData.userInfo) == null ? void 0 : _c.Id,
          Material: props.record.Material,
          MatName: props.record.MaterialName,
          FullLoad: model.FullLoad,
          Load: model.FullLoad === "1" ? (_e = (_d = props == null ? void 0 : props.bill) == null ? void 0 : _d.ConfigEnt) == null ? void 0 : _e.fullLoadGross : model.Load,
          Suttle: Suttle.value
        };
        console.log("接单参数", params);
        await api_index.DriverMakeOnway(params);
        common_vendor.index.showToast({
          title: "接单成功",
          icon: "none"
        });
        emits("confirm");
        drawer.value.popup.close();
      } catch (err) {
        console.log(err);
        common_vendor.index.showToast({
          title: err == null ? void 0 : err.data,
          icon: "none"
        });
        drawer.value.closeLoading();
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(__props.record.MaterialName),
        b: __props.record.ReceiveAble === "0"
      }, __props.record.ReceiveAble === "0" ? {} : __props.record.Limittype === "1" ? {
        d: common_vendor.t(__props.record.LeftWeight)
      } : __props.record.Limittype === "2" ? {
        f: common_vendor.t(__props.record.Lefttimes)
      } : {}, {
        c: __props.record.Limittype === "1",
        e: __props.record.Limittype === "2",
        g: __props.record.Realheight
      }, __props.record.Realheight ? {
        h: common_vendor.t(__props.record.Realheight)
      } : {}, {
        i: common_vendor.o(openDrawer),
        j: common_vendor.p({
          disabled: disabled.value,
          shape: "circle",
          color: disabled.value ? "#B0BECC" : "linear-gradient( 270deg, #31CE57 0%, #07B130 100%)",
          text: disabled.value ? "不可接" : "接单",
          ["custom-style"]: {
            height: "68rpx"
          }
        }),
        k: __props.borderBottom ? 1 : "",
        l: __props.borderBottom ? 1 : "",
        m: __props.bill.ConfigEnt.fullLoad === "1"
      }, __props.bill.ConfigEnt.fullLoad === "1" ? {
        n: common_vendor.o(changeIsFull),
        o: common_vendor.o(($event) => model.FullLoad = $event),
        p: common_vendor.p({
          ["active-color"]: "var(--main-color)",
          activeValue: "1",
          inactiveValue: "0",
          modelValue: model.FullLoad
        }),
        q: common_vendor.p({
          prop: "FullLoad",
          customStyle: {
            padding: "28rpx 0"
          }
        })
      } : {}, {
        r: model.FullLoad === "0"
      }, model.FullLoad === "0" ? {
        s: common_vendor.t(__props.bill.ConfigEnt ? __props.bill.ConfigEnt.fullLoadMin ? __props.bill.ConfigEnt.fullLoadMin : 0 : 0),
        t: common_vendor.t(__props.bill.ConfigEnt ? __props.bill.ConfigEnt.fullLoadMax ? __props.bill.ConfigEnt.fullLoadMax : "" : ""),
        v: common_vendor.o(($event) => model.Load = $event),
        w: common_vendor.p({
          ["decimal-length"]: "2",
          min: __props.bill.ConfigEnt ? __props.bill.ConfigEnt.fullLoadMin ? __props.bill.ConfigEnt.fullLoadMin : 0 : 0,
          ["min-limit-msg"]: (min) => `重量最少为${min}吨`,
          max: __props.bill.ConfigEnt ? __props.bill.ConfigEnt.fullLoadMax ? __props.bill.ConfigEnt.fullLoadMax : void 0 : void 0,
          ["max-limit-msg"]: (max) => `重量最多为${max}吨`,
          modelValue: model.Load
        }),
        x: common_vendor.p({
          labelPosition: "top",
          prop: "Load",
          customStyle: {
            padding: "28rpx 0"
          }
        })
      } : {}, {
        y: common_vendor.sr("form", "68193817-2,68193817-1"),
        z: common_vendor.p({
          labelPosition: "left",
          model,
          rules
        }),
        A: common_vendor.t(Suttle.value),
        B: common_vendor.sr(drawer, "68193817-1", {
          "k": "drawer"
        }),
        C: common_vendor.o(confirm),
        D: common_vendor.p({
          title: "设置预计装运量",
          showConfirmButton: true,
          confirmText: "确认接单",
          bgColor: "#FFFFFF",
          asyncClose: true
        })
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-68193817"], ["__file", "/Users/wei/driver/pages/billDetail/components/Material.vue"]]);
wx.createComponent(Component);

"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_token = require("../../../utils/token.js");
const stores_location = require("../../../stores/location.js");
const utils_authorize = require("../../../utils/authorize.js");
if (!Array) {
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_my_plate2 = common_vendor.resolveComponent("my-plate");
  const _easycom_uv_line2 = common_vendor.resolveComponent("uv-line");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_my_confirm2 = common_vendor.resolveComponent("my-confirm");
  (_easycom_uv_image2 + _easycom_my_plate2 + _easycom_uv_line2 + _easycom_uv_button2 + _easycom_my_confirm2)();
}
const _easycom_uv_image = () => "../../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_my_plate = () => "../../../components/my-plate/my-plate.js";
const _easycom_uv_line = () => "../../../uni_modules/uv-line/components/uv-line/uv-line.js";
const _easycom_uv_button = () => "../../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_my_confirm = () => "../../../components/my-confirm/my-confirm.js";
if (!Math) {
  (_easycom_uv_image + _easycom_my_plate + _easycom_uv_line + _easycom_uv_button + _easycom_my_confirm)();
}
const _sfc_main = {
  __name: "item",
  props: {
    record: {
      default: () => {
      },
      type: Object
    }
  },
  emits: ["success"],
  setup(__props, { emit: __emit }) {
    stores_location.useLocationStore();
    const emits = __emit;
    const props = __props;
    const statusText = common_vendor.computed(() => {
      if (["0", "1"].includes(props.record.WeightedStatus))
        return "待入场";
      if (["2", "3", "4"].includes(props.record.WeightedStatus))
        return "已入场";
      if (["5"].includes(props.record.WeightedStatus))
        return "装车中";
      if (["6"].includes(props.record.WeightedStatus))
        return "已装车";
      if (["7"].includes(props.record.WeightedStatus))
        return "已出场";
      if (["8"].includes(props.record.WeightedStatus))
        return "已完成";
      if (["9"].includes(props.record.WeightedStatus))
        return "已取消";
    });
    const modal = common_vendor.ref();
    function toDetail() {
      common_vendor.index.navigateTo({
        url: `/pages/billDetail/billDetail?assignId=${props.record.Id}`
      });
    }
    function cancelBill() {
      modal.value.confirm({
        title: "确认取消该笔运单？",
        content: "如取消次数过多，将会被限制接单",
        cancelText: "再想想",
        confirmText: "取消运单",
        asyncClose: true,
        async confirm() {
          try {
            await api_index.DisableOnwayEnt({
              onwayId: props.record.Id,
              userId: utils_token.getToken().userInfo.Id,
              userType: "driver"
            });
            modal.value.close();
            emits("success");
          } catch {
            modal.value.closeLoading();
          }
        }
      });
    }
    function takeOwnerPhone() {
      var _a, _b;
      common_vendor.index.makePhoneCall({
        phoneNumber: ((_b = (_a = props.record) == null ? void 0 : _a.OwnerEnt) == null ? void 0 : _b.LinkerMobile) ?? ""
      });
    }
    function takeSupPhone() {
      var _a, _b;
      common_vendor.index.makePhoneCall({
        phoneNumber: ((_b = (_a = props.record) == null ? void 0 : _a.SupEnt) == null ? void 0 : _b.LinkerMobile) ?? ""
      });
    }
    async function confirmArrive() {
      common_vendor.index.showLoading({
        mask: true
      });
      let location = {};
      try {
        location = await utils_authorize.getLocationInfo();
      } catch {
        modal.value.confirm({
          title: "定位失败",
          content: "请开启相关定位权限或者扫码入场",
          showCancelButton: false,
          confirmBgColor: "var(--main-color)"
        });
        common_vendor.index.hideLoading();
        return;
      }
      console.log("location", location);
      try {
        await api_index.ArrivedConfirm({
          onwayId: props.record.Id,
          logitude: location.longitude,
          latitude: location.latitude
        });
        emits("success");
      } catch (err) {
        modal.value.confirm({
          title: "到场失败",
          content: err.data,
          showCancelButton: false,
          confirmBgColor: "var(--red-color)"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    }
    async function confirmUnload() {
      common_vendor.index.showLoading({
        mask: true
      });
      let location = {};
      try {
        location = await utils_authorize.getLocationInfo();
      } catch {
        modal.value.confirm({
          title: "定位失败",
          content: "请开启相关定位权限",
          showCancelButton: false,
          confirmBgColor: "var(--main-color)"
        });
        common_vendor.index.hideLoading();
        return;
      }
      console.log("location", location);
      try {
        await api_index.UnloadConfirm({
          onwayId: props.record.Id,
          userId: utils_token.getToken().userInfo.Id,
          uType: "driver",
          logitude: location.longitude,
          latitude: location.latitude
        });
        emits("success");
      } catch (err) {
        modal.value.confirm({
          title: "卸货失败",
          content: err.data,
          showCancelButton: false,
          confirmBgColor: "var(--red-color)"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(statusText.value),
        b: ["8", "9"].includes(__props.record.WeightedStatus) ? 1 : "",
        c: ["0", "1", "2", "3", "4", "5", "6", "7"].includes(__props.record.WeightedStatus) ? 1 : "",
        d: __props.record.WeightedStatus === "0"
      }, __props.record.WeightedStatus === "0" ? common_vendor.e({
        e: __props.record.StartTime && __props.record.EndTime
      }, __props.record.StartTime && __props.record.EndTime ? {
        f: common_vendor.t(common_vendor.unref(common_vendor.dayjs)(__props.record.StartTime).format("MM-DD HH:mm")),
        g: common_vendor.t(common_vendor.unref(common_vendor.dayjs)(__props.record.EndTime).format("MM-DD HH:mm"))
      } : {}, {
        h: __props.record.StartTime && !__props.record.EndTime
      }, __props.record.StartTime && !__props.record.EndTime ? {
        i: common_vendor.t(common_vendor.unref(common_vendor.dayjs)(__props.record.StartTime).format("MM-DD HH:mm"))
      } : {}, {
        j: !__props.record.StartTime && __props.record.EndTime
      }, !__props.record.StartTime && __props.record.EndTime ? {
        k: common_vendor.t(common_vendor.unref(common_vendor.dayjs)(__props.record.EndTime).format("MM-DD HH:mm"))
      } : {}, {
        l: !__props.record.StartTime && !__props.record.EndTime
      }, !__props.record.StartTime && !__props.record.EndTime ? {} : {}) : {}, {
        m: __props.record.WeightedStatus === "1"
      }, __props.record.WeightedStatus === "1" ? common_vendor.e({
        n: __props.record.StatusCount && __props.record.StatusCount > 1
      }, __props.record.StatusCount && __props.record.StatusCount > 1 ? {
        o: common_vendor.t(__props.record.StatusCount)
      } : {}) : {}, {
        p: __props.record.WeightedStatus === "2"
      }, __props.record.WeightedStatus === "2" ? {} : {}, {
        q: __props.record.WeightedStatus === "3"
      }, __props.record.WeightedStatus === "3" ? common_vendor.e({
        r: __props.record.StatusCount && __props.record.StatusCount > 1
      }, __props.record.StatusCount && __props.record.StatusCount > 1 ? {
        s: common_vendor.t(__props.record.StatusCount)
      } : {}) : {}, {
        t: __props.record.WeightedStatus === "4"
      }, __props.record.WeightedStatus === "4" ? {} : {}, {
        v: __props.record.WeightedStatus === "5"
      }, __props.record.WeightedStatus === "5" ? {} : {}, {
        w: __props.record.WeightedStatus === "6"
      }, __props.record.WeightedStatus === "6" ? {} : {}, {
        x: __props.record.WeightedStatus === "7"
      }, __props.record.WeightedStatus === "7" ? {} : {}, {
        y: __props.record.WeightedStatus === "8"
      }, __props.record.WeightedStatus === "8" ? {} : {}, {
        z: __props.record.WeightedStatus === "9"
      }, __props.record.WeightedStatus === "9" ? {
        A: common_vendor.t(__props.record.CancelType)
      } : {}, {
        B: common_vendor.t(__props.record.OwnerEnt ? __props.record.OwnerEnt.OwnerName : ""),
        C: __props.record.SupEnt
      }, __props.record.SupEnt ? {
        D: common_vendor.f(3, (dot, k0, i0) => {
          return {};
        }),
        E: common_vendor.p({
          src: "/static/images/dot1.png",
          width: "16rpx",
          height: "16rpx",
          duration: 0,
          ["custom-style"]: {
            marginRight: "16rpx"
          }
        }),
        F: common_vendor.t(__props.record.SupEnt ? __props.record.SupEnt.City : ""),
        G: common_vendor.t(__props.record.SupEnt ? __props.record.SupEnt.SupplierName : "")
      } : {}, {
        H: __props.record.UnloadEnt
      }, __props.record.UnloadEnt ? {
        I: common_vendor.p({
          src: "/static/images/dot2.png",
          width: "16rpx",
          height: "16rpx",
          duration: 0,
          ["custom-style"]: {
            marginRight: "16rpx"
          }
        }),
        J: common_vendor.t(__props.record.UnloadEnt ? __props.record.UnloadEnt.City : ""),
        K: common_vendor.t(__props.record.UnloadEnt ? __props.record.UnloadEnt.PlaceName : "")
      } : {}, {
        L: __props.record.CarEnt
      }, __props.record.CarEnt ? {
        M: common_vendor.p({
          plate: __props.record.CarEnt.Carno,
          color: __props.record.CarEnt.Color
        })
      } : {}, {
        N: common_vendor.t(__props.record.MaterialName ? __props.record.MaterialName : ""),
        O: common_vendor.p({
          direction: "col",
          color: "#B0BECC",
          length: "26rpx",
          margin: "0 20rpx 0 20rpx"
        }),
        P: ["0", "1", "2", "3", "4", "5", "9"].includes(__props.record.WeightedStatus)
      }, ["0", "1", "2", "3", "4", "5", "9"].includes(__props.record.WeightedStatus) ? {
        Q: common_vendor.t(__props.record.EstimiteWeight)
      } : {}, {
        R: ["6", "7", "8"].includes(__props.record.WeightedStatus)
      }, ["6", "7", "8"].includes(__props.record.WeightedStatus) ? {
        S: common_vendor.t(__props.record.WeightEnt ? __props.record.WeightEnt.Suttle : "")
      } : {}, {
        T: ["0", "1"].includes(__props.record.WeightedStatus)
      }, ["0", "1"].includes(__props.record.WeightedStatus) ? {
        U: common_vendor.o(cancelBill),
        V: common_vendor.p({
          shape: "circle",
          text: "取消运单",
          color: "var(--page-bg)",
          customTextStyle: {
            color: "var(--content-color)",
            fontSize: "26rpx"
          },
          customStyle: {
            height: "32px"
          }
        }),
        W: common_vendor.o(() => {
        })
      } : {}, {
        X: ["0", "1", "7"].includes(__props.record.WeightedStatus)
      }, ["0", "1", "7"].includes(__props.record.WeightedStatus) ? {
        Y: common_vendor.o(takeOwnerPhone),
        Z: common_vendor.p({
          shape: "circle",
          text: "呼叫货主",
          color: "var(--page-bg)",
          customTextStyle: {
            color: "var(--content-color)",
            fontSize: "26rpx"
          },
          customStyle: {
            height: "32px"
          }
        }),
        aa: common_vendor.o(() => {
        })
      } : {}, {
        ab: ["2", "3", "4", "5", "6"].includes(__props.record.WeightedStatus)
      }, ["2", "3", "4", "5", "6"].includes(__props.record.WeightedStatus) ? {
        ac: common_vendor.o(takeSupPhone),
        ad: common_vendor.p({
          shape: "circle",
          text: "呼叫厂家",
          color: "var(--page-bg)",
          customTextStyle: {
            color: "var(--content-color)",
            fontSize: "26rpx"
          },
          customStyle: {
            height: "32px"
          }
        }),
        ae: common_vendor.o(() => {
        })
      } : {}, {
        af: ["0"].includes(__props.record.WeightedStatus)
      }, ["0"].includes(__props.record.WeightedStatus) ? {
        ag: common_vendor.o(confirmArrive),
        ah: common_vendor.p({
          shape: "circle",
          text: "确认到厂",
          color: "linear-gradient( 270deg, #31CE57 0%, #07B130 100%);",
          customTextStyle: {
            fontSize: "26rpx"
          },
          customStyle: {
            height: "32px"
          }
        }),
        ai: common_vendor.o(() => {
        })
      } : {}, {
        aj: ["7"].includes(__props.record.WeightedStatus)
      }, ["7"].includes(__props.record.WeightedStatus) ? {
        ak: common_vendor.o(confirmUnload),
        al: common_vendor.p({
          shape: "circle",
          text: "确认卸货",
          color: "linear-gradient( 270deg, #31CE57 0%, #07B130 100%);",
          customTextStyle: {
            fontSize: "26rpx"
          },
          customStyle: {
            height: "32px"
          }
        }),
        am: common_vendor.o(() => {
        })
      } : {}, {
        an: __props.record.WeightedStatus !== "9" ? 1 : "",
        ao: common_vendor.o(toDetail),
        ap: common_vendor.sr(modal, "8d041879-9", {
          "k": "modal"
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8d041879"], ["__file", "/Users/wei/driver/pages/waybill/components/item.vue"]]);
wx.createComponent(Component);

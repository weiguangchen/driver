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
  (_easycom_uv_image + _easycom_my_plate + _easycom_uv_line + _easycom_uv_button + _easycom_my_confirm + UnloadModal)();
}
const UnloadModal = () => "./UnloadModal.js";
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
        return "待入厂";
      if (["2", "3", "4"].includes(props.record.WeightedStatus))
        return "已入厂";
      if (["5"].includes(props.record.WeightedStatus))
        return "装车中";
      if (["6"].includes(props.record.WeightedStatus))
        return "已装车";
      if (["7"].includes(props.record.WeightedStatus))
        return "已出厂";
      if (["8"].includes(props.record.WeightedStatus))
        return "已完成";
      if (["9"].includes(props.record.WeightedStatus))
        return "已取消";
    });
    const modal = common_vendor.ref();
    function toDetail() {
      common_vendor.index.navigateTo({
        url: `/pages/wayBillDetail/wayBillDetail?onwayId=${props.record.OnwayId}&supplyId=${props.record.SupplyId}`
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
              supplyId: props.record.SupplyId,
              userId: utils_token.getToken().userInfo.Id,
              userType: "driver"
            });
            await common_vendor.index.showToast({
              title: "操作成功",
              icon: "none",
              complete() {
                setTimeout(() => {
                  emits("success");
                }, 1500);
              }
            });
            modal.value.close();
          } catch (err) {
            modal.value.closeLoading();
            common_vendor.index.showToast({
              title: err.data,
              icon: "none"
            });
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
          content: "请开启相关定位权限或者扫码入厂",
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
          supplyId: props.record.SupplyId,
          logitude: location.longitude,
          latitude: location.latitude
        });
        common_vendor.index.hideLoading();
        await common_vendor.index.showToast({
          title: "操作成功",
          icon: "none",
          complete() {
            setTimeout(() => {
              emits("success");
            }, 1500);
          }
        });
      } catch (err) {
        console.log("err", err);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: err.data,
          icon: "none"
        });
      }
    }
    const unload = common_vendor.ref();
    async function confirmUnload() {
      unload.value.open(props.record);
    }
    function onSuccess() {
      emits("success");
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(statusText.value),
        b: ["8", "9"].includes(__props.record.WeightedStatus) ? 1 : "",
        c: ["0", "1", "2", "3", "4", "5", "6", "7"].includes(__props.record.WeightedStatus) ? 1 : "",
        d: __props.record.WeightedStatus === "0"
      }, __props.record.WeightedStatus === "0" ? common_vendor.e({
        e: !__props.record.StartTime && !__props.record.EndTime || __props.record.StartTime && common_vendor.unref(common_vendor.dayjs)().isAfter(__props.record.StartTime) && !__props.record.EndTime
      }, !__props.record.StartTime && !__props.record.EndTime || __props.record.StartTime && common_vendor.unref(common_vendor.dayjs)().isAfter(__props.record.StartTime) && !__props.record.EndTime ? {} : !__props.record.EndTime && __props.record.StartTime && common_vendor.unref(common_vendor.dayjs)().isBefore(__props.record.StartTime) ? {
        g: common_vendor.t(common_vendor.unref(common_vendor.dayjs)(__props.record.StartTime).format("MM-DD HH:mm"))
      } : __props.record.EndTime && __props.record.StartTime && common_vendor.unref(common_vendor.dayjs)().isBefore(__props.record.StartTime) ? {
        i: common_vendor.t(common_vendor.unref(common_vendor.dayjs)(__props.record.StartTime).format("MM-DD HH:mm")),
        j: common_vendor.t(common_vendor.unref(common_vendor.dayjs)(__props.record.EndTime).format("MM-DD HH:mm"))
      } : __props.record.StartTime && common_vendor.unref(common_vendor.dayjs)().isAfter(__props.record.StartTime) && __props.record.EndTime && common_vendor.unref(common_vendor.dayjs)().isBefore(__props.record.EndTime) || !__props.record.StartTime && __props.record.EndTime && common_vendor.unref(common_vendor.dayjs)().isBefore(__props.record.EndTime) ? {
        l: common_vendor.t(common_vendor.unref(common_vendor.dayjs)(__props.record.EndTime).format("MM-DD HH:mm"))
      } : {}, {
        f: !__props.record.EndTime && __props.record.StartTime && common_vendor.unref(common_vendor.dayjs)().isBefore(__props.record.StartTime),
        h: __props.record.EndTime && __props.record.StartTime && common_vendor.unref(common_vendor.dayjs)().isBefore(__props.record.StartTime),
        k: __props.record.StartTime && common_vendor.unref(common_vendor.dayjs)().isAfter(__props.record.StartTime) && __props.record.EndTime && common_vendor.unref(common_vendor.dayjs)().isBefore(__props.record.EndTime) || !__props.record.StartTime && __props.record.EndTime && common_vendor.unref(common_vendor.dayjs)().isBefore(__props.record.EndTime)
      }) : {}, {
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
      }, __props.record.WeightedStatus === "8" ? {
        z: common_vendor.t(__props.record.UserType ? __props.record.UserType === "driver" ? "司机" : "货主" : "")
      } : {}, {
        A: __props.record.WeightedStatus === "9"
      }, __props.record.WeightedStatus === "9" ? {
        B: common_vendor.t(__props.record.UserType ? __props.record.UserType === "driver" ? "司机" : "货主" : "")
      } : {}, {
        C: common_vendor.t(__props.record.OwnerEnt ? __props.record.OwnerEnt.OwnerName : ""),
        D: __props.record.SupEnt
      }, __props.record.SupEnt ? {
        E: common_vendor.f(3, (dot, k0, i0) => {
          return {};
        }),
        F: common_vendor.p({
          src: "/static/images/dot1.png",
          width: "16rpx",
          height: "16rpx",
          duration: 0,
          ["custom-style"]: {
            marginRight: "16rpx"
          }
        }),
        G: common_vendor.t(__props.record.SupEnt ? __props.record.SupEnt.City : ""),
        H: common_vendor.t(__props.record.SupEnt ? __props.record.SupEnt.Name : "")
      } : {}, {
        I: __props.record.UnloadEnt
      }, __props.record.UnloadEnt ? {
        J: common_vendor.p({
          src: "/static/images/dot2.png",
          width: "16rpx",
          height: "16rpx",
          duration: 0,
          ["custom-style"]: {
            marginRight: "16rpx"
          }
        }),
        K: common_vendor.t(__props.record.UnloadEnt ? __props.record.UnloadEnt.City : ""),
        L: common_vendor.t(__props.record.UnloadEnt ? __props.record.UnloadEnt.PlaceName : "")
      } : {}, {
        M: __props.record.Carno
      }, __props.record.Carno ? {
        N: common_vendor.p({
          plate: __props.record.Carno,
          color: __props.record.CarColor
        })
      } : {}, {
        O: common_vendor.t(__props.record.MaterialName ? __props.record.MaterialName : ""),
        P: common_vendor.p({
          direction: "col",
          color: "#B0BECC",
          length: "26rpx",
          margin: "0 20rpx 0 20rpx"
        }),
        Q: ["0", "1", "2", "3", "4", "5", "9"].includes(__props.record.WeightedStatus)
      }, ["0", "1", "2", "3", "4", "5", "9"].includes(__props.record.WeightedStatus) ? {
        R: common_vendor.t(__props.record.EstimiteWeight)
      } : {}, {
        S: ["6", "7", "8"].includes(__props.record.WeightedStatus)
      }, ["6", "7", "8"].includes(__props.record.WeightedStatus) ? {
        T: common_vendor.t(__props.record.WeightEnt ? __props.record.WeightEnt.Suttle : "")
      } : {}, {
        U: ["0", "1"].includes(__props.record.WeightedStatus)
      }, ["0", "1"].includes(__props.record.WeightedStatus) ? {
        V: common_vendor.o(cancelBill),
        W: common_vendor.p({
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
        X: common_vendor.o(() => {
        })
      } : {}, {
        Y: ["0", "1", "7"].includes(__props.record.WeightedStatus)
      }, ["0", "1", "7"].includes(__props.record.WeightedStatus) ? {
        Z: common_vendor.o(takeOwnerPhone),
        aa: common_vendor.p({
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
        ab: common_vendor.o(() => {
        })
      } : {}, {
        ac: ["2", "3", "4", "5", "6"].includes(__props.record.WeightedStatus)
      }, ["2", "3", "4", "5", "6"].includes(__props.record.WeightedStatus) ? {
        ad: common_vendor.o(takeSupPhone),
        ae: common_vendor.p({
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
        af: common_vendor.o(() => {
        })
      } : {}, {
        ag: ["0"].includes(__props.record.WeightedStatus)
      }, ["0"].includes(__props.record.WeightedStatus) ? {
        ah: common_vendor.o(confirmArrive),
        ai: common_vendor.p({
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
        aj: common_vendor.o(() => {
        })
      } : {}, {
        ak: ["4"].includes(__props.record.WeightedStatus)
      }, ["4"].includes(__props.record.WeightedStatus) ? {
        al: common_vendor.p({
          shape: "circle",
          text: "开始装车",
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
        an: ["7"].includes(__props.record.WeightedStatus)
      }, ["7"].includes(__props.record.WeightedStatus) ? {
        ao: common_vendor.o(confirmUnload),
        ap: common_vendor.p({
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
        aq: common_vendor.o(() => {
        })
      } : {}, {
        ar: ["0", "1", "2", "3", "4", "5", "6", "7"].includes(__props.record.WeightedStatus) ? 1 : "",
        as: common_vendor.o(toDetail),
        at: common_vendor.sr(modal, "8d041879-10", {
          "k": "modal"
        }),
        av: common_vendor.sr(unload, "8d041879-11", {
          "k": "unload"
        }),
        aw: common_vendor.o(onSuccess)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8d041879"], ["__file", "/Users/wei/driver/pages/waybill/components/item.vue"]]);
wx.createComponent(Component);

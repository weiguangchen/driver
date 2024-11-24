"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uv_navbar2 = common_vendor.resolveComponent("uv-navbar");
  const _easycom_uv_icon2 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_my_plate2 = common_vendor.resolveComponent("my-plate");
  (_easycom_uv_navbar2 + _easycom_uv_icon2 + _easycom_uv_image2 + _easycom_uv_button2 + _easycom_my_plate2)();
}
const _easycom_uv_navbar = () => "../../uni_modules/uv-navbar/components/uv-navbar/uv-navbar.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_image = () => "../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_my_plate = () => "../../components/my-plate/my-plate.js";
if (!Math) {
  (_easycom_uv_navbar + _easycom_uv_icon + _easycom_uv_image + Material + _easycom_uv_button + _easycom_my_plate + MapDrawer + StepDrawer)();
}
const Material = () => "./components/Material.js";
const MapDrawer = () => "./components/MapDrawer.js";
const StepDrawer = () => "./components/StepDrawer.js";
const _sfc_main = {
  __name: "billDetail",
  setup(__props) {
    const statusBarHeight = common_vendor.ref();
    const assignId = common_vendor.ref("");
    common_vendor.onLoad((options) => {
      statusBarHeight.value = common_vendor.index.getSystemInfoSync().statusBarHeight;
      assignId.value = (options == null ? void 0 : options.assignId) ?? "";
      getData();
    });
    const info = common_vendor.ref({});
    async function getData() {
      try {
        const res = await api_index.GetReceiveAssignDetail({
          assignId: assignId.value
        });
        info.value = {
          ...res,
          MatList: res.MatList.map((m) => ({
            ...m,
            FullLoad: "0",
            Load: res.ConfigEnt ? res.ConfigEnt.fullLoadMax ? res.ConfigEnt.fullLoadMax : void 0 : void 0
          }))
        };
      } catch {
      } finally {
      }
    }
    const placeholderHeight = common_vendor.computed(() => `${statusBarHeight.value + 56}px`);
    function leftClick() {
      common_vendor.index.navigateBack();
    }
    const mapModal = common_vendor.ref();
    function openMapModal() {
      mapModal.value.open();
    }
    const stepModal = common_vendor.ref();
    function openStepModal() {
      stepModal.value.open();
    }
    function takePhone() {
      common_vendor.index.makePhoneCall({
        phoneNumber: info.value.OwnerEnt.LinkerMobile
      });
    }
    function confirm() {
      getData();
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(leftClick),
        b: common_vendor.p({
          bgColor: "rgba(255,255,255,0)"
        }),
        c: placeholderHeight.value,
        d: info.value.EntryAuthened === "0" ? 1 : "",
        e: info.value.EntryAuthened === "0"
      }, info.value.EntryAuthened === "0" ? {} : {
        f: common_vendor.p({
          name: "arrow-right",
          size: "32rpx",
          color: "#FFFFFF",
          ["custom-style"]: {
            marginLeft: "8rpx"
          },
          bold: true
        })
      }, {
        g: !info.value.StartTime && !info.value.EndTime || info.value.StartTime && common_vendor.unref(common_vendor.dayjs)().isAfter(info.value.StartTime) && !info.value.EndTime
      }, !info.value.StartTime && !info.value.EndTime || info.value.StartTime && common_vendor.unref(common_vendor.dayjs)().isAfter(info.value.StartTime) && !info.value.EndTime ? {} : !info.value.EndTime && info.value.StartTime && common_vendor.unref(common_vendor.dayjs)().isBefore(info.value.StartTime) ? {
        i: common_vendor.t(info.value.StartTime)
      } : info.value.EndTime && info.value.StartTime && common_vendor.unref(common_vendor.dayjs)().isBefore(info.value.StartTime) ? {
        k: common_vendor.t(info.value.StartTime),
        l: common_vendor.t(info.value.EndTime)
      } : info.value.StartTime && common_vendor.unref(common_vendor.dayjs)().isAfter(info.value.StartTime) && info.value.EndTime && common_vendor.unref(common_vendor.dayjs)().isBefore(info.value.EndTime) || !info.value.StartTime && info.value.EndTime && common_vendor.unref(common_vendor.dayjs)().isBefore(info.value.EndTime) ? {
        n: common_vendor.t(info.value.EndTime)
      } : {}, {
        h: !info.value.EndTime && info.value.StartTime && common_vendor.unref(common_vendor.dayjs)().isBefore(info.value.StartTime),
        j: info.value.EndTime && info.value.StartTime && common_vendor.unref(common_vendor.dayjs)().isBefore(info.value.StartTime),
        m: info.value.StartTime && common_vendor.unref(common_vendor.dayjs)().isAfter(info.value.StartTime) && info.value.EndTime && common_vendor.unref(common_vendor.dayjs)().isBefore(info.value.EndTime) || !info.value.StartTime && info.value.EndTime && common_vendor.unref(common_vendor.dayjs)().isBefore(info.value.EndTime),
        o: common_vendor.o(openStepModal),
        p: info.value.SupEnt
      }, info.value.SupEnt ? {
        q: common_vendor.t(info.value.SupEnt ? info.value.SupEnt.SupplierName : ""),
        r: common_vendor.t(info.value.SupEnt ? info.value.SupEnt.Province : ""),
        s: common_vendor.t(info.value.SupEnt ? info.value.SupEnt.City : ""),
        t: common_vendor.t(info.value.SupEnt ? info.value.SupEnt.District : ""),
        v: common_vendor.t(info.value.SupEnt ? info.value.SupEnt.Address : ""),
        w: common_vendor.o((...args) => _ctx.selectAddress && _ctx.selectAddress(...args)),
        x: common_vendor.p({
          src: "/static/images/arrow.png",
          duration: 0,
          width: "24rpx",
          height: "24rpx"
        }),
        y: common_vendor.o(openMapModal)
      } : {}, {
        z: info.value.UnloadEnt
      }, info.value.UnloadEnt ? {
        A: common_vendor.t(info.value.UnloadEnt ? info.value.UnloadEnt.PlaceName : ""),
        B: common_vendor.t(info.value.UnloadEnt ? info.value.UnloadEnt.Province : ""),
        C: common_vendor.t(info.value.UnloadEnt ? info.value.UnloadEnt.City : ""),
        D: common_vendor.t(info.value.UnloadEnt ? info.value.UnloadEnt.District : ""),
        E: common_vendor.t(info.value.UnloadEnt ? info.value.UnloadEnt.Address : ""),
        F: common_vendor.o((...args) => _ctx.selectAddress && _ctx.selectAddress(...args)),
        G: common_vendor.p({
          src: "/static/images/arrow.png",
          duration: 0,
          width: "24rpx",
          height: "24rpx"
        }),
        H: common_vendor.o(openMapModal)
      } : {}, {
        I: info.value.MatList && info.value.MatList.length > 0
      }, info.value.MatList && info.value.MatList.length > 0 ? {
        J: common_vendor.f(info.value.MatList, (item, i, i0) => {
          return {
            a: "9e3db46e-4-" + i0,
            b: common_vendor.p({
              record: item,
              bill: info.value,
              ["border-bottom"]: i < info.value.MatList.length - 1
            })
          };
        }),
        K: common_vendor.o(confirm)
      } : {}, {
        L: info.value.OwnerEnt
      }, info.value.OwnerEnt ? common_vendor.e({
        M: common_vendor.t(info.value.OwnerEnt ? info.value.OwnerEnt.OwnerName : ""),
        N: common_vendor.t(info.value.OwnerEnt ? info.value.OwnerEnt.Linker : ""),
        O: common_vendor.t(info.value.OwnerEnt ? info.value.OwnerEnt.LinkerMobile : ""),
        P: info.value.OwnerEnt && info.value.OwnerEnt.LinkerMobile
      }, info.value.OwnerEnt && info.value.OwnerEnt.LinkerMobile ? {
        Q: common_vendor.o(takePhone),
        R: common_vendor.p({
          shape: "circle",
          color: "var(--page-bg)",
          ["custom-style"]: {
            height: "68rpx",
            color: "var(--main-color)",
            fontWeight: "bold"
          }
        })
      } : {}) : {}, {
        S: info.value.CarEnt
      }, info.value.CarEnt ? common_vendor.e({
        T: common_vendor.p({
          plate: info.value.CarEnt.Carno,
          color: info.value.CarEnt.Color
        }),
        U: common_vendor.t(info.value.CarEnt.CarType),
        V: info.value.DriverEnt
      }, info.value.DriverEnt ? {
        W: common_vendor.t(info.value.DriverEnt ? info.value.DriverEnt.NickName : ""),
        X: common_vendor.t(info.value.DriverEnt ? info.value.DriverEnt.Mobile : "")
      } : {}) : {}, {
        Y: info.value.Memo
      }, info.value.Memo ? {
        Z: common_vendor.t(info.value.Memo)
      } : {}, {
        aa: info.value.Memo
      }, info.value.Memo ? {
        ab: common_vendor.t(info.value.Memo)
      } : {}, {
        ac: common_vendor.t(info.value.CreatorTime),
        ad: common_vendor.p({
          text: "取消运单",
          color: "var(--page-bg)",
          ["custom-style"]: {
            height: "96rpx",
            borderRadius: "16rpx",
            color: "var(--sub-color)"
          }
        }),
        ae: common_vendor.p({
          text: "已到达装货厂家",
          color: " linear-gradient( 270deg, #31CE57 0%, #07B130 100%)",
          ["custom-style"]: {
            height: "96rpx",
            borderRadius: "16rpx"
          }
        }),
        af: common_vendor.sr(mapModal, "9e3db46e-9", {
          "k": "mapModal"
        }),
        ag: common_vendor.sr(stepModal, "9e3db46e-10", {
          "k": "stepModal"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/billDetail/billDetail.vue"]]);
wx.createPage(MiniProgramPage);

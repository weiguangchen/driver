"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uv_navbar2 = common_vendor.resolveComponent("uv-navbar");
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_my_plate2 = common_vendor.resolveComponent("my-plate");
  (_easycom_uv_navbar2 + _easycom_uv_image2 + _easycom_uv_button2 + _easycom_my_plate2)();
}
const _easycom_uv_navbar = () => "../../uni_modules/uv-navbar/components/uv-navbar/uv-navbar.js";
const _easycom_uv_image = () => "../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_my_plate = () => "../../components/my-plate/my-plate.js";
if (!Math) {
  (_easycom_uv_navbar + _easycom_uv_image + Material + _easycom_uv_button + _easycom_my_plate + MapDrawer + StepDrawer)();
}
const Material = () => "./components/Material.js";
const MapDrawer = () => "./components/MapDrawer.js";
const StepDrawer = () => "./components/StepDrawer.js";
const _sfc_main = {
  __name: "billDetail",
  setup(__props) {
    const statusBarHeight = common_vendor.ref();
    const assignId = common_vendor.ref("");
    const supplyId = common_vendor.ref("");
    common_vendor.onLoad((options) => {
      statusBarHeight.value = common_vendor.index.getSystemInfoSync().statusBarHeight;
      assignId.value = (options == null ? void 0 : options.assignId) ?? "";
      supplyId.value = (options == null ? void 0 : options.supplyId) ?? "";
      getData();
    });
    const info = common_vendor.ref({});
    async function getData() {
      try {
        const res = await api_index.GetReceiveAssignDetail({
          assignId: assignId.value,
          supplyId: supplyId.value
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
    function openMapModal(type) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J;
      const data = {
        type,
        name: type === 1 ? ((_b = (_a = info.value) == null ? void 0 : _a.SupEnt) == null ? void 0 : _b.Name) ?? "" : ((_d = (_c = info.value) == null ? void 0 : _c.UnloadEnt) == null ? void 0 : _d.PlaceName) ?? "",
        address: type === 1 ? `${((_f = (_e = info.value) == null ? void 0 : _e.SupEnt) == null ? void 0 : _f.Province) ?? ""}${((_h = (_g = info.value) == null ? void 0 : _g.SupEnt) == null ? void 0 : _h.City) ?? ""}${((_j = (_i = info.value) == null ? void 0 : _i.SupEnt) == null ? void 0 : _j.District) ?? ""}${((_l = (_k = info.value) == null ? void 0 : _k.SupEnt) == null ? void 0 : _l.Address) ?? ""}` : `${((_n = (_m = info.value) == null ? void 0 : _m.UnloadEnt) == null ? void 0 : _n.Province) ?? ""}${((_p = (_o = info.value) == null ? void 0 : _o.UnloadEnt) == null ? void 0 : _p.City) ?? ""}${((_r = (_q = info.value) == null ? void 0 : _q.UnloadEnt) == null ? void 0 : _r.District) ?? ""}${((_t = (_s = info.value) == null ? void 0 : _s.UnloadEnt) == null ? void 0 : _t.Address) ?? ""}`,
        user: type === 1 ? ((_v = (_u = info.value) == null ? void 0 : _u.SupEnt) == null ? void 0 : _v.Linker) ?? "" : ((_x = (_w = info.value) == null ? void 0 : _w.UnloadEnt) == null ? void 0 : _x.NickName) ?? "",
        phone: type === 1 ? ((_z = (_y = info.value) == null ? void 0 : _y.SupEnt) == null ? void 0 : _z.LinkerMobile) ?? "" : ((_B = (_A = info.value) == null ? void 0 : _A.UnloadEnt) == null ? void 0 : _B.Mobile) ?? "",
        longitude: type === 1 ? (_D = (_C = info.value) == null ? void 0 : _C.SupEnt) == null ? void 0 : _D.Logitude : (_F = (_E = info.value) == null ? void 0 : _E.UnloadEnt) == null ? void 0 : _F.Logitude,
        latitude: type === 1 ? (_H = (_G = info.value) == null ? void 0 : _G.SupEnt) == null ? void 0 : _H.Latitude : (_J = (_I = info.value) == null ? void 0 : _I.UnloadEnt) == null ? void 0 : _J.Latitude
      };
      mapModal.value.open(data);
    }
    const stepModal = common_vendor.ref();
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
        d: ["0", "2"].includes(info.value.EntryAuthened) ? 1 : "",
        e: info.value.EntryAuthened === "0"
      }, info.value.EntryAuthened === "0" ? {} : info.value.EntryAuthened === "2" ? {} : {}, {
        f: info.value.EntryAuthened === "2",
        g: info.value.EntryAuthened === "0"
      }, info.value.EntryAuthened === "0" ? {} : info.value.EntryAuthened === "2" ? {} : common_vendor.e({
        i: !info.value.StartTime && !info.value.EndTime || info.value.StartTime && common_vendor.unref(common_vendor.dayjs)().isAfter(info.value.StartTime) && !info.value.EndTime
      }, !info.value.StartTime && !info.value.EndTime || info.value.StartTime && common_vendor.unref(common_vendor.dayjs)().isAfter(info.value.StartTime) && !info.value.EndTime ? {} : !info.value.EndTime && info.value.StartTime && common_vendor.unref(common_vendor.dayjs)().isBefore(info.value.StartTime) ? {
        k: common_vendor.t(common_vendor.unref(common_vendor.dayjs)(info.value.StartTime).format("MM-DD HH:mm"))
      } : info.value.EndTime && info.value.StartTime && common_vendor.unref(common_vendor.dayjs)().isBefore(info.value.StartTime) ? {
        m: common_vendor.t(common_vendor.unref(common_vendor.dayjs)(info.value.StartTime).format("MM-DD HH:mm")),
        n: common_vendor.t(common_vendor.unref(common_vendor.dayjs)(info.value.EndTime).format("MM-DD HH:mm"))
      } : info.value.StartTime && common_vendor.unref(common_vendor.dayjs)().isAfter(info.value.StartTime) && info.value.EndTime && common_vendor.unref(common_vendor.dayjs)().isBefore(info.value.EndTime) || !info.value.StartTime && info.value.EndTime && common_vendor.unref(common_vendor.dayjs)().isBefore(info.value.EndTime) ? {
        p: common_vendor.t(common_vendor.unref(common_vendor.dayjs)(info.value.EndTime).format("MM-DD HH:mm"))
      } : {}, {
        j: !info.value.EndTime && info.value.StartTime && common_vendor.unref(common_vendor.dayjs)().isBefore(info.value.StartTime),
        l: info.value.EndTime && info.value.StartTime && common_vendor.unref(common_vendor.dayjs)().isBefore(info.value.StartTime),
        o: info.value.StartTime && common_vendor.unref(common_vendor.dayjs)().isAfter(info.value.StartTime) && info.value.EndTime && common_vendor.unref(common_vendor.dayjs)().isBefore(info.value.EndTime) || !info.value.StartTime && info.value.EndTime && common_vendor.unref(common_vendor.dayjs)().isBefore(info.value.EndTime)
      }), {
        h: info.value.EntryAuthened === "2",
        q: info.value.SupEnt
      }, info.value.SupEnt ? {
        r: common_vendor.t(info.value.SupEnt ? info.value.SupEnt.Name : ""),
        s: common_vendor.t(info.value.SupEnt ? info.value.SupEnt.Province : ""),
        t: common_vendor.t(info.value.SupEnt ? info.value.SupEnt.City : ""),
        v: common_vendor.t(info.value.SupEnt ? info.value.SupEnt.District : ""),
        w: common_vendor.t(info.value.SupEnt ? info.value.SupEnt.Address : ""),
        x: common_vendor.o((...args) => _ctx.selectAddress && _ctx.selectAddress(...args)),
        y: common_vendor.p({
          src: "/static/images/arrow.png",
          duration: 0,
          width: "24rpx",
          height: "24rpx"
        }),
        z: common_vendor.o(($event) => openMapModal(1))
      } : {}, {
        A: info.value.UnloadEnt
      }, info.value.UnloadEnt ? {
        B: common_vendor.t(info.value.UnloadEnt ? info.value.UnloadEnt.PlaceName : ""),
        C: common_vendor.t(info.value.UnloadEnt ? info.value.UnloadEnt.Province : ""),
        D: common_vendor.t(info.value.UnloadEnt ? info.value.UnloadEnt.City : ""),
        E: common_vendor.t(info.value.UnloadEnt ? info.value.UnloadEnt.District : ""),
        F: common_vendor.t(info.value.UnloadEnt ? info.value.UnloadEnt.Address : ""),
        G: common_vendor.o((...args) => _ctx.selectAddress && _ctx.selectAddress(...args)),
        H: common_vendor.p({
          src: "/static/images/arrow.png",
          duration: 0,
          width: "24rpx",
          height: "24rpx"
        }),
        I: common_vendor.o(($event) => openMapModal(2))
      } : {}, {
        J: info.value.MatList && info.value.MatList.length > 0
      }, info.value.MatList && info.value.MatList.length > 0 ? {
        K: common_vendor.f(info.value.MatList, (item, i, i0) => {
          return {
            a: "9e3db46e-3-" + i0,
            b: common_vendor.p({
              record: item,
              bill: info.value,
              ["border-bottom"]: i < info.value.MatList.length - 1
            })
          };
        }),
        L: common_vendor.o(confirm)
      } : {}, {
        M: info.value.OwnerEnt
      }, info.value.OwnerEnt ? common_vendor.e({
        N: common_vendor.t(info.value.OwnerEnt ? info.value.OwnerEnt.OwnerName : ""),
        O: common_vendor.t(info.value.OwnerEnt ? info.value.OwnerEnt.Linker : ""),
        P: common_vendor.t(info.value.OwnerEnt ? info.value.OwnerEnt.LinkerMobile : ""),
        Q: info.value.OwnerEnt && info.value.OwnerEnt.LinkerMobile
      }, info.value.OwnerEnt && info.value.OwnerEnt.LinkerMobile ? {
        R: common_vendor.o(takePhone),
        S: common_vendor.p({
          shape: "circle",
          color: "var(--page-bg)",
          ["custom-style"]: {
            height: "68rpx",
            color: "var(--main-color)",
            fontWeight: "bold"
          }
        })
      } : {}) : {}, {
        T: info.value.CarEnt
      }, info.value.CarEnt ? common_vendor.e({
        U: common_vendor.p({
          plate: info.value.CarEnt.Carno,
          color: info.value.CarEnt.Color
        }),
        V: common_vendor.t(info.value.CarEnt.CarType),
        W: info.value.DriverEnt
      }, info.value.DriverEnt ? {
        X: common_vendor.t(info.value.DriverEnt ? info.value.DriverEnt.NickName : ""),
        Y: common_vendor.t(info.value.DriverEnt ? info.value.DriverEnt.Mobile : "")
      } : {}) : {}, {
        Z: info.value.Memo
      }, info.value.Memo ? {
        aa: common_vendor.t(info.value.Memo)
      } : {}, {
        ab: common_vendor.t(info.value.CreatorTime),
        ac: common_vendor.sr(mapModal, "9e3db46e-6", {
          "k": "mapModal"
        }),
        ad: common_vendor.sr(stepModal, "9e3db46e-7", {
          "k": "stepModal"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/billDetail/billDetail.vue"]]);
wx.createPage(MiniProgramPage);

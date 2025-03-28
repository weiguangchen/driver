"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_index = require("../../../utils/index.js");
if (!Array) {
  const _easycom_uv_line2 = common_vendor.resolveComponent("uv-line");
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_my_drawer2 = common_vendor.resolveComponent("my-drawer");
  (_easycom_uv_line2 + _easycom_uv_image2 + _easycom_uv_button2 + _easycom_my_drawer2)();
}
const _easycom_uv_line = () => "../../../uni_modules/uv-line/components/uv-line/uv-line.js";
const _easycom_uv_image = () => "../../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_uv_button = () => "../../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_my_drawer = () => "../../../components/my-drawer/my-drawer.js";
if (!Math) {
  (_easycom_uv_line + _easycom_uv_image + _easycom_uv_button + _easycom_my_drawer)();
}
const _sfc_main = {
  __name: "MapDrawer",
  setup(__props, { expose: __expose }) {
    const { ctx } = common_vendor.getCurrentInstance();
    const drawer = common_vendor.ref();
    const mapContext = common_vendor.ref();
    common_vendor.onMounted(() => {
      mapContext.value = common_vendor.index.createMapContext("map", ctx);
    });
    function makePhone() {
      if (!info.phone) {
        return;
      }
      common_vendor.index.makePhoneCall({
        phoneNumber: info.phone
      });
    }
    function openApp() {
      common_vendor.index.openLocation({
        longitude: info.longitude,
        latitude: info.latitude,
        name: info.name,
        address: info.address
      });
    }
    const info = common_vendor.reactive({
      type: "",
      name: "",
      address: "",
      user: "",
      phone: ""
    });
    async function open(data) {
      console.log("打开地图 data", data);
      info.type = (data == null ? void 0 : data.type) ?? "";
      info.name = (data == null ? void 0 : data.name) ?? "";
      info.address = (data == null ? void 0 : data.address) ?? "";
      info.user = (data == null ? void 0 : data.user) ?? "";
      info.phone = (data == null ? void 0 : data.phone) ?? "";
      info.longitude = (data == null ? void 0 : data.longitude) ?? "";
      info.latitude = (data == null ? void 0 : data.latitude) ?? "";
      drawer.value.popup.open();
      await utils_index.sleep(300);
      const marker = {
        id: 123,
        longitude: data.longitude,
        latitude: data.latitude,
        iconPath: "/static/images/map-marker.png",
        width: "30rpx",
        height: "42rpx",
        customCallout: {
          display: "ALWAYS",
          anchorX: 0,
          anchorY: -12
        }
      };
      mapContext.value.addMarkers({
        markers: [marker],
        clear: true
      });
      mapContext.value.moveToLocation({
        longitude: info.longitude,
        latitude: info.latitude
      });
    }
    __expose({
      open
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(info.type === 1 ? "装货地" : "卸货地"),
        b: info.type === 1 ? 1 : "",
        c: info.type === 2 ? 1 : "",
        d: common_vendor.t(info.name),
        e: common_vendor.t(info.address),
        f: info.user || info.phone
      }, info.user || info.phone ? common_vendor.e({
        g: common_vendor.p({
          color: "#E3E9EF",
          margin: "28rpx 0 32rpx"
        }),
        h: info.user || info.phone
      }, info.user || info.phone ? common_vendor.e({
        i: info.user
      }, info.user ? {
        j: common_vendor.t(info.user)
      } : {}, {
        k: info.phone
      }, info.phone ? {
        l: common_vendor.t(info.phone)
      } : {}) : {}) : {}, {
        m: common_vendor.p({
          src: "/static/images/phone.png",
          width: "40rpx",
          height: "40rpx",
          duration: 0,
          ["custom-style"]: {
            marginRight: "4rpx"
          }
        }),
        n: common_vendor.o(makePhone),
        o: common_vendor.p({
          color: "#E7F9E9",
          ["custom-style"]: {
            height: "96rpx",
            border: "1px solid var(--main-color)",
            borderRadius: "16rpx",
            color: "var(--main-color)"
          }
        }),
        p: common_vendor.p({
          src: "/static/images/location.png",
          width: "40rpx",
          height: "40rpx",
          duration: 0,
          ["custom-style"]: {
            marginRight: "4rpx"
          }
        }),
        q: common_vendor.o(openApp),
        r: common_vendor.p({
          color: "linear-gradient( 270deg, #31CE57 0%, #07B130 100%)",
          ["custom-style"]: {
            height: "96rpx",
            borderRadius: "16rpx"
          }
        }),
        s: common_vendor.sr(drawer, "a251a19b-0", {
          "k": "drawer"
        }),
        t: common_vendor.p({
          showTitle: false,
          bgColor: "#FFFFFF",
          round: "12px"
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a251a19b"], ["__file", "/Users/wei/driver/pages/billDetail/components/MapDrawer.vue"]]);
wx.createComponent(Component);

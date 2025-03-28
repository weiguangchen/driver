"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  (_easycom_uv_image2 + _easycom_uv_button2)();
}
const _easycom_uv_image = () => "../../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_uv_button = () => "../../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_uv_image + _easycom_uv_button)();
}
const _sfc_main = {
  __name: "Item",
  props: {
    record: {
      default: () => {
      },
      type: Object
    }
  },
  setup(__props) {
    const props = __props;
    function toDetail() {
      common_vendor.index.navigateTo({
        url: `/pages/billDetail/billDetail?assignId=${props.record.Id}&supplyId=${props.record.Supply}`
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.record.OwnerEnt
      }, __props.record.OwnerEnt ? {
        b: common_vendor.t(__props.record.OwnerEnt ? __props.record.OwnerEnt.OwnerName : "")
      } : {}, {
        c: common_vendor.t(__props.record.CreatorTime),
        d: common_vendor.t(__props.record.MatList.length > 0 ? __props.record.MatList[0].MaterialName : ""),
        e: __props.record.MatList.length > 1
      }, __props.record.MatList.length > 1 ? {
        f: common_vendor.t(__props.record.MatList.length)
      } : {}, {
        g: __props.record.SupEnt
      }, __props.record.SupEnt ? common_vendor.e({
        h: common_vendor.f(3, (dot, k0, i0) => {
          return {};
        }),
        i: common_vendor.p({
          src: "/static/images/dot1.png",
          width: "16rpx",
          height: "16rpx",
          duration: 0,
          ["custom-style"]: {
            marginRight: "16rpx"
          }
        }),
        j: common_vendor.t(__props.record.SupEnt ? __props.record.SupEnt.City : ""),
        k: common_vendor.t(__props.record.SupEnt ? __props.record.SupEnt.SupplierName : ""),
        l: __props.record.District
      }, __props.record.District ? {
        m: common_vendor.t(__props.record.District)
      } : {}) : {}, {
        n: __props.record.UnloadEnt
      }, __props.record.UnloadEnt ? {
        o: common_vendor.p({
          src: "/static/images/dot2.png",
          width: "16rpx",
          height: "16rpx",
          duration: 0,
          ["custom-style"]: {
            marginRight: "16rpx"
          }
        }),
        p: common_vendor.t(__props.record.UnloadEnt ? __props.record.UnloadEnt.City : ""),
        q: common_vendor.t(__props.record.UnloadEnt ? __props.record.UnloadEnt.PlaceName : "")
      } : {}, {
        r: common_vendor.o(toDetail),
        s: common_vendor.p({
          text: "查看详情",
          color: "linear-gradient( 270deg, #31CE57 0%, #07B130 100%);",
          customStyle: {
            height: "92rpx",
            borderRadius: "16rpx"
          }
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/index/components/Item.vue"]]);
wx.createComponent(Component);

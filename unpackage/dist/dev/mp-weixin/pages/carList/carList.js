"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_my_plate2 = common_vendor.resolveComponent("my-plate");
  const _easycom_uv_radio2 = common_vendor.resolveComponent("uv-radio");
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_uv_radio_group2 = common_vendor.resolveComponent("uv-radio-group");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_my_confirm2 = common_vendor.resolveComponent("my-confirm");
  (_easycom_my_plate2 + _easycom_uv_radio2 + _easycom_uv_image2 + _easycom_uv_radio_group2 + _easycom_uv_button2 + _easycom_my_confirm2)();
}
const _easycom_my_plate = () => "../../components/my-plate/my-plate.js";
const _easycom_uv_radio = () => "../../uni_modules/uv-radio/components/uv-radio/uv-radio.js";
const _easycom_uv_image = () => "../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_uv_radio_group = () => "../../uni_modules/uv-radio/components/uv-radio-group/uv-radio-group.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_my_confirm = () => "../../components/my-confirm/my-confirm.js";
if (!Math) {
  (_easycom_my_plate + _easycom_uv_radio + _easycom_uv_image + _easycom_uv_radio_group + _easycom_uv_button + _easycom_my_confirm)();
}
const _sfc_main = {
  __name: "carList",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const { carList } = common_vendor.storeToRefs(userStore);
    const isDefault = common_vendor.ref();
    common_vendor.onShow(async () => {
      var _a;
      await userStore.getCarList();
      isDefault.value = ((_a = userStore.defaultCar) == null ? void 0 : _a.Carno) ?? "";
    });
    function add() {
      common_vendor.index.navigateTo({
        url: `/pages/addCar/addCar`,
        success(res) {
          res.eventChannel.emit("setData", {
            data: null
          });
        }
      });
    }
    const modal = common_vendor.ref();
    function remove(record) {
      modal.value.confirm({
        title: "确定删除车辆？",
        content: "您的运单记录不会被影响",
        cancelText: "再想想",
        confirmText: "删除",
        asyncClose: true,
        async confirm() {
          try {
            await api_index.DiabledDriverCar({
              id: record.Id
            });
            await userStore.getCarList();
            modal.value.close();
          } catch {
            modal.value.closeLoading();
          }
        }
      });
    }
    function edit(record) {
      common_vendor.index.navigateTo({
        url: `/pages/addCar/addCar`,
        success(res) {
          res.eventChannel.emit("setData", {
            data: record
          });
        }
      });
    }
    async function setDefault(carno) {
      common_vendor.index.showLoading({
        mask: true
      });
      await api_index.SetDriverCarDefault({
        carno
      });
      common_vendor.index.hideLoading();
      await userStore.getCarList();
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(carList), (item, k0, i0) => {
          return common_vendor.e({
            a: "7135ddef-1-" + i0 + ",7135ddef-0",
            b: common_vendor.p({
              customStyle: {
                marginBottom: "16rpx"
              },
              plate: item.Carno,
              color: item.Color
            }),
            c: common_vendor.t(item.Cartype),
            d: item === isDefault.value ? "bold" : "normal",
            e: item === isDefault.value ? "var(--main-color)" : "var(--content-color)",
            f: "7135ddef-2-" + i0 + ",7135ddef-0",
            g: common_vendor.p({
              name: item.Carno,
              activeColor: "var(--main-color)"
            }),
            h: item.Isdefault !== "1"
          }, item.Isdefault !== "1" ? {
            i: "7135ddef-3-" + i0 + ",7135ddef-0",
            j: common_vendor.p({
              src: "/static/images/remove.png",
              width: "32rpx",
              height: "32rpx",
              ["custom-style"]: {
                marginRight: "8rpx"
              },
              duration: 0
            }),
            k: common_vendor.o(($event) => remove(item), item.Id)
          } : {}, {
            l: "7135ddef-4-" + i0 + ",7135ddef-0",
            m: common_vendor.o(($event) => edit(item), item.Id),
            n: item.Cartype === "自卸车" ? 1 : "",
            o: item.Cartype === "半挂车" ? 1 : "",
            p: item.Cartype === "罐车" ? 1 : "",
            q: item.Id
          });
        }),
        b: common_vendor.p({
          src: "/static/images/edit.png",
          width: "32rpx",
          height: "32rpx",
          ["custom-style"]: {
            marginRight: "8rpx"
          },
          duration: 0
        }),
        c: common_vendor.o(setDefault),
        d: common_vendor.o(($event) => isDefault.value = $event),
        e: common_vendor.p({
          modelValue: isDefault.value
        }),
        f: common_vendor.o(add),
        g: common_vendor.p({
          text: "+ 添加车辆",
          color: "linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"
        }),
        h: common_vendor.sr(modal, "7135ddef-6", {
          "k": "modal"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/carList/carList.vue"]]);
wx.createPage(MiniProgramPage);

"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uv_form_item2 = common_vendor.resolveComponent("uv-form-item");
  const _easycom_uv_form2 = common_vendor.resolveComponent("uv-form");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_my_confirm2 = common_vendor.resolveComponent("my-confirm");
  (_easycom_uv_form_item2 + _easycom_uv_form2 + _easycom_uv_button2 + _easycom_my_confirm2)();
}
const _easycom_uv_form_item = () => "../../uni_modules/uv-form/components/uv-form-item/uv-form-item.js";
const _easycom_uv_form = () => "../../uni_modules/uv-form/components/uv-form/uv-form.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_my_confirm = () => "../../components/my-confirm/my-confirm.js";
if (!Math) {
  (CarNumber + _easycom_uv_form_item + SelectColor + SelectCarType + _easycom_uv_form + _easycom_uv_button + _easycom_my_confirm)();
}
const SelectColor = () => "./components/SelectColor.js";
const SelectCarType = () => "./components/SelectCarType.js";
const CarNumber = () => "./components/CarNumber.js";
const _sfc_main = {
  __name: "addCar",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    common_vendor.onMounted(() => {
      const instance = common_vendor.getCurrentInstance().proxy;
      const eventChannel = instance.getOpenerEventChannel();
      eventChannel.on("setData", function({ data }) {
        console.log("setData", data);
        if (data) {
          model.value = {
            Id: data.Id,
            Carno: data.Carno,
            Color: data.Color,
            Cartype: data.Cartype
          };
        }
        common_vendor.index.setNavigationBarTitle({
          title: data ? "编辑车辆" : "添加车辆"
        });
      });
    });
    const form = common_vendor.ref(null);
    const model = common_vendor.ref({
      Id: "",
      Carno: "",
      Color: "",
      Cartype: ""
    });
    const rules = common_vendor.ref({
      Carno: [{
        validator: (rule, value, callback) => {
          if (!value)
            return false;
          const arr = value.split("");
          const isOk1 = arr.slice(0, 7).every((m) => m !== " ");
          const isOk2 = arr.slice(0, 8).every((m) => m !== " ");
          return isOk1 || isOk2;
        },
        message: "请填写正确的车牌号"
      }],
      Color: {
        required: true,
        message: "请选择颜色",
        trigger: ["blur", "change"]
      },
      Cartype: {
        required: true,
        message: "请选择类型",
        trigger: ["blur", "change"]
      }
    });
    const loading = common_vendor.ref(false);
    function remove() {
      modal.value.confirm({
        title: "确定删除车辆？",
        content: "您的运单记录不会被影响",
        cancelText: "再想想",
        confirmText: "删除",
        asyncClose: true,
        async confirm() {
          try {
            await api_index.DiabledDriverCar({
              id: model.value.Id
            });
            await userStore.getCarList();
            common_vendor.index.showToast({
              title: "车辆删除成功",
              success() {
                common_vendor.index.navigateBack();
              }
            });
          } catch {
            modal.value.closeLoading();
          }
        }
      });
    }
    function submit() {
      loading.value = true;
      common_vendor.index.showLoading({
        mask: true
      });
      form.value.validate().then(() => api_index.UptOrNewDriverCar(model.value)).then(async () => {
        await userStore.getCarList();
        common_vendor.index.showToast({
          title: "车辆添加成功",
          success() {
            common_vendor.index.navigateBack();
          }
        });
      }).catch((err) => {
        console.log("err", err);
      }).finally(() => {
        common_vendor.index.hideLoading();
        loading.value = false;
      });
    }
    const modal = common_vendor.ref();
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => model.value.Carno = $event),
        b: common_vendor.p({
          modelValue: model.value.Carno
        }),
        c: common_vendor.p({
          labelPosition: "top",
          label: "车牌号码",
          prop: "Carno"
        }),
        d: common_vendor.o(($event) => model.value.Color = $event),
        e: common_vendor.p({
          modelValue: model.value.Color
        }),
        f: common_vendor.p({
          labelPosition: "left",
          label: "车牌颜色",
          prop: "Color",
          borderBottom: true
        }),
        g: common_vendor.o(($event) => model.value.Cartype = $event),
        h: common_vendor.p({
          modelValue: model.value.Cartype
        }),
        i: common_vendor.p({
          labelPosition: "left",
          label: "车辆类型",
          prop: "Cartype"
        }),
        j: common_vendor.sr(form, "3faefa2e-0", {
          "k": "form"
        }),
        k: common_vendor.p({
          errorType: "toast",
          model: model.value,
          rules: rules.value,
          ["label-width"]: "140rpx"
        }),
        l: model.value.Id
      }, model.value.Id ? {
        m: common_vendor.o(remove),
        n: common_vendor.p({
          text: "删除车辆",
          color: "#FFF0EE",
          customTextStyle: {
            fontSize: "30rpx",
            color: "var(--red-color)"
          },
          ["custom-style"]: {
            borderRadius: "16rpx",
            height: "96rpx"
          }
        })
      } : {}, {
        o: common_vendor.o(submit),
        p: common_vendor.p({
          text: "确认添加",
          color: " linear-gradient( 270deg, #31CE57 0%, #07B130 100%)",
          loading: loading.value,
          ["custom-style"]: {
            borderRadius: "16rpx",
            height: "96rpx"
          },
          customTextStyle: {
            fontSize: "30rpx"
          }
        }),
        q: common_vendor.sr(modal, "3faefa2e-9", {
          "k": "modal"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/addCar/addCar.vue"]]);
wx.createPage(MiniProgramPage);

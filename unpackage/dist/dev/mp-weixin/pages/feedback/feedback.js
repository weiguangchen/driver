"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uv_textarea2 = common_vendor.resolveComponent("uv-textarea");
  const _easycom_uv_form_item2 = common_vendor.resolveComponent("uv-form-item");
  const _easycom_uv_upload2 = common_vendor.resolveComponent("uv-upload");
  const _easycom_uv_input2 = common_vendor.resolveComponent("uv-input");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_uv_form2 = common_vendor.resolveComponent("uv-form");
  (_easycom_uv_textarea2 + _easycom_uv_form_item2 + _easycom_uv_upload2 + _easycom_uv_input2 + _easycom_uv_button2 + _easycom_uv_form2)();
}
const _easycom_uv_textarea = () => "../../uni_modules/uv-textarea/components/uv-textarea/uv-textarea.js";
const _easycom_uv_form_item = () => "../../uni_modules/uv-form/components/uv-form-item/uv-form-item.js";
const _easycom_uv_upload = () => "../../uni_modules/uv-upload/components/uv-upload/uv-upload.js";
const _easycom_uv_input = () => "../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_uv_form = () => "../../uni_modules/uv-form/components/uv-form/uv-form.js";
if (!Math) {
  (_easycom_uv_textarea + _easycom_uv_form_item + _easycom_uv_upload + _easycom_uv_input + _easycom_uv_button + _easycom_uv_form)();
}
const _sfc_main = {
  __name: "feedback",
  setup(__props) {
    const fileList = common_vendor.ref([]);
    function afterRead(e) {
      setTimeout(() => {
        fileList.value = [{
          url: "https://via.placeholder.com/100x100.png/3c9cff"
        }, {
          url: "https://via.placeholder.com/100x100.png/ff0000"
        }, {
          url: "https://via.placeholder.com/100x100.png/3c9cff"
        }, {
          url: "https://via.placeholder.com/100x100.png/ff0000"
        }, {
          url: "https://via.placeholder.com/100x100.png/3c9cff"
        }, {
          url: "https://via.placeholder.com/100x100.png/ff0000"
        }];
        model.pics = fileList.value;
      });
    }
    function deletePic(e) {
      fileList.value.splice(e.index, 1);
    }
    const model = common_vendor.reactive({});
    const rules = common_vendor.ref();
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => model.remark = $event),
        b: common_vendor.p({
          border: "none",
          placeholder: "描述您遇到的问题或提出的建议（不少于10个字）",
          maxlength: "300",
          count: true,
          height: "276rpx",
          disableDefaultPadding: false,
          placeholderStyle: {
            fontSize: "28rpx",
            color: ""
          },
          modelValue: model.remark
        }),
        c: common_vendor.p({
          label: "",
          prop: "remark",
          borderBottom: true
        }),
        d: common_vendor.o(afterRead),
        e: common_vendor.o(deletePic),
        f: common_vendor.p({
          fileList: fileList.value,
          name: "1",
          multiple: true,
          maxCount: 9,
          previewFullImage: true
        }),
        g: common_vendor.p({
          label: "",
          prop: "pics"
        }),
        h: common_vendor.o(($event) => model.phone = $event),
        i: common_vendor.p({
          border: "none",
          placeholder: "留下您的手机号或邮箱",
          modelValue: model.phone
        }),
        j: common_vendor.p({
          label: "",
          prop: "phone"
        }),
        k: common_vendor.p({
          text: "提交",
          color: "linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"
        }),
        l: common_vendor.sr("form", "43d04f29-0"),
        m: common_vendor.p({
          labelPosition: "left",
          model,
          rules: rules.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/feedback/feedback.vue"]]);
wx.createPage(MiniProgramPage);

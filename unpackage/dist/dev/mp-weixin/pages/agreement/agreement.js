"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uv_parse2 = common_vendor.resolveComponent("uv-parse");
  _easycom_uv_parse2();
}
const _easycom_uv_parse = () => "../../uni_modules/uv-parse/components/uv-parse/uv-parse.js";
if (!Math) {
  _easycom_uv_parse();
}
const _sfc_main = {
  __name: "agreement",
  setup(__props) {
    common_vendor.onLoad((options) => {
      console.log(options);
      getInfo(options.type);
    });
    const content = common_vendor.ref();
    async function getInfo(type) {
      var _a;
      const res = await api_index.GetProtocolList({
        type
      });
      content.value = ((_a = res == null ? void 0 : res[0]) == null ? void 0 : _a.Content) ?? "";
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          content: content.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/wei/driver/pages/agreement/agreement.vue"]]);
wx.createPage(MiniProgramPage);

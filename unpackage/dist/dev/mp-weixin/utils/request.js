"use strict";
const common_vendor = require("../common/vendor.js");
const utils_token = require("./token.js");
const stores_user = require("../stores/user.js");
const js_sdk_luchRequest_luchRequest_core_Request = require("../js_sdk/luch-request/luch-request/core/Request.js");
var request = new js_sdk_luchRequest_luchRequest_core_Request.Request();
const baseURL = "https://www.wwwxapp.cn:28065";
request.config.timeout = 6e4;
request.config.baseURL = baseURL;
request.interceptors.request.use((config) => {
  var _a;
  const tokenData = utils_token.getToken();
  config.header = {
    ...config.header,
    Authorization: tokenData ? `Bearer ${tokenData.token}` : "",
    ContentType: config.header["Content-Type"] ? config.header["Content-Type"] : "application/json"
  };
  config.data = {
    driverId: ((_a = tokenData == null ? void 0 : tokenData.userInfo) == null ? void 0 : _a.Id) ?? "",
    ...config.data
  };
  return config;
});
request.interceptors.response.use(
  function(response) {
    const userStore = stores_user.useUserStore();
    const code = response.data.code;
    if (code === 200) {
      return response.data.data;
    } else if (code === 600) {
      common_vendor.index.showModal({
        title: "提示",
        content: "登录过期，请重新登陆",
        showCancel: false,
        success(res) {
          if (res.confirm) {
            userStore.logout();
            common_vendor.index.reLaunch({
              url: "/pages/index/index"
            });
          }
        }
      });
    } else {
      return Promise.reject(response.data);
    }
  }
);
exports.request = request;

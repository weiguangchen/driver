import { getToken, setToken, removeToken } from "@/utils/token.js";
import { useUserStore } from "@/stores/user.js";

import Request from "@/js_sdk/luch-request/luch-request/index.js";
var request = new Request();

export const baseURL = process.env.BASE_URL;

// 设置超时
request.config.timeout = 60000;
//设置请求基地址
request.config.baseURL = baseURL;

//添加拦截器
request.interceptors.request.use((config) => {
  const { body } = request;

  const tokenData = getToken();
  config.header = {
    ...config.header,
    Authorization: tokenData ? `Bearer ${tokenData.token}` : "",
    ContentType: config.header["Content-Type"]
      ? config.header["Content-Type"]
      : "application/json",
  };
  config.data = {
    driverId: tokenData?.userInfo?.Id ?? "",
    // driverId: "661474977706409925",
    ...config.data,
  };
  // console.log('config',config)

  return config;
});

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
request.interceptors.response.use(function (response) {
  const userStore = useUserStore();
  // console.log('response',response)
  const code = response.data.code;
  if (code === 200) {
    return response.data.data;
  } else if (code === 600) {
    uni.showModal({
      title: "提示",
      content: "登录过期，请重新登陆",
      showCancel: false,
      success(res) {
        if (res.confirm) {
          userStore.logout();
          uni.reLaunch({
            url: "/pages/index/index",
          });
        }
      },
    });
  } else {
    return Promise.reject(response.data);
  }
});

export default request;

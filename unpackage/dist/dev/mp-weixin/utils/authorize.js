"use strict";
const common_vendor = require("../common/vendor.js");
const stores_location = require("../stores/location.js");
const authList = {
  userInfo: {
    apiName: ["getUserInfo"],
    authTitle: "需要使用你的用户信息",
    authContent: "需要使用你的用户信息，请确认授权"
  },
  userLocation: {
    apiName: ["getLocation", "startLocationUpdate"],
    authTitle: "请求授权当前位置",
    authContent: "您未开启地理位置权限，搜苗无法为您推荐附近门诊，无法提供取号、核销等服务。您确定暂不开启吗？"
  },
  address: {
    apiName: ["chooseAddress"],
    authTitle: "需要使用你的通讯地址",
    authContent: "需要使用你的通讯地址，请确认授权"
  },
  invoiceTitle: {
    apiName: ["chooseInvoiceTitle"],
    authTitle: "需要使用你的发票抬头",
    authContent: "需要使用你的发票抬头，请确认授权"
  },
  invoice: {
    apiName: ["chooseInvoice"],
    authTitle: "需要获取你的发票",
    authContent: "需要获取你的发票，请确认授权"
  },
  werun: {
    apiName: ["getWeRunData"],
    authTitle: "需要获取你的微信运动数据",
    authContent: "需要获取你的微信运动数据，请确认授权"
  },
  writePhotosAlbum: {
    apiName: ["saveImageToPhotosAlbum", "saveVideoToPhotosAlbum"],
    authTitle: "请求授权相册",
    authContent: "需要使用你的相册，请确认授权"
  }
};
const getWxSetting = (key) => {
  if (typeof key === "string" && !authList[key])
    return Promise.reject();
  return new Promise((resolve, reject) => {
    common_vendor.index.getSetting({
      success: async (res) => {
        var result = res.authSetting;
        if (result[`scope.${key}`] === false || !result[`scope.${key}`]) {
          common_vendor.index.authorize({
            scope: `scope.${key}`,
            success(res2) {
              resolve();
            },
            fail(err) {
              openSettingModal(key).then((res2) => {
                resolve();
              }).catch(() => {
                reject();
              });
            }
          });
        } else {
          resolve();
        }
      }
    });
  });
};
function openSettingModal(key) {
  return new Promise((resolve, reject) => {
    common_vendor.index.showModal({
      title: "请开启定位",
      content: "为了方便展示您的地理位置",
      confirmText: "开启定位",
      success(res) {
        if (res.confirm) {
          common_vendor.index.openSetting({
            success: async (res2) => {
              var result = res2.authSetting;
              console.log("openSetting success", result);
              if (result[`scope.${key}`] === false || !result[`scope.${key}`]) {
                reject();
              } else {
                resolve();
              }
            },
            fail(err) {
              console.log("openSetting fail", err);
              reject();
            }
          });
        }
        if (res.cancel) {
          reject();
        }
      },
      fail() {
        reject();
      }
    });
  });
}
const getLocationInfo = async () => {
  const useLocation = stores_location.useLocationStore();
  if (useLocation.location) {
    return useLocation.location;
  }
  function _getAuth() {
    return new Promise((resolve, reject) => {
      getWxSetting("userLocation").then(() => resolve()).catch(() => {
        reject();
      });
    });
  }
  function _getLocation() {
    return common_vendor.index.getLocation({
      type: "gcj02"
    }).then((res) => {
      return res;
    }).catch((err) => {
      return err;
    });
  }
  try {
    await _getAuth();
    const location = await _getLocation();
    useLocation.location = location;
    return location;
  } catch (err) {
    console.log("err", err);
    return Promise.reject();
  }
};
exports.getLocationInfo = getLocationInfo;

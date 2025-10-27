// import {
// 	regeo
// } from '@/api/map.js';
// import {
// 	getRegisterClinicCityList
// } from "@/api/home";
// import isArray from 'lodash/isArray';
// import {
// 	useLocationStore,
// 	storeToRefs
// } from '@/stores/location';
import { useLocationStore } from "@/stores/location.js";

/**
 * 微信授权
 */
const authList = {
  userInfo: {
    apiName: ["getUserInfo"],
    authTitle: "需要使用你的用户信息",
    authContent: "需要使用你的用户信息，请确认授权",
  },
  userLocation: {
    apiName: ["getLocation", "startLocationUpdate"],
    authTitle: "请求授权当前位置",
    authContent:
      "您未开启地理位置权限，搜苗无法为您推荐附近门诊，无法提供取号、核销等服务。您确定暂不开启吗？",
  },
  address: {
    apiName: ["chooseAddress"],
    authTitle: "需要使用你的通讯地址",
    authContent: "需要使用你的通讯地址，请确认授权",
  },
  invoiceTitle: {
    apiName: ["chooseInvoiceTitle"],
    authTitle: "需要使用你的发票抬头",
    authContent: "需要使用你的发票抬头，请确认授权",
  },
  invoice: {
    apiName: ["chooseInvoice"],
    authTitle: "需要获取你的发票",
    authContent: "需要获取你的发票，请确认授权",
  },
  werun: {
    apiName: ["getWeRunData"],
    authTitle: "需要获取你的微信运动数据",
    authContent: "需要获取你的微信运动数据，请确认授权",
  },
  writePhotosAlbum: {
    apiName: ["saveImageToPhotosAlbum", "saveVideoToPhotosAlbum"],
    authTitle: "请求授权相册",
    authContent: "需要使用你的相册，请确认授权",
  },
};
/**
 * @description: 返回值中只会出现小程序已经向用户请求过的权限
 * @param {String} 权限名称
 * @return {Boolean} 是有拥有权限
 */
export const getWxSetting = (key) => {
  if (typeof key === "string" && !authList[key]) return Promise.reject();
  return new Promise((resolve, reject) => {
    uni.getSetting({
      success: async (res) => {
        // console.log('res', res)
        var result = res.authSetting;
        // 用户拒绝过
        if (result[`scope.${key}`] === false || !result[`scope.${key}`]) {
          // 引导去授权页
          uni.authorize({
            scope: `scope.${key}`,
            success(res) {
              resolve();
            },
            fail(err) {
              openSettingModal(key)
                .then((res) => {
                  resolve();
                })
                .catch(() => {
                  reject();
                });
            },
          });
        } else {
          resolve();
        }
      },
    });
  });
};
// 用户拒绝后提示进入设置页
export function openSettingModal(key) {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: "请开启定位",
      content: "为了方便展示您的地理位置",
      confirmText: "开启定位",
      success(res) {
        if (res.confirm) {
          uni.openSetting({
            success: async (res) => {
              var result = res.authSetting;
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
            },
          });
        }
        if (res.cancel) {
          reject();
        }
      },
      fail() {
        reject();
      },
    });
  });
}

/**
 * 授权定位
 */
export const getLocationInfo = async () => {
  const useLocation = useLocationStore();
  // console.log('location',useLocation.location)
  // if(useLocation.location) {
  // 	// console.log('获取上次定位', useLocation.location)
  // 	return useLocation.location;
  // }
  function _getAuth() {
    return new Promise((resolve, reject) => {
      getWxSetting("userLocation")
        .then(() => resolve())
        .catch(() => {
          reject();
          // return openSettingModal('userLocation')
          // 	.then(() => resolve())
          // 	.catch(() => reject())
        });
    });
  }

  function _getLocation() {
    return uni
      .getLocation({
        type: "gcj02",
      })
      .then((res) => {
        // console.log(res)
        return res;
      })
      .catch((err) => {
        // console.log(err)
        return err;
      });
  }
  try {
    await _getAuth();
    const location = await _getLocation();
    console.log("授权定位", location);
    useLocation.location = location;
    return location;
  } catch (err) {
    console.log("err", err);
    return Promise.reject();
  }
};

import { defineStore } from "pinia";
import { setToken, removeToken } from "@/utils/token.js";
import { loginByMobile, getCarList } from "@/api/index.js";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      userInfo: {
        Id: "",
        Mobile: "",
        Nickname: "",
        Defaultcarno: "",
        Driverphoto: null,
        CreatorTime: "",
        EnabledMark: null,
      },
      carList: [],
      carConfig: {
        carsLimit: 0,
        dayUptLeft: 0,
        monthUptLeft: 0,
      },
    };
  },
  getters: {
    defaultCar: (state) => {
      return state.carList.find((m) => m.Isdefault === "1");
    },
  },
  actions: {
    async login(payload) {
      console.log("login", payload);
      const userInfo = await loginByMobile({
        ...payload,
      });
      console.log("userInfo", userInfo);
      this.userInfo = userInfo;
      setToken({
        userInfo,
        token: userInfo.Token,
      });
      return userInfo;
    },
    logout() {
      removeToken();
      this.setUserInfo({});
      this.carList = [];
    },
    setUserInfo(payload) {
      this.userInfo = payload;
    },
    async getCarList() {
      const res = await getCarList();
      console.log("carList", res);
      this.carList = res.carList;
      this.carConfig = {
        carsLimit: res?.carsLimit ?? 0,
        dayUptLeft: res?.dayUptLeft ?? 0,
        monthUptLeft: res?.monthUptLeft ?? 0,
      };
    },
  },
});

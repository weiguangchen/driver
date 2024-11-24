"use strict";const e=require("../common/vendor.js"),o=require("../utils/token.js"),s=require("../api/index.js"),t=e.defineStore("user",{state:()=>({userInfo:{Id:"",Mobile:"",Nickname:"",Defaultcarno:"",Driverphoto:null,CreatorTime:"",EnabledMark:null},carList:[]}),getters:{defaultCar:e=>e.carList.find((e=>"1"===e.Isdefault))},actions:{async login(e){console.log("login",e);const t=await s.loginByMobile({...e});return console.log("userInfo",t),this.userInfo=t,o.setToken({userInfo:t,token:t.Token}),t},logout(){o.removeToken()},setUserInfo(e){this.userInfo=e},async getCarList(){const e=await s.getCarList();console.log("carList",e),this.carList=e}}});exports.useUserStore=t;

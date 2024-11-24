"use strict";const e=require("../../common/vendor.js"),o=require("../../stores/app.js"),n=require("../../utils/token.js"),t=require("../../api/index.js");if(!Array){(e.resolveComponent("uv-search")+e.resolveComponent("my-filter-drawer")+e.resolveComponent("uv-navbar")+e.resolveComponent("uv-tabs")+e.resolveComponent("my-empty")+e.resolveComponent("my-login-drawer")+e.resolveComponent("my-tabbar"))()}Math||((()=>"../../uni_modules/uv-search/components/uv-search/uv-search.js")+(()=>"../../components/my-filter-drawer/my-filter-drawer.js")+(()=>"../../uni_modules/uv-navbar/components/uv-navbar/uv-navbar.js")+(()=>"../../uni_modules/uv-tabs/components/uv-tabs/uv-tabs.js")+(()=>"../../components/my-empty/my-empty.js")+r+(()=>"../../components/my-login-drawer/my-login-drawer.js")+(()=>"../../components/my-tabbar/my-tabbar.js"))();const r=()=>"./components/item.js",a={__name:"waybill",setup(r){const a=o.useAppStore();e.onLoad((()=>{a.switchTab(1)}));const l=e.ref(!1);function s(e){l.value=e.show}const u=e.ref(0);e.onMounted((()=>{let o=e.index.getMenuButtonBoundingClientRect();console.log("menuButtonInfo",o),u.value=o.width+20}));const i=e.ref(""),c=e.ref([{name:"全部",value:""},{name:"已接单",value:"10"},{name:"已完成",value:"8"},{name:"已取消",value:"9"}]);function v({value:e}){i.value=e,w()}function m(){n.getToken()||d()}const f=e.ref(),p=e.ref();function d(){p.value.open()}function b(){e.index.reLaunch({url:"/pages/waybill/waybill"})}const y=e.ref([]);async function w(){const e=await t.GetOnwayDriver({status:i.value});y.value=e.onwayList}return e.onShow((()=>{n.getToken()&&w()})),(o,t)=>e.e({a:"overflow:"+(l.value?"hidden":"visible"),b:e.o(m),c:e.o((e=>o.keyword=e)),d:e.p({placeholder:"搜索运单号、车牌",showAction:!1,modelValue:o.keyword}),e:e.sr(f,"093f1fb7-2,093f1fb7-0",{k:"filter"}),f:e.o(s),g:`${u.value}px`,h:e.p({placeholder:!0,"left-icon":""}),i:e.o(v),j:e.p({activeStyle:{fontWeight:"bold",color:"var(--title-color)"},inactiveStyle:{color:"var(--sub-color)"},lineWidth:"32rpx",lineHeight:"8rpx",list:c.value,scrollable:!1,lineColor:"var(--main-color)",customStyle:{background:"#ffffff"}}),k:!e.unref(n.getToken)()},e.unref(n.getToken)()?0===y.value.length?{}:{o:e.f(y.value,((o,n,t)=>({a:o.Id,b:e.o(w,o.Id),c:"093f1fb7-6-"+t,d:e.p({record:o})})))}:{l:e.o(d),m:e.p({showButton:!0,buttonText:"登录",text:"登录后查看运单"})},{n:0===y.value.length,p:e.sr(p,"093f1fb7-7",{k:"loginDrawer"}),q:e.o(b)})}};wx.createPage(a);

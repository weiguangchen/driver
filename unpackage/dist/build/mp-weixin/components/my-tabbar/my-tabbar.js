"use strict";const e=require("../../common/vendor.js"),t=require("../../stores/app.js");if(!Array){(e.resolveComponent("uv-tabbar-item")+e.resolveComponent("uv-tabbar"))()}Math||((()=>"../../uni_modules/uv-tabbar/components/uv-tabbar-item/uv-tabbar-item.js")+(()=>"../../uni_modules/uv-tabbar/components/uv-tabbar/uv-tabbar.js"))();const a={__name:"my-tabbar",setup(a){const o=t.useAppStore(),{tabbarList:r,tabbarValue:n}=e.storeToRefs(o);function s(t){console.log("index",t),e.index.switchTab({url:r.value[t].pagePath,success(){n.value=t}})}return(t,a)=>({a:e.f(e.unref(r),((t,a,o)=>({a:t.selectedIconPath,b:t.iconPath,c:t.text,d:"131ef261-1-"+o+",131ef261-0",e:e.p({text:t.text})}))),b:e.o(s),c:e.p({activeColor:"var(--main-color)",inactiveColor:"var(--sub-color)",value:e.unref(n)})})}};wx.createComponent(a);

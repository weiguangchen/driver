"use strict";const e=require("../../../uv-ui-tools/libs/function/colorGradient.js"),i=require("../../../uv-ui-tools/libs/mixin/mpMixin.js"),o=require("../../../uv-ui-tools/libs/mixin/mixin.js"),t=require("./props.js"),r=require("../../../../common/vendor.js"),n={name:"uv-loading-icon",mixins:[i.mpMixin,o.mixin,t.props],data:()=>({array12:Array.from({length:12}),aniAngel:360,webviewHide:!1,loading:!1}),computed:{otherBorderColor(){const i=e.colorGradient(this.color,"#ffffff",100)[80];return"circle"===this.mode?this.inactiveColor?this.inactiveColor:i:"transparent"}},watch:{show(e){}},mounted(){this.init()},methods:{init(){setTimeout((()=>{}),20)},addEventListenerToWebview(){const e=getCurrentPages(),i=e[e.length-1].$getAppWebview();i.addEventListener("hide",(()=>{this.webviewHide=!0})),i.addEventListener("show",(()=>{this.webviewHide=!1}))}}};const s=r._export_sfc(n,[["render",function(e,i,o,t,n,s){return r.e({a:e.show},e.show?r.e({b:!n.webviewHide},n.webviewHide?{}:r.e({c:"spinner"===e.mode},"spinner"===e.mode?{d:r.f(n.array12,((e,i,o)=>({a:i})))}:{},{e:r.n(`uv-loading-icon__spinner--${e.mode}`),f:e.color,g:e.$uv.addUnit(e.size),h:e.$uv.addUnit(e.size),i:e.color,j:s.otherBorderColor,k:s.otherBorderColor,l:s.otherBorderColor,m:`${e.duration}ms`,n:"semicircle"===e.mode||"circle"===e.mode?e.timingFunction:""}),{o:e.text},e.text?{p:r.t(e.text),q:r.s({fontSize:e.$uv.addUnit(e.textSize),color:e.textColor}),r:r.s(e.$uv.addStyle(e.textStyle))}:{},{s:r.s(e.$uv.addStyle(e.customStyle)),t:r.n(e.vertical&&"uv-loading-icon--vertical")}):{})}],["__scopeId","data-v-3dff3dce"]]);wx.createComponent(s);
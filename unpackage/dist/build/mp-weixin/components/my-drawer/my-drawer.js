"use strict";const e=require("../../common/vendor.js");if(!Array){(e.resolveComponent("uv-button")+e.resolveComponent("uv-popup"))()}Math||((()=>"../../uni_modules/uv-button/components/uv-button/uv-button.js")+(()=>"../../uni_modules/uv-popup/components/uv-popup/uv-popup.js"))();const t={__name:"my-drawer",props:{showTitle:{default:!0,type:Boolean},title:{default:""},height:{default:440},duration:{type:[String,Number],default:300},zIndex:{type:[String,Number],default:10075},overlay:{type:Boolean,default:!0},closeOnClickOverlay:{type:Boolean,default:!0},overlayOpacity:{type:[Number,String],default:.4},overlayStyle:{type:[Object,String],default:""},round:{type:[Number,String],default:12},closeable:{type:Boolean,default:!0},closeIconPos:{type:String,default:"top-right"},bgColor:{type:String,default:"#F2F4F7"},showConfirmButton:{type:Boolean,default:!1},confirmText:{default:"确认",type:String},asyncClose:{type:Boolean,default:!1}},emits:["maskClick","change","confirm"],setup(t,{expose:o,emit:l}){const{ctx:n}=e.getCurrentInstance(),a=t,r=l,u=e.ref(null),s=e.computed((()=>i.value<a.height?i.value:a.height)),i=e.ref(0);async function c(t){await e.nextTick$1(),r("change",t),t.show&&p()}async function p(){let e=await n.$uv.getRect(".scroll-view-wrapper");i.value=e.height}const f=e.ref(!1);function d(){a.asyncClose?f.value=!0:u.value.close(),r("confirm")}return o({resize:p,popup:u,closeLoading:function(){f.value=!1}}),(o,l)=>e.e({a:t.showTitle},t.showTitle?e.e({b:o.$slots.title},o.$slots.title?{}:{c:e.t(t.title)}):{},{d:`${s.value}px`,e:t.showConfirmButton||o.$slots.footer},t.showConfirmButton||o.$slots.footer?{f:e.o(d),g:e.p({text:t.confirmText,color:"linear-gradient( 270deg, #31CE57 0%, #07B130 100%);",loading:f.value,"custom-style":{borderRadius:"16rpx",height:"96rpx",fontWeight:"bold",fontSize:"30rpx"}})}:{},{h:e.sr(u,"5cff7666-0",{k:"popup"}),i:e.o(c),j:e.p({mode:"bottom","custom-style":{minHeight:"100rpx"},duration:t.duration,overlay:t.overlay,bgColor:t.bgColor,zIndex:t.zIndex,overlayOpacity:t.overlayOpacity,overlayStyle:t.overlayStyle,closeOnClickOverlay:t.closeOnClickOverlay,closeable:t.closeable,closeIconPos:t.closeIconPos,round:t.round,safeAreaInsetBottom:!0})})}},o=e._export_sfc(t,[["__scopeId","data-v-5cff7666"]]);wx.createComponent(o);
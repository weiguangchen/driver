"use strict";const o=require("../../../common/vendor.js"),e=require("../../../utils/index.js"),l=require("../../../api/index.js"),i=require("../../../utils/token.js");if(!Array){(o.resolveComponent("uv-button")+o.resolveComponent("uv-switch")+o.resolveComponent("uv-form-item")+o.resolveComponent("my-number-box")+o.resolveComponent("uv-form")+o.resolveComponent("my-drawer"))()}Math||((()=>"../../../uni_modules/uv-button/components/uv-button/uv-button.js")+(()=>"../../../uni_modules/uv-switch/components/uv-switch/uv-switch.js")+(()=>"../../../uni_modules/uv-form/components/uv-form-item/uv-form-item.js")+(()=>"../../../components/my-number-box/my-number-box.js")+(()=>"../../../uni_modules/uv-form/components/uv-form/uv-form.js")+(()=>"../../../components/my-drawer/my-drawer.js"))();const t={options:{virtualHost:!0}},n=Object.assign(t,{__name:"Material",props:{borderBottom:{default:!1},record:{default:()=>{}},bill:{default:()=>{}}},emits:["confirm"],setup(t,{emit:n}){const r=t,a=o.computed((()=>["0","2"].includes(r.bill.EntryAuthened)||"1"===r.bill.EntryAuthened&&"0"===r.record.ReceiveAble)),d=n,u=o.reactive({FullLoad:"0",Load:0}),c=o.reactive({Load:[{require:!0,message:"请填写预计总重"}]});async function s(e){console.log("val",e),await o.nextTick$1(),v.value.resize()}o.watchEffect((()=>{r.record&&(u.FullLoad=r.record.FullLoad,u.Load=r.record.Load)}));const m=o.computed((()=>{var e,l,i,t,n,a;const d={"半挂车":"bgTare","自卸车":"zxTare","罐车":"gcTare"},c=(null==(l=null==(e=r.bill)?void 0:e.CarEnt)?void 0:l.CarType)??"",s=(null==d?void 0:d[c])??0,m=(null==(t=null==(i=r.bill)?void 0:i.ConfigEnt)?void 0:t[s])??0;return"1"===u.FullLoad?o.Big((null==(a=null==(n=r.bill)?void 0:n.ConfigEnt)?void 0:a.fullLoadGross)||0).minus(m).toFixed(2):o.Big(u.Load||0).minus(m).toFixed(2)})),v=o.ref();function f(){v.value.popup.open()}async function p(){var t,n,a,c,s;await o.index.hideKeyboard(),await e.sleep(200);try{const e=i.getToken(),f={AssignId:r.bill.Id,SupplyId:null==(n=null==(t=r.bill)?void 0:t.SupEnt)?void 0:n.Id,Customer:r.bill.OwnerEnt.Id,DriverId:null==(a=null==e?void 0:e.userInfo)?void 0:a.Id,Material:r.record.Material,MatName:r.record.MaterialName,FullLoad:u.FullLoad,Load:"1"===u.FullLoad?null==(s=null==(c=null==r?void 0:r.bill)?void 0:c.ConfigEnt)?void 0:s.fullLoadGross:u.Load,Suttle:m.value};console.log("接单参数",f),await l.DriverMakeOnway(f),o.index.showToast({title:"接单成功",icon:"none"}),d("confirm"),v.value.popup.close()}catch(f){console.log(f),o.index.showToast({title:null==f?void 0:f.data,icon:"none"}),v.value.closeLoading()}}return(e,l)=>o.e({a:o.t(t.record.MaterialName),b:"0"===t.record.ReceiveAble},"0"===t.record.ReceiveAble?{}:"1"===t.record.Limittype?{d:o.t(t.record.LeftWeight)}:"2"===t.record.Limittype?{f:o.t(t.record.Lefttimes)}:{},{c:"1"===t.record.Limittype,e:"2"===t.record.Limittype,g:t.record.Realheight},t.record.Realheight?{h:o.t(t.record.Realheight)}:{},{i:o.o(f),j:o.p({disabled:a.value,shape:"circle",color:a.value?"#B0BECC":"linear-gradient( 270deg, #31CE57 0%, #07B130 100%)",text:a.value?"不可接":"接单","custom-style":{height:"68rpx"}}),k:t.borderBottom?1:"",l:t.borderBottom?1:"",m:"1"===t.bill.ConfigEnt.fullLoad},"1"===t.bill.ConfigEnt.fullLoad?{n:o.o(s),o:o.o((o=>u.FullLoad=o)),p:o.p({"active-color":"var(--main-color)",activeValue:"1",inactiveValue:"0",modelValue:u.FullLoad}),q:o.p({prop:"FullLoad",customStyle:{padding:"28rpx 0"}})}:{},{r:"0"===u.FullLoad},"0"===u.FullLoad?{s:o.t(t.bill.ConfigEnt&&t.bill.ConfigEnt.fullLoadMin?t.bill.ConfigEnt.fullLoadMin:0),t:o.t(t.bill.ConfigEnt&&t.bill.ConfigEnt.fullLoadMax?t.bill.ConfigEnt.fullLoadMax:""),v:o.o((o=>u.Load=o)),w:o.p({"decimal-length":"2",min:t.bill.ConfigEnt&&t.bill.ConfigEnt.fullLoadMin?t.bill.ConfigEnt.fullLoadMin:0,"min-limit-msg":o=>`重量最少为${o}吨`,max:t.bill.ConfigEnt&&t.bill.ConfigEnt.fullLoadMax?t.bill.ConfigEnt.fullLoadMax:void 0,"max-limit-msg":o=>`重量最多为${o}吨`,modelValue:u.Load}),x:o.p({labelPosition:"top",prop:"Load",customStyle:{padding:"28rpx 0"}})}:{},{y:o.sr("form","3b8bdccc-2,3b8bdccc-1"),z:o.p({labelPosition:"left",model:u,rules:c}),A:o.t(m.value),B:o.sr(v,"3b8bdccc-1",{k:"drawer"}),C:o.o(p),D:o.p({title:"设置预计装运量",showConfirmButton:!0,confirmText:"确认接单",bgColor:"#FFFFFF",asyncClose:!0})})}}),r=o._export_sfc(n,[["__scopeId","data-v-3b8bdccc"]]);wx.createComponent(r);

"use strict";const e=require("../../common/vendor.js"),a=require("../../stores/user.js"),o=require("../../api/index.js");if(!Array){(e.resolveComponent("my-plate")+e.resolveComponent("uv-radio")+e.resolveComponent("uv-image")+e.resolveComponent("uv-radio-group")+e.resolveComponent("uv-button")+e.resolveComponent("my-confirm"))()}Math||((()=>"../../components/my-plate/my-plate.js")+(()=>"../../uni_modules/uv-radio/components/uv-radio/uv-radio.js")+(()=>"../../uni_modules/uv-image/components/uv-image/uv-image.js")+(()=>"../../uni_modules/uv-radio/components/uv-radio-group/uv-radio-group.js")+(()=>"../../uni_modules/uv-button/components/uv-button/uv-button.js")+(()=>"../../components/my-confirm/my-confirm.js"))();const t={__name:"carList",setup(t){const r=a.useUserStore(),{carList:n}=e.storeToRefs(r),i=e.ref();function s(){e.index.navigateTo({url:"/pages/addCar/addCar",success(e){e.eventChannel.emit("setData",{data:null})}})}e.onShow((async()=>{var e;await r.getCarList(),i.value=(null==(e=r.defaultCar)?void 0:e.Carno)??""}));const d=e.ref();async function u(a){e.index.showLoading({mask:!0}),await o.SetDriverCarDefault({carno:a}),e.index.hideLoading(),await r.getCarList()}return(a,t)=>({a:e.f(e.unref(n),((a,t,n)=>e.e({a:"7135ddef-1-"+n+",7135ddef-0",b:e.p({customStyle:{marginBottom:"16rpx"},plate:a.Carno,color:a.Color}),c:e.t(a.Cartype),d:a===i.value?"bold":"normal",e:a===i.value?"var(--main-color)":"var(--content-color)",f:"7135ddef-2-"+n+",7135ddef-0",g:e.p({name:a.Carno,activeColor:"var(--main-color)"}),h:"1"!==a.Isdefault},"1"!==a.Isdefault?{i:"7135ddef-3-"+n+",7135ddef-0",j:e.p({src:"/static/images/remove.png",width:"32rpx",height:"32rpx","custom-style":{marginRight:"8rpx"},duration:0}),k:e.o((e=>{return t=a,void d.value.confirm({title:"确定删除车辆？",content:"您的运单记录不会被影响",cancelText:"再想想",confirmText:"删除",asyncClose:!0,async confirm(){try{await o.DiabledDriverCar({id:t.Id}),await r.getCarList(),d.value.close()}catch{d.value.closeLoading()}}});var t}),a.Id)}:{},{l:"7135ddef-4-"+n+",7135ddef-0",m:e.o((o=>{return t=a,void e.index.navigateTo({url:"/pages/addCar/addCar",success(e){e.eventChannel.emit("setData",{data:t})}});var t}),a.Id),n:"自卸车"===a.Cartype?1:"",o:"半挂车"===a.Cartype?1:"",p:"罐车"===a.Cartype?1:"",q:a.Id}))),b:e.p({src:"/static/images/edit.png",width:"32rpx",height:"32rpx","custom-style":{marginRight:"8rpx"},duration:0}),c:e.o(u),d:e.o((e=>i.value=e)),e:e.p({modelValue:i.value}),f:e.o(s),g:e.p({text:"+ 添加车辆",color:"linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"}),h:e.sr(d,"7135ddef-6",{k:"modal"})})}};wx.createPage(t);

"use strict";const e=require("../../../utils/dict.js"),o=require("../../../common/vendor.js"),t={name:"select-color",data:()=>({ColorDict:e.ColorDict,text:""}),props:{modelValue:{default:""}},watch:{modelValue:{handler(){const o=e.ColorDict.find((e=>e.value===this.modelValue));console.log("find",o),o&&(this.text=o.label)},immediate:!0}},methods:{showDrawer(){this.$refs.drawer.popup.open()},select(e){this.$emit("change",e),this.$emit("update:modelValue",e.value),this.$nextTick((()=>{this.$uv.formValidate(this,"change")})),this.$refs.drawer.popup.close()}}};if(!Array){(o.resolveComponent("uv-image")+o.resolveComponent("uv-input")+o.resolveComponent("my-drawer"))()}Math||((()=>"../../../uni_modules/uv-image/components/uv-image/uv-image.js")+(()=>"../../../uni_modules/uv-input/components/uv-input/uv-input.js")+(()=>"../../../components/my-drawer/my-drawer.js"))();const r=o._export_sfc(t,[["render",function(e,t,r,l,a,i){return{a:o.p({src:"/static/images/arrow.png",width:"18rpx",height:"18rpx",duration:0}),b:o.o((e=>a.text=e)),c:o.p({"input-align":"right",placeholder:"请选择",readonly:!0,border:"none","placeholder-style":"color:var(--intr-color);",modelValue:a.text}),d:o.o(((...e)=>i.showDrawer&&i.showDrawer(...e))),e:o.f(a.ColorDict,((e,t,l)=>o.e({a:"yellow"===e.value?1:"",b:"kelly"===e.value?1:"",c:"blue"===e.value?1:"",d:"gren"===e.value?1:"",e:o.t(e.label),f:r.modelValue===e.value},r.modelValue===e.value?{g:"7e16d024-3-"+l+",7e16d024-2",h:o.p({src:"/static/images/check.png",duration:0,width:"32rpx",height:"32rpx"})}:{},{i:r.modelValue===e.value?1:"",j:o.o((o=>i.select(e)))}))),f:o.sr("drawer","7e16d024-2"),g:o.p({title:"选择车牌颜色"})}}]]);wx.createComponent(r);
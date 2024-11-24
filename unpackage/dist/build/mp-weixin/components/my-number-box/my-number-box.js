"use strict";const t=require("../../uni_modules/uv-ui-tools/libs/mixin/mpMixin.js"),e=require("../../uni_modules/uv-ui-tools/libs/mixin/mixin.js"),i=require("../../uni_modules/uv-number-box/components/uv-number-box/props.js"),s=require("../../common/vendor.js"),n={name:"uv-number-box",mixins:[t.mpMixin,e.mixin,i.props],data:()=>({currentValue:"",longPressTimer:null}),watch:{watchChange(t){this.check()},value(t){t!==this.currentValue&&(this.currentValue=this.format(this.value))},modelValue(t){this.currentValue=this.formatter(this.format(this.modelValue))}},computed:{getCursorSpacing(){return this.$uv.getPx(this.cursorSpacing)},buttonStyle(){return t=>{const e={color:this.color};return this.isDisabled(t)&&(e.backgroundColor="#f7f8fa"),e}},inputStyle(){this.disabled||this.disabledInput;return{color:this.color}},watchChange(){return[this.integer,this.decimalLength,this.min,this.max]},isDisabled(){return t=>"plus"===t?this.disabled||this.disablePlus||this.currentValue>=this.max:this.disabled||this.disableMinus||this.currentValue<=this.min}},created(){this.init()},methods:{init(){const t=this.value||this.modelValue;let e=this.format(t);this.currentValue=this.formatter(e)},format(t){return t=""===(t=this.filter(t))?0:+t,t=Math.max(Math.min(this.max,t),this.min),null!==this.decimalLength&&(t=t.toFixed(this.decimalLength)),t},formatter:t=>`${t} 吨`,filter(t){return t=String(t).replace(/[^0-9.-]/g,""),this.integer&&-1!==t.indexOf(".")&&(t=t.split(".")[0]),t},check(){const t=this.format(this.currentValue);t!==this.currentValue&&(this.currentValue=t)},onFocus(t){this.$emit("focus",{...t.detail,name:this.name})},onBlur(t){let e=this.format(t.detail.value);this.asyncChange||this.$nextTick((()=>{this.$emit("input",e),this.$emit("update:modelValue",e),this.currentValue=e,this.$forceUpdate()})),this.$emit("blur",{...t.detail,name:this.name})},onInput(t){const{value:e=""}=t.detail||{};let i=this.filter(e);if(null!==this.decimalLength&&-1!==i.indexOf(".")){const t=i.split(".");i=`${t[0]}.${t[1].slice(0,this.decimalLength)}`}i=this.format(i),this.emitChange(i)},emitChange(t){this.asyncChange||this.$nextTick((()=>{this.$emit("input",t),this.$emit("update:modelValue",t),this.currentValue=this.formatter(t),this.$forceUpdate()})),this.$emit("change",{value:t,name:this.name})},onChange(){const{type:t}=this;if(this.isDisabled(t))return this.$emit("overlimit",t);const e="minus"===t?-this.step:+this.step,i=this.filter(this.currentValue);let s=this.format(this.add(+i,e));this.emitChange(s),this.$emit(t)},add(t,e){const i=Math.pow(10,10);return Math.round((t+e)*i)/i},clickHandler(t){this.type=t,this.onChange()},longPressStep(){this.clearTimeout(),this.longPressTimer=setTimeout((()=>{this.onChange(),this.longPressStep()}),250)},onTouchStart(t){this.longPress&&(this.clearTimeout(),this.type=t,this.longPressTimer=setTimeout((()=>{this.onChange(),this.longPressStep()}),600))},onTouchEnd(){this.longPress&&this.clearTimeout()},clearTimeout(){clearTimeout(this.longPressTimer),this.longPressTimer=null},clickUnit(){console.log(this.$refs.inputRef)}}};if(!Array){s.resolveComponent("uv-icon")()}Math;const o=s._export_sfc(n,[["render",function(t,e,i,n,o,l){return s.e({a:t.showMinus&&t.$slots.minus},t.showMinus&&t.$slots.minus?{b:s.o((t=>l.clickHandler("minus"))),c:s.o((t=>l.onTouchStart("minus"))),d:s.o(((...t)=>l.clearTimeout&&l.clearTimeout(...t)))}:t.showMinus?{f:s.p({name:"minus",color:l.isDisabled("minus")?"#c8c9cc":"var(--title-color)",size:"15",bold:!0,customStyle:t.iconStyle}),g:s.o((t=>l.clickHandler("minus"))),h:s.o((t=>l.onTouchStart("minus"))),i:s.o(((...t)=>l.clearTimeout&&l.clearTimeout(...t))),j:l.isDisabled("minus")?1:"",k:s.s(l.buttonStyle("minus"))}:{},{e:t.showMinus,l:t.disabledInput||t.disabled,m:l.getCursorSpacing,n:t.disabled||t.disabledInput?1:"",o:s.o(((...t)=>l.onBlur&&l.onBlur(...t))),p:s.o(((...t)=>l.onFocus&&l.onFocus(...t))),q:s.o([t=>o.currentValue=t.detail.value,(...t)=>l.onInput&&l.onInput(...t)]),r:s.s(l.inputStyle),s:o.currentValue,t:t.showPlus&&t.$slots.plus},t.showPlus&&t.$slots.plus?{v:s.o((t=>l.clickHandler("plus"))),w:s.o((t=>l.onTouchStart("plus"))),x:s.o(((...t)=>l.clearTimeout&&l.clearTimeout(...t)))}:t.showPlus?{z:s.p({name:"plus",color:l.isDisabled("plus")?"#c8c9cc":"var(--title-color)",size:"15",bold:!0,customStyle:t.iconStyle}),A:s.o((t=>l.clickHandler("plus"))),B:s.o((t=>l.onTouchStart("plus"))),C:s.o(((...t)=>l.clearTimeout&&l.clearTimeout(...t))),D:l.isDisabled("plus")?1:"",E:s.s(l.buttonStyle("plus"))}:{},{y:t.showPlus})}],["__scopeId","data-v-34e7287a"]]);wx.createComponent(o);
"use strict";const e=require("../../../../common/vendor.js"),o=require("../../../uv-ui-tools/libs/mixin/mpMixin.js"),i=require("../../../uv-ui-tools/libs/mixin/mixin.js"),t=require("./props.js"),s={name:"uv-search",emits:["click","input","change","clear","search","custom","focus","blur","clickIcon","update:modelValue"],mixins:[o.mpMixin,i.mixin,t.props],data(){return{keyword:"",showClear:!1,show:!1,focused:this.focus}},created(){this.keyword=this.modelValue},watch:{value(e){this.keyword=e},modelValue(e){this.keyword=e}},computed:{showActionBtn(){return!this.animation&&this.showAction}},methods:{keywordChange(){this.$emit("input",this.keyword),this.$emit("update:modelValue",this.keyword),this.$emit("change",this.keyword)},inputChange(e){this.keyword=e.detail.value,this.keywordChange()},clear(){this.keyword="",this.$nextTick((()=>{this.$emit("clear")})),this.keywordChange()},search(o){this.$emit("search",o.detail.value);try{e.index.hideKeyboard()}catch(i){}},custom(){this.$emit("custom",this.keyword);try{e.index.hideKeyboard()}catch(o){}},getFocus(){this.focused=!0,this.animation&&this.showAction&&(this.show=!0),this.$emit("focus",this.keyword)},blur(){setTimeout((()=>{this.focused=!1}),100),this.show=!1,this.$emit("blur",this.keyword)},clickHandler(){this.disabled&&this.$emit("click")},clickIcon(){this.$emit("clickIcon")}}};if(!Array){e.resolveComponent("uv-icon")()}Math;const r=e._export_sfc(s,[["render",function(o,i,t,s,r,c){return e.e({a:o.disabled},(o.disabled,{}),{b:e.o(c.clickIcon),c:e.p({size:o.searchIconSize,name:o.searchIcon,color:o.searchIconColor?o.searchIconColor:o.color}),d:e.o(((...e)=>c.blur&&c.blur(...e))),e:r.keyword,f:e.o(((...e)=>c.search&&c.search(...e))),g:e.o(((...e)=>c.inputChange&&c.inputChange(...e))),h:o.disabled,i:e.o(((...e)=>c.getFocus&&c.getFocus(...e))),j:o.focus,k:o.maxlength,l:o.placeholder,m:`color: ${o.placeholderColor}`,n:e.s({textAlign:o.inputAlign,color:o.color,backgroundColor:o.bgColor,height:o.$uv.addUnit(o.height)}),o:e.s(o.inputStyle),p:r.keyword&&o.clearabled&&r.focused},r.keyword&&o.clearabled&&r.focused?{q:e.p({name:"close",size:"11",color:"#ffffff",customStyle:"line-height: 12px"}),r:e.o(((...e)=>c.clear&&c.clear(...e)))}:{},{s:e.s({backgroundColor:o.bgColor,borderRadius:"round"==o.shape?"100px":"4px",borderColor:o.borderColor}),t:e.s(o.$uv.addStyle(o.boxStyle)),v:e.t(o.actionText),w:e.s(o.actionStyle),x:e.n((c.showActionBtn||r.show)&&"uv-search__action--active"),y:e.o(((...e)=>c.custom&&c.custom(...e))),z:e.o(((...e)=>c.clickHandler&&c.clickHandler(...e))),A:e.s({margin:o.margin}),B:e.s(o.$uv.addStyle(o.customStyle))})}],["__scopeId","data-v-e3a99171"]]);wx.createComponent(r);
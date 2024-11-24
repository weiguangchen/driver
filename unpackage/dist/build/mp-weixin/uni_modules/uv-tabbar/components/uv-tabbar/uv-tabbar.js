"use strict";const e=require("../../../uv-ui-tools/libs/mixin/mpMixin.js"),t=require("../../../uv-ui-tools/libs/mixin/mixin.js"),i=require("./props.js"),r=require("../../../../common/vendor.js"),o={name:"uv-tabbar",mixins:[e.mpMixin,t.mixin,i.props],data:()=>({placeholderHeight:0}),computed:{tabbarStyle(){const e={zIndex:this.zIndex};return this.$uv.deepMerge(e,this.$uv.addStyle(this.customStyle))},updateChild(){return[this.value,this.activeColor,this.inactiveColor]},updatePlaceholder(){return[this.fixed,this.placeholder]}},watch:{updateChild(){this.updateChildren()},updatePlaceholder(){this.setPlaceholderHeight()}},created(){this.children=[]},mounted(){this.setPlaceholderHeight()},methods:{updateChildren(){this.children.length&&this.children.map((e=>e.updateFromParent()))},async setPlaceholderHeight(){this.fixed&&this.placeholder&&(await this.$uv.sleep(20),this.$uvGetRect(".uv-tabbar__content").then((({height:e=50})=>{this.placeholderHeight=e})))}}};if(!Array){r.resolveComponent("uv-safe-bottom")()}Math;const a=r._export_sfc(o,[["render",function(e,t,i,o,a,h){return r.e({a:e.safeAreaInsetBottom},(e.safeAreaInsetBottom,{}),{b:r.o(((...t)=>e.noop&&e.noop(...t))),c:r.n(e.border&&"uv-border-top"),d:r.n(e.fixed&&"uv-tabbar--fixed"),e:r.s(h.tabbarStyle),f:e.placeholder},e.placeholder?{g:a.placeholderHeight+"px"}:{})}],["__scopeId","data-v-274aef2b"]]);wx.createComponent(a);
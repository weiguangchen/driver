"use strict";const t=require("../../../../../common/vendor.js"),s={},a={name:"node",options:{virtualHost:!0},data:()=>({ctrl:{},isiOS:t.index.getSystemInfoSync().system.includes("iOS")}),props:{name:String,attrs:{type:Object,default:()=>({})},childs:Array,opts:Array},components:{node:()=>Promise.resolve().then((()=>r))},mounted(){this.$nextTick((()=>{for(this.root=this.$parent;"uv-parse"!==this.root.$options.name;this.root=this.root.$parent);}))},beforeDestroy(){},methods:{toJSON(){return this},play(s){if(this.root.$emit("play"),this.root.pauseVideo){let a=!1;const e=s.target.id;for(let t=this.root._videos.length;t--;)this.root._videos[t].id===e?a=!0:this.root._videos[t].pause();if(!a){const s=t.index.createVideoContext(e,this);s.id=e,this.root.playbackRate&&s.playbackRate(this.root.playbackRate),this.root._videos.push(s)}}},imgTap(s){const a=this.childs[s.currentTarget.dataset.i];a.a?this.linkTap(a.a):a.attrs.ignore||(this.root.$emit("imgtap",a.attrs),this.root.previewImg&&t.index.previewImage({showmenu:this.root.showImgMenu,current:parseInt(a.attrs.i),urls:this.root.imgList}))},imgLongTap(t){},imgLoad(t){const s=t.currentTarget.dataset.i;this.childs[s].w?(this.opts[1]&&!this.ctrl[s]||-1===this.ctrl[s])&&this.$set(this.ctrl,s,1):this.$set(this.ctrl,s,t.detail.width),this.checkReady()},checkReady(){this.root&&!this.root.lazyLoad&&(this.root._unloadimgs-=1,this.root._unloadimgs||setTimeout((()=>{this.root.getRect().then((t=>{this.root.$emit("ready",t)})).catch((()=>{this.root.$emit("ready",{})}))}),350))},linkTap(s){const a=s.currentTarget?this.childs[s.currentTarget.dataset.i]:{},e=a.attrs||s,r=e.href;this.root.$emit("linktap",Object.assign({innerText:this.root.getText(a.children||[])},e)),r&&("#"===r[0]?this.root.navigateTo(r.substring(1)).catch((()=>{})):r.split("?")[0].includes("://")?this.root.copyLink&&t.index.setClipboardData({data:r,success:()=>t.index.showToast({title:"链接已复制"})}):t.index.navigateTo({url:r,fail(){t.index.switchTab({url:r,fail(){}})}}))},mediaError(t){const s=t.currentTarget.dataset.i,a=this.childs[s];if("video"===a.name||"audio"===a.name){let t=(this.ctrl[s]||0)+1;if(t>a.src.length&&(t=0),t<a.src.length)return void this.$set(this.ctrl,s,t)}else"img"===a.name&&(this.opts[2]&&this.$set(this.ctrl,s,-1),this.checkReady());this.root&&this.root.$emit("error",{source:a.name,attrs:a.attrs,errMsg:t.detail.errMsg})}}};if(!Array){t.resolveComponent("node")()}"function"==typeof s&&s(a);const e=t._export_sfc(a,[["render",function(s,a,e,r,i,o){return{a:t.f(e.childs,((s,a,r)=>t.e({a:"img"===s.name&&!s.t&&(e.opts[1]&&!i.ctrl[a]||i.ctrl[a]<0)},"img"===s.name&&!s.t&&(e.opts[1]&&!i.ctrl[a]||i.ctrl[a]<0)?{b:t.s(s.attrs.style),c:i.ctrl[a]<0?e.opts[2]:e.opts[1]}:{},{d:"img"===s.name&&s.t},"img"===s.name&&s.t?{e:t.s("display:"+s.t),f:[{attrs:{style:s.attrs.style,src:s.attrs.src},name:"img"}],g:a,h:t.o(((...t)=>o.imgTap&&o.imgTap(...t)),a)}:"img"===s.name?{j:s.attrs.id,k:t.n("_img "+s.attrs.class),l:t.s((-1===i.ctrl[a]?"display:none;":"")+"width:"+(i.ctrl[a]||1)+"px;height:1px;"+s.attrs.style),m:s.attrs.src,n:s.h?s.w?"":"heightFix":"widthFix",o:e.opts[0],p:s.webp,q:e.opts[3]&&!s.attrs.ignore,r:!e.opts[3]||s.attrs.ignore,s:a,t:t.o(((...t)=>o.imgLoad&&o.imgLoad(...t)),a),v:t.o(((...t)=>o.mediaError&&o.mediaError(...t)),a),w:t.o(((...t)=>o.imgTap&&o.imgTap(...t)),a),x:t.o(((...t)=>o.imgLongTap&&o.imgLongTap(...t)),a)}:s.text?{z:t.t(s.text),A:"force"==e.opts[4]&&i.isiOS}:"br"===s.name?{}:"a"===s.name?{D:"039a7a4c-0-"+r,E:t.p({name:"span",childs:s.children,opts:e.opts}),F:s.attrs.id,G:t.n((s.attrs.href?"_a ":"")+s.attrs.class),H:t.s("display:inline;"+s.attrs.style),I:a,J:t.o(((...t)=>o.linkTap&&o.linkTap(...t)),a)}:"video"===s.name?{L:s.attrs.id,M:t.n(s.attrs.class),N:t.s(s.attrs.style),O:s.attrs.autoplay,P:s.attrs.controls,Q:s.attrs.loop,R:s.attrs.muted,S:s.attrs["object-fit"],T:s.attrs.poster,U:s.src[i.ctrl[a]||0],V:a,W:t.o(((...t)=>o.play&&o.play(...t)),a),X:t.o(((...t)=>o.mediaError&&o.mediaError(...t)),a)}:"audio"===s.name?{Z:s.attrs.id,aa:t.n(s.attrs.class),ab:t.s(s.attrs.style),ac:s.attrs.author,ad:s.attrs.controls,ae:s.attrs.loop,af:s.attrs.name,ag:s.attrs.poster,ah:s.src[i.ctrl[a]||0],ai:a,aj:t.o(((...t)=>o.play&&o.play(...t)),a),ak:t.o(((...t)=>o.mediaError&&o.mediaError(...t)),a)}:"table"===s.name&&s.c||"li"===s.name?t.e({am:"li"===s.name},"li"===s.name?{an:"039a7a4c-1-"+r,ao:t.p({childs:s.children,opts:e.opts})}:{ap:t.f(s.children,((s,a,i)=>t.e({a:"td"===s.name||"th"===s.name},"td"===s.name||"th"===s.name?{b:"039a7a4c-2-"+r+"-"+i,c:t.p({childs:s.children,opts:e.opts})}:{d:t.f(s.children,((s,a,o)=>t.e({a:"td"===s.name||"th"===s.name},"td"===s.name||"th"===s.name?{b:"039a7a4c-3-"+r+"-"+i+"-"+o,c:t.p({childs:s.children,opts:e.opts}),d:t.n("_"+s.name+" "+s.attrs.class),e:t.s(s.attrs.style)}:{f:t.f(s.children,((s,a,n)=>({a:"039a7a4c-4-"+r+"-"+i+"-"+o+"-"+n,b:t.p({childs:s.children,opts:e.opts}),c:a,d:t.n("_"+s.name+" "+s.attrs.class),e:t.s(s.attrs.style)}))),g:t.n("_"+s.name+" "+s.attrs.class),h:t.s(s.attrs.style)},{i:a})))},{e:a,f:t.n("_"+s.name+" "+s.attrs.class),g:t.s(s.attrs.style)})))},{aq:s.attrs.id,ar:t.n("_"+s.name+" "+s.attrs.class),as:t.s(s.attrs.style)}):s.c?2===s.c?{aB:t.f(s.children,((s,a,i)=>({a:a,b:t.s(s.f),c:"039a7a4c-5-"+r+"-"+i,d:t.p({name:s.name,attrs:s.attrs,childs:s.children,opts:e.opts})}))),aC:s.attrs.id,aD:t.n("_block _"+s.name+" "+s.attrs.class),aE:t.s(s.f+";"+s.attrs.style)}:{aF:t.s(s.f),aG:"039a7a4c-6-"+r,aH:t.p({name:s.name,attrs:s.attrs,childs:s.children,opts:e.opts})}:{av:s.attrs.id,aw:t.s("display:inline;"+s.f),ax:e.opts[4],ay:e.opts[4],az:[s]},{i:"img"===s.name,y:s.text,B:"br"===s.name,C:"a"===s.name,K:"video"===s.name,Y:"audio"===s.name,al:"table"===s.name&&s.c||"li"===s.name,at:!s.c,aA:2===s.c,aI:a}))),b:e.attrs.id,c:t.n("_block _"+e.name+" "+e.attrs.class),d:t.s(e.attrs.style)}}]]);wx.createComponent(e);const r=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"}));

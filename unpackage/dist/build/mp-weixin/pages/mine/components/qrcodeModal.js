"use strict";const e=require("../../../common/vendor.js"),o=require("../../../utils/token.js"),r=require("../../../stores/user.js");if(!Array){(e.resolveComponent("uv-image")+e.resolveComponent("uv-qrcode")+e.resolveComponent("my-popup"))()}Math||((()=>"../../../uni_modules/uv-image/components/uv-image/uv-image.js")+(()=>"../../../uni_modules/uv-qrcode/components/uv-qrcode/uv-qrcode.js")+(()=>"../../../components/my-popup/my-popup.js"))();const n={__name:"qrcodeModal",setup(n,{expose:s}){const t=r.useUserStore(),{userInfo:u}=e.storeToRefs(t),p=e.ref(),c=e.ref();const i=e.ref(!1);function a({show:e}){e&&!i.value&&c.value.make({success(){i.value=!0}})}return s({open:function(){o.getToken()&&p.value.open()}}),(o,r)=>e.e({a:e.p({src:"/static/images/mine/avatar.png",width:"120rpx",height:"120rpx",duration:0,"custom-style":{marginRight:"24rpx"}}),b:e.unref(u)},e.unref(u)?{c:e.t(e.unref(u).Nickname)}:{},{d:e.unref(u)},e.unref(u)?{e:e.t(e.unref(u).Mobile)}:{},{f:e.sr(c,"0f50c30e-2,0f50c30e-0",{k:"qrcode"}),g:e.p({start:!1,size:"430rpx",value:"https://h5.uvui.cn"}),h:e.sr(p,"0f50c30e-0",{k:"popup"}),i:e.o(a),j:e.p({mode:"center","custom-style":{minHeight:"300rpx"},bgColor:"none",duration:0})})}},s=e._export_sfc(n,[["__scopeId","data-v-0f50c30e"]]);wx.createComponent(s);

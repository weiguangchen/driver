"use strict";const e=require("../../common/vendor.js");if(!Array){e.resolveComponent("my-modal")()}Math;const o={__name:"my-confirm",emits:["confirm","cancel","close"],setup(o,{expose:l,emit:c}){const n=c,a=e.ref(),u=e.ref(),r=e.ref(),t=e.ref(),v=e.ref(),f=e.ref(),i=e.ref(),s=e.ref(),m=e.ref(),C=e.ref(),y=e.ref(),b=e.ref(),d=e.ref(),p=e.ref(),x=e.ref(),h=e.ref();function w(){n("confirm"),p.value&&p.value()}function g(){n("cancel"),x.value&&x.value()}function k(){n("close"),h.value&&h.value()}return l({confirm:function({title:e,content:o,showCancelButton:l,cancelText:c,cancelColor:n,showConfirmButton:w,confirmText:g,confirmColor:k,confirmBgColor:B,buttonReverse:L,asyncClose:O,closeOnClickOverlay:T,confirm:_,cancel:j,close:q}){u.value=e,r.value=o,t.value=l??!0,v.value=c??"取消",f.value=n,i.value=w??!0,s.value=g??"好的",m.value=k,C.value=B??"#F15948",y.value=L??!1,b.value=O??!1,d.value=T??!0,p.value=_,x.value=j,h.value=q,a.value.open()},close:function(){a.value.close()},closeLoading:function(){a.value.closeLoading()}}),(o,l)=>({a:e.sr(a,"5157ea7e-0",{k:"modal"}),b:e.o(w),c:e.o(g),d:e.o(k),e:e.p({title:u.value,content:r.value,"show-cancel-button":t.value,"cancel-text":v.value,"cancel-color":f.value,"show-confirm-button":i.value,"confirm-text":s.value,"confirm-color":m.value,"confirm-bg-color":C.value,"button-reverse":y.value,"async-close":b.value,"close-on-click-overlay":d.value})})}};wx.createComponent(o);

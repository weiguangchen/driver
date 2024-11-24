"use strict";const e=require("../../../../common/vendor.js"),t=require("../helpers/buildURL.js"),a=require("../core/buildFullPath.js"),r=require("../core/settle.js"),l=require("../utils.js"),i=(e,t)=>{let a={};return e.forEach((e=>{l.isUndefined(t[e])||(a[e]=t[e])})),a};exports.adapter=l=>new Promise(((o,d)=>{let n=t.buildURL(a.buildFullPath(l.baseURL,l.url),l.params,l.paramsSerializer);const s={url:n,header:l.header,complete:e=>{l.fullPath=n,e.config=l,e.rawData=e.data;try{let t=!1;const a=typeof l.forcedJSONParsing;if("boolean"===a)t=l.forcedJSONParsing;else if("object"===a){t=(l.forcedJSONParsing.include||[]).includes(l.method)}t&&"string"==typeof e.data&&(e.data=JSON.parse(e.data))}catch(t){}r.settle(o,d,e)}};let u;if("UPLOAD"===l.method){delete s.header["content-type"],delete s.header["Content-Type"];let t={filePath:l.filePath,name:l.name};const a=["timeout","formData"];u=e.index.uploadFile({...s,...t,...i(a,l)})}else if("DOWNLOAD"===l.method){const t=["timeout","filePath"];u=e.index.downloadFile({...s,...i(t,l)})}else{const t=["data","method","timeout","dataType","responseType","enableHttp2","enableQuic","enableCache","enableHttpDNS","httpDNSServiceId","enableChunked","forceCellularNetwork"];u=e.index.request({...s,...i(t,l)})}l.getTask&&l.getTask(u,l)}));

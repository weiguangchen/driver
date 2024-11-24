"use strict";
const utils_request = require("../utils/request.js");
function getPhoneByCode(data) {
  return utils_request.request.post("/api/CommBusinessData/GetDriverMobile", data);
}
function loginByMobile(data) {
  return utils_request.request.post("/api/permission/WechatApi/DriverLogin", data);
}
function UptDriverNickName(data) {
  return utils_request.request.post("/api/permission/WechatApi/UptDriverNickName", data);
}
function getCarList(data) {
  return utils_request.request.post("/api/permission/WechatApi/GetDriverCarList", data);
}
function UptOrNewDriverCar(data) {
  return utils_request.request.post("/api/permission/WechatApi/UptOrNewDriverCar", data);
}
function DiabledDriverCar(data) {
  return utils_request.request.post("/api/permission/WechatApi/DiabledDriverCar", data);
}
function SetDriverCarDefault(data) {
  return utils_request.request.post("/api/permission/WechatApi/SetDriverCarDefault", data);
}
function GetDriverWayCount(data) {
  return utils_request.request.post("/api/permission/WechatApi/GetDriverWayCount", data);
}
function GetProtocolList(data) {
  return utils_request.request.post("/api/permission/WechatApi/GetProtocolList", data);
}
function GetReceiveAssignList(data) {
  return utils_request.request.post("/api/permission/WechatApi/GetReceiveAssignList", data);
}
function GetDriverTakeTicketOwnerList(data) {
  return utils_request.request.post("/api/permission/WechatApi/GetDriverTakeTicketOwnerList", data);
}
function GetReceiveAssignDetail(data) {
  return utils_request.request.post("/api/permission/WechatApi/GetReceiveAssignDetail", data);
}
function GetOnwayDriver(data) {
  return utils_request.request.post("/api/permission/WechatApi/GetOnwayDriver", data);
}
function DriverMakeOnway(data) {
  return utils_request.request.post("/api/permission/WechatApi/DriverMakeOnway", data);
}
function DisableOnwayEnt(data) {
  return utils_request.request.post("/api/permission/WechatApi/DisableOnwayEnt", data);
}
function ArrivedConfirm(data) {
  return utils_request.request.post("/api/permission/WechatApi/ArrivedConfirm", data);
}
function UnloadConfirm(data) {
  return utils_request.request.post("/api/permission/WechatApi/UnloadConfirm", data);
}
exports.ArrivedConfirm = ArrivedConfirm;
exports.DiabledDriverCar = DiabledDriverCar;
exports.DisableOnwayEnt = DisableOnwayEnt;
exports.DriverMakeOnway = DriverMakeOnway;
exports.GetDriverTakeTicketOwnerList = GetDriverTakeTicketOwnerList;
exports.GetDriverWayCount = GetDriverWayCount;
exports.GetOnwayDriver = GetOnwayDriver;
exports.GetProtocolList = GetProtocolList;
exports.GetReceiveAssignDetail = GetReceiveAssignDetail;
exports.GetReceiveAssignList = GetReceiveAssignList;
exports.SetDriverCarDefault = SetDriverCarDefault;
exports.UnloadConfirm = UnloadConfirm;
exports.UptDriverNickName = UptDriverNickName;
exports.UptOrNewDriverCar = UptOrNewDriverCar;
exports.getCarList = getCarList;
exports.getPhoneByCode = getPhoneByCode;
exports.loginByMobile = loginByMobile;

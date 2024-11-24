//引入request.js文件
import request from '@/utils/request.js'

/**
 * 根据code获取手机号
 */
export function getPhoneByCode(data) {
	return request.post("/api/CommBusinessData/GetDriverMobile", data);
}
/**
 * 登录获取用户信息
*/
export function loginByMobile(data) {
	return request.post("/api/permission/WechatApi/DriverLogin", data);
}
/**
 * 修改昵称
*/
export function UptDriverNickName(data) {
	return request.post("/api/permission/WechatApi/UptDriverNickName", data);
}
/**
 * 获取车辆列表
 */
export function getCarList(data) {
	return request.post("/api/permission/WechatApi/GetDriverCarList", data);
}
/**
 * 添加司机车辆
 */
export function UptOrNewDriverCar(data) {
	return request.post("/api/permission/WechatApi/UptOrNewDriverCar", data);
}
/**
 * 删除司机车辆
 */
export function DiabledDriverCar(data) {
	return request.post("/api/permission/WechatApi/DiabledDriverCar", data);
}
/**
 * 设置默认车辆
*/
export function SetDriverCarDefault(data) {
	return request.post("/api/permission/WechatApi/SetDriverCarDefault", data);
}
/**
 * 获取货主列表
*/
export function GetGoodsCompanyList(data) {
	return request.post("/api/permission/WechatApi/GetGoodsCompanyList", data);
}

/**
 * 获取首页可接单列表
*/
export function GetGoodsOrderCanReceived(data) {
	return request.post("/api/permission/WechatApi/GetGoodsOrderCanReceived", data);
}
/**
 * 获取首页进行中的运单数
*/
export function GetDriverWayCount(data) {
	return request.post("/api/permission/WechatApi/GetDriverWayCount", data);
}

/**
 * 隐私协议
*/
export function GetProtocolList(data) {
	return request.post("/api/permission/WechatApi/GetProtocolList", data);
}

/**
 * 获取运单列表
*/
export function GetReceiveAssignList(data) {
	return request.post("/api/permission/WechatApi/GetReceiveAssignList", data);
}
/**
 * 获取货主
*/
export function GetDriverTakeTicketOwnerList(data) {
	return request.post("/api/permission/WechatApi/GetDriverTakeTicketOwnerList", data);
}
/**
 * 接单详情
*/
export function GetReceiveAssignDetail(data) {
	return request.post("/api/permission/WechatApi/GetReceiveAssignDetail", data);
}
/**
 * 接单详情
*/
export function GetOnwayDetail(data) {
	return request.post("/api/permission/WechatApi/GetOnwayDetail", data);
}

/**
 * 运单列表
*/
export function GetOnwayDriver(data) {
	return request.post("/api/permission/WechatApi/GetOnwayDriver", data);
}
/**
 * 司机接单
*/
export function DriverMakeOnway(data) {
	return request.post("/api/permission/WechatApi/DriverMakeOnway", data);
}
/**
 * 司机取消
*/
export function DisableOnwayEnt(data) {
	return request.post("/api/permission/WechatApi/DisableOnwayEnt", data);
}
/**
 * 司机到场
*/
export function ArrivedConfirm(data) {
	return request.post("/api/permission/WechatApi/ArrivedConfirm", data);
}
/**
 * 司机卸货
*/
export function UnloadConfirm(data) {
	return request.post("/api/permission/WechatApi/UnloadConfirm", data);
}



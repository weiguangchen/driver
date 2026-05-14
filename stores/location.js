import {
	defineStore
} from 'pinia';
import { GetLocationSwitch } from '@/api/index';
import { getWxSetting } from '@/utils/authorize';
import { locationTracker } from '@/utils/locationTracker';

export const useLocationStore = defineStore('location', {
	state: () => {
		return {
			// 当前坐标信息
			location: null,
			// 接口返回定位配置
			locationConfig: {
				LocationSwitch: '',  //定位开启标识：A-需要开启强制，B-需要开启非强制，C-建议开启，D-无需开启
				DistanceTriggerStep: '',   //小程序前端调用-距离步长(D米)，每移动距离D米记录一个点，不受速度影响
				TimeoutInterval: '',  //小程序前端调用-时间间隔(T秒)，超过T秒仍未移动D米，则强制记录一个点
				BatchSendCount: '',  //小程序前端调用-批量发送数量(X个)，每记够X个点传给后台
				TimeoutThreshold: '',  //小程序前端调用-超时阈值(W秒)，不够X个且距离上次传超过W秒，强制传给后台
				IconType: '',  //图标类型：Warning、Position。LocationSwitch值为A、B、C时返回此值，否则为null
				TipTitle: '',  //提示标题
				TipRemark: '',  //提示补充说明，标题下方说明文案
				OnwayList: []  //待上传轨迹运单列表  OnwayList[].Id 运单ID   OnwayList[].SupplyId 生产企业ID  OnwayList[].OnwayCode  运单编码
			},
			// 是否正在追踪定位
			isTracking: false,
			// 是否有定位权限
			userLocation: null,
			// 后台定位权限
			userLocationBackground: null,
		};
	},
	actions: {
		setLocation(payload) {
			this.location = payload;
		},
		async refreshLocationConfig() {
			// 如果没有后台定位权限，获取定位配置，先获取定位配置
			try {
				const res = await GetLocationSwitch();
				this.locationConfig = {
					...res,
				};
			}catch {}
		},
		async getLocation() {
			try {
				const location = await uni.getLocation({
					type: "gcj02",
					isHighAccuracy: true,
				});
				this.location = location;
				console.log('location', location);
				return location;
			}catch(err) {
				console.log('getLocation err', err);
				return null;
			}
		},
		/**
		 * 开启后台定位权限
		 */
		async getLocationConfig() {
			this.refreshLocationConfig();
			// 获取当前定位权限
			let hasUserLocationBackground = null;
			let hasUserLocation = null;
			try {
				await getWxSetting('userLocationBackground');
				const setting = await uni.getSetting();
				hasUserLocationBackground = !!setting.authSetting['scope.userLocationBackground'];
				hasUserLocation = !!setting.authSetting['scope.userLocation'];
			}catch {
				hasUserLocationBackground = false;
				hasUserLocation = false;
			}
			console.log('getLocationConfig hasUserLocationBackground',hasUserLocationBackground,'hasUserLocation',hasUserLocation);

			if(hasUserLocation || hasUserLocationBackground) {
				await this.getLocation();
			}

			this.userLocationBackground = hasUserLocationBackground;
			this.userLocation = hasUserLocation;

			return Promise.resolve({
				...this.locationConfig,
			});
		},
		/**
		 * 开启后台定位权限
		 */
		async getLocationAuth() {
			// 如果有定位权限，直接获取定位配置，定位配置异步获取，优化用户体验
			const setting = await uni.getSetting();
			this.userLocationBackground = !!setting.authSetting['scope.userLocationBackground'];
			this.userLocation = !!setting.authSetting['scope.userLocation'];
			console.log('getLocationAuth', setting, this.userLocationBackground, this.userLocation);
		},
	},
});
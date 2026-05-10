import {
	defineStore
} from 'pinia';
import { GetLocationSwitch } from '@/api/index';
import { getWxSetting } from '@/utils/authorize';

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
		};
	},
	actions: {
		setLocation(payload) {
			this.location = payload;
		},
		/**
		 * 开启后台定位权限
		 */
		async getLocationConfig() {
			// 如果有定位权限，直接获取定位配置，定位配置异步获取，优化用户体验
			const setting = await uni.getSetting();
			if(setting.authSetting['scope.userLocationBackground']) {
				GetLocationSwitch().then(res => {
					this.locationConfig = {
						...res,
					};
				});
				const location = await uni.getLocation({
					type: "gcj02",
					isHighAccuracy: true
				});
				this.location = location;
				return Promise.resolve({
					...this.locationConfig,
					// 是否展示提示窗体
					showModal: false,
				});
			}
			// 如果没有后台定位权限，获取定位配置，先获取定位配置
			try {
				uni.showLoading();
				const res = await GetLocationSwitch();
				this.locationConfig = {
					...res,
				};
			}catch {
				return Promise.reject({
					type: 'getLocationConfigError',
					message: '获取定位配置失败',
				});
			}finally {
				uni.hideLoading();
			}

			if(this.locationConfig.LocationSwitch === 'C' || this.locationConfig.LocationSwitch === 'D') {
				return Promise.resolve({
					...this.locationConfig,
					// 是否展示提示窗体
					showModal: false,
				});
			}
			// 获取当前定位权限
			let hasLocationAuth = false;
			try {
				await getWxSetting('userLocationBackground');
				const setting = await uni.getSetting();
				hasLocationAuth = setting.authSetting['scope.userLocationBackground'];
			}catch {
				hasLocationAuth = false;
			}
			console.log('hasLocationAuth',hasLocationAuth);

			if(hasLocationAuth) {
				const location = await uni.getLocation({
					type: "gcj02",
					isHighAccuracy: true
				});
				this.location = location;
				console.log('location', location);
			}

			return Promise.resolve({
				...this.locationConfig,
				// 是否展示提示窗体
				showModal: !hasLocationAuth,
			});
		}
	},
});
import {
	defineStore
} from 'pinia';
import { getToken } from '@/utils/token';
import { GetBannerList } from '@/api/index';


export const useAppStore = defineStore('app', {
	state: () => {
		return {
			tabbarValue: 0,
			tabbarList: [{
					"pagePath": "/pages/index/index",
					"iconPath": "/static/images/tabbar/home.png",
					"selectedIconPath": "/static/images/tabbar/home_selected.png",
					"text": "首页"
				},
				{
					"pagePath": "/pages/waybill/waybill",
					"iconPath": "/static/images/tabbar/bill.png",
					"selectedIconPath": "/static/images/tabbar/bill_selected.png",
					"text": "运单"
				},
				{
					"pagePath": "/pages/mine/mine",
					"iconPath": "/static/images/tabbar/mine.png",
					"selectedIconPath": "/static/images/tabbar/mine_selected.png",
					"text": "我的"
				}
			],
			waybillQuery: {},
			// 设备信息
			deviceInfo: {},
			appBaseInfo: {},
			bannerList: [],
		};
	},
	getters: {
		osType() {
			const system = this.deviceInfo?.system
			if (!system) return '未知系统'
			if (system.includes('HarmonyOS')) return 'HarmonyOS'
			if (system.includes('iOS')) return 'iOS'
			if (system.includes('Android')) return 'Android'
			return '其他'
		}
	},
	actions: {
		switchTab(index) {
			this.tabbarValue = index;
		},
		setWaybillQuery(query) {
			this.waybillQuery = query;
		},
		getDeviceInfo() {
			const deviceInfo = wx.getDeviceInfo();
			const appBaseInfo = wx.getAppBaseInfo();
			this.deviceInfo = deviceInfo;
			this.appBaseInfo = appBaseInfo;
			console.log('设备信息', deviceInfo, appBaseInfo);
			return deviceInfo;
		},
		/**
		 * 获取banner
		 */
		async getBanner() {
			console.log('获取banner', getToken());
			if (!getToken()) return;
			try {
				const res = await GetBannerList({
					userId: getToken()?.userInfo?.Id,
					terminalType: 2,
					osType: this.osType
				});
				this.bannerList = res;
			}catch {}
		},
	},
});
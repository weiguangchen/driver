import {
	defineStore
} from 'pinia';

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
		};
	},
	actions: {
		switchTab(index) {
			this.tabbarValue = index;
		}
	},
});
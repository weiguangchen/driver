import { ref, unref } from 'vue'

function useList(options) {
	
	const list = ref([])
	const status = ref('loading')
	const pageNo = ref(1)
	const pageSize = ref(10)
	const loading = ref(false)
	
	async function fetchData(refresh) {
		if ((!refresh && status.value === 'nomore') || status.value === 'loading') return;
		
		status.value = 'loading';
		try {
			let params = {
				...options.params
				pageNo: refresh ? 1 : unref(pageNo),
				pageSize: unref(pageSize)
			}
			let res = await options.api(params);
			list.value = refresh ? res.data.records : [...unref(list), ...res.data.records];
		
			if (this.dataListAll.length < res.data.total) {
				status.value = 'loadmore';
				pageNo.value = refresh ? 2 : unref(pageNo) + 1;
			} else {
				status.value = 'nomore'
			}
		} catch (err) {
			uni.showToast({
				icon: 'none',
				title: err.message
			})
		}
		
	}
	
	return {
		list,
		status,
		loading
	}
}
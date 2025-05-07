import { ref, unref } from "vue";

export default function useList({
  api,
  params = {},
  totalField = "cnt",
  listField = "list",
}) {
  const list = ref([]);
  const loading = ref(false);
  const noMore = ref(false);
  const pageSize = ref(10);
  const pageIndex = ref(1);
  const total = ref(0);

  // 获取数据
  async function fetchData(isRefresh = false, newParams = {}) {
    if (isRefresh) {
      if (loading.value) return;
    } else {
      if (loading.value || noMore.value) return;
    }
    try {
      loading.value = true;
      if (isRefresh) {
        pageIndex.value = 1;
      }
      const res = await api({
        // pageSize: pageSize.value,
        pageIndex: pageIndex.value,
        ...unref(params),
        ...newParams,
      });

      if (isRefresh) {
        list.value = res[listField] || [];
      } else {
        list.value = [...list.value, ...(res[listField] || [])];
      }
      total.value = res[totalField] || 0;
      noMore.value = list.value.length >= total.value;
      console.log(total.value, noMore.value);

      if (!noMore.value) {
        pageIndex.value++;
      }
    } catch (err) {
      console.log("err", err);
      uni.showToast({
        title: err.data || "加载失败",
        icon: "none",
      });
    } finally {
      loading.value = false;
    }
  }

  // 重置列表
  function reset() {
    list.value = [];
    pageIndex.value = 1;
    noMore.value = false;
    loading.value = false;
  }

  return {
    list,
    loading,
    noMore,
    total,
    fetchData,
    reset,
  };
}

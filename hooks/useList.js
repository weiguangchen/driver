import { ref, unref, computed, nextTick } from "vue";

export default function useList({
  api,
  params = {},
  totalField = "cnt",
  listField = "list",
  callback = null,
}) {
  // 当第一次请求时保存全部缓存数据
  const list = ref([]);
  const loading = ref(false);
  const noMore = computed(() => list.value.length >= total.value);
  const pageSize = ref(10);
  const pageIndex = ref(1);
  const total = ref(0);

  let lastFetchId = 0;

  // 获取数据
  async function fetchData(isRefresh = false, newParams = {}) {
    const fetchId = ++lastFetchId; // 每次请求自增
    const tempParams = {
      ...unref(params),
    };
    // await nextTick();
    console.log(
      "fetchId",
      fetchId,
      "lastFetchId",
      lastFetchId,
      "params",
      tempParams
    );
    if (isRefresh) {
      // if (loading.value) return;
    } else {
      if (loading.value || noMore.value) return;
    }
    try {
      loading.value = true;
      if (isRefresh) {
        list.value = [];
        total.value = 0;
        pageIndex.value = 1;
      }
      const res = await api({
        // pageSize: pageSize.value,
        pageIndex: pageIndex.value,
        ...tempParams,
        ...newParams,
      });
      if (fetchId !== lastFetchId) {
        console.log("不是最后一次请求，丢弃结果", fetchId, lastFetchId);
        return;
      } else {
        console.log("是最后一次请求，展示结果", fetchId, lastFetchId, res);
      }
      // 增加_isShow字段用来判断是否在前端展示
      const newList =
        res?.[listField]?.map((m) => ({
          ...m,
          _isShow: true,
        })) ?? [];

      if (isRefresh) {
        list.value = [...newList];
      } else {
        list.value = [...list.value, ...newList];
      }
      total.value = res[totalField] || 0;
      // console.log(total.value, noMore.value);
      callback?.(res);

      if (!noMore.value) {
        pageIndex.value++;
      }
    } catch (err) {
      console.log("err", err);
      if (fetchId === lastFetchId) {
        uni.showToast({
          title: err.data || "加载失败",
          icon: "none",
        });
      }
    } finally {
      if (fetchId === lastFetchId) {
        loading.value = false;
      }
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

<template>
  <scroll-view
    class="my-list"
    scroll-y
    :refresher-enabled="true"
    :refresher-triggered="triggered"
    @refresherrefresh="onRefresh"
    @scrolltolower="onLoadMore"
  >
    <view class="list-wrapper" v-if="list.length > 0">
        <view v-for="(item, index) in list" :key="item[rowKey]">
          <slot name="item" :item="item" :index="index"></slot>
        </view>
        <uv-load-more
          :status="noMore ? 'nomore' : loading ? 'loading' : 'loadmore'"
          color="#B0BECC"
        />
    </view>
    <view v-else class="empty-wrapper">
      <my-empty v-if="loading" img="/static/images/empty/loading.gif" text="查询中"/>
      <slot name="empty" v-else>
        <my-empty/>
      </slot>
    </view>
  </scroll-view>
</template>

<script>
export default {
  options: {
    virtualHost: true,
  },
};
</script>
<script setup>
import { ref } from "vue";
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  noMore: {
    type: Boolean,
    default: false,
  },
  rowKey: {
    type: String,
    default: "Id",
  },
  params: {
    type: Object,
    default: () => {},
  },
  fetchData: {
    type: Function,
    default: () => {},
  },
});

const emit = defineEmits(["refresh", "loadMore"]);

const triggered = ref(false);

async function onRefresh() {
  if (triggered.value) return;

  try {
    triggered.value = true;
    emit("refresh");
    await props.fetchData(true);
  } finally {
    triggered.value = false;
  }
}
async function onLoadMore() {
  if (props.loading || props.noMore) return;
  emit("loadMore");
  await props.fetchData();
}
</script>

<style lang="scss">
.my-list {
  flex: 1;
  height: 200px;
  .list-wrapper {
   padding: 24rpx;
  }
  .empty-wrapper {
    height: 100%;
    & > view {
      height: 100%;
    }
  }
}
</style>

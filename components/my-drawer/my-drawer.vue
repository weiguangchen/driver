<template>
  <root-portal>
    <uv-popup
      ref="popup"
      mode="bottom"
      :custom-style="{ minHeight: '100rpx' }"
      :duration="duration"
      :overlay="overlay"
      :bgColor="bgColor"
      :zIndex="zIndex"
      :overlayOpacity="overlayOpacity"
      :overlayStyle="overlayStyle"
      :closeOnClickOverlay="closeOnClickOverlay"
      :closeable="false"
      :closeIconPos="closeIconPos"
      :round="round"
      :safeAreaInsetBottom="false"
      @change="change"
      @close="close"
    >
      <view class="drawer-wrapper">
        <view class="title-wrapper" v-if="showTitle">
          <view class="title">
            <slot name="title" v-if="$slots.title"></slot>
            <template v-else>{{ title }}</template>
          </view>
          <uv-icon
            v-if="closeable"
            name="/static/images/ui/closeable.png"
            width="64rpx"
            height="64rpx"
            @click="handleClose"
          />
        </view>
        <scroll-view
          scroll-y="true"
          class="scroll-view"
          :style="{ height: `${scrollHeight}px` }"
        >
          <view class="scroll-view-wrapper">
            <slot></slot>
          </view>
        </scroll-view>
        <view class="modal-footer" v-if="showConfirmButton || $slots.footer">
          <slot name="footer">
            <uv-button
              :text="confirmText"
              color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"
              @click="confirm"
              :loading="loading"
              :custom-style="{
                borderRadius: '16rpx',
                height: '96rpx',
                fontWeight: 'bold',
                fontSize: '30rpx',
              }"
            />
          </slot>
        </view>
      </view>
    </uv-popup>
  </root-portal>
</template>

<script setup>
import { ref, unref, getCurrentInstance, nextTick, computed } from "vue";
import { onReady } from "@dcloudio/uni-app";
const { ctx } = getCurrentInstance();

const props = defineProps({
  showTitle: {
    default: true,
    type: Boolean,
  },
  title: {
    default: "",
  },
  height: {
    default: 440,
  },
  // 动画时长，单位ms
  duration: {
    type: [String, Number],
    default: 300,
  },
  // 层级
  zIndex: {
    type: [String, Number],
    default: 10075,
  },
  // 是否显示遮罩
  overlay: {
    type: Boolean,
    default: true,
  },
  // 点击遮罩是否关闭弹窗
  closeOnClickOverlay: {
    type: Boolean,
    default: true,
  },
  // 遮罩的透明度，0-1之间
  overlayOpacity: {
    type: [Number, String],
    default: 0.4,
  },
  // 自定义遮罩的样式
  overlayStyle: {
    type: [Object, String],
    default: "",
  },
  round: {
    type: [Number, String],
    default: 12,
  },
  // 是否显示关闭图标
  closeable: {
    type: Boolean,
    default: true,
  },
  // 自定义关闭图标位置，top-left为左上角，top-right为右上角，bottom-left为左下角，bottom-right为右下角
  closeIconPos: {
    type: String,
    default: "top-right",
  },
  bgColor: {
    type: String,
    default: "#F2F4F7",
  },
  showConfirmButton: {
    type: Boolean,
    default: false,
  },
  confirmText: {
    default: "确认",
    type: String,
  },
  asyncClose: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["maskClick", "change", "confirm", "close"]);

function maskClick() {
  emits("maskClick");
}

const popup = ref(null);

// scroll-view高度
const scrollHeight = computed(() => {
  return contentHeight.value < props.height
    ? contentHeight.value
    : props.height;
});
// 内容高度
const contentHeight = ref(0);
async function change(show) {
  await nextTick();
  emits("change", show);
  if (show.show) {
    resize();
  }
}

function close() {
  emits("close");
}

async function resize() {
  let rectInfo = await ctx.$uv.getRect(".scroll-view-wrapper");
  contentHeight.value = rectInfo.height;
}

const loading = ref(false);
function confirm() {
  if (props.asyncClose) {
    loading.value = true;
  } else {
    popup.value.close();
  }
  emits("confirm");
}

function closeLoading() {
  loading.value = false;
}

function handleClose() {
  popup.value.close();
}

defineExpose({
  resize,
  popup,
  closeLoading,
});
</script>

<style lang="scss" scoped>
.drawer-wrapper {
  font-family: misans400, -apple-system, BlinkMacSystemFont, "PingFang SC",
    "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
  font-kerning: none;
  padding-bottom: max(var(--safe-area-inset-bottom), var(--safe-bottom));
  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24rpx 0 32rpx;
    color: var(--title-color);
    font-size: 34rpx;
    font-weight: bold;
    height: 112rpx;
  }

  .scroll-view {
  }

  .modal-footer {
    padding: 24rpx;
  }
}
</style>

<template>
  <!-- status-bar -->
  <uv-status-bar />
  <!-- end -->
  <!-- 标题 -->
  <view class="index-navbar">
    <uv-image
      src="/static/images/home/top-logo.png"
      width="422rpx"
      height="74rpx"
      :duration="0"
    />
  </view>
  <view
    style="position: relative; z-index: 1000"
    :style="{ opacity: ratio }"
    v-if="defaultCar"
  >
    <uv-navbar fixed @leftClick="leftClick" :border="false">
      <template #left></template>
      <template #center>
        <view
          style="
            display: flex;
            align-items: center;
            flex: 1;
            padding-left: 32rpx;
          "
          class="navbar"
          @click="toCarInfo"
        >
          <my-plate
            :mode="2"
            style="margin-bottom: 12rpx"
            :plate="defaultCar.Carno"
            :color="defaultCar.Color"
          />
          <text
            style="
              font-size: 26rpx;
              color: #73838e;
              line-height: 36rpx;
              margin-left: 16rpx;
              margin-right: 2rpx;
            "
            >{{ defaultCar.Cartype }}</text
          >
          <uv-icon name="/static/images/arrow.png" size="10" />
        </view>
      </template>
    </uv-navbar>
  </view>
  <!-- end -->
  <!-- 背景色 -->
  <view class="page-bg" />
  <!-- end -->
  <!-- 金刚区 -->
  <view class="kingkong">
    <view class="car-wrapper" :class="{ 'has-task': processNumber > 0 }">
      <view class="placeholder" v-if="!getToken()">
        <uv-button
          shape="circle"
          text="请登录"
          color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"
          :custom-style="{ height: '72rpx', width: '268rpx' }"
          :customTextStyle="{ fontSize: '28rpx' }"
          @click="openLoginDrawer"
        />
      </view>
      <view class="placeholder" v-else-if="carList && carList.length === 0">
        <uv-button
          shape="circle"
          text="添加车辆"
          icon="plus"
          iconColor="#ffffff"
          iconSize="24rpx"
          color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"
          :custom-style="{ height: '72rpx', width: '268rpx' }"
          :customTextStyle="{ fontSize: '28rpx' }"
          @click="addCar"
        />
      </view>
      <template v-else>
        <view class="task-wrapper" v-if="processNumber > 0">
          <view class="task-title">
            <uv-image
              src="/static/images/home/task.png"
              class="task-img"
              width="152rpx"
              height="96rpx"
              :custom-style="{
                position: 'absolute',
                bottom: '0rpx',
                left: '0',
                zIndex: 10,
              }"
            />
            <text
              >正在进行
              <text style="margin: 0 4rpx">{{ processNumber }}</text>
              项运输任务</text
            >
            <view class="task-btn" @click="toTask">查看</view>
          </view>
          <view class="task-bg" />
        </view>
        <view
          class="car-info"
          :class="{
            car1: defaultCar.Cartype === '自卸车',
            car2: defaultCar.Cartype === '半挂车',
            car3: defaultCar.Cartype === '罐车',
          }"
        >
          <my-plate
            v-if="defaultCar"
            style="margin-bottom: 12rpx"
            :plate="defaultCar.Carno"
            :color="defaultCar.Color"
          />
          <view class="type">{{ defaultCar.Cartype }}</view>
          <view class="change-car" @click="changeCar">
            切换当前车辆
            <uv-image
              src="/static/images/arrow2.png"
              :duration="0"
              width="18rpx"
              height="18rpx"
              :custom-style="{ marginLeft: '4rpx' }"
            />
          </view>
        </view>
      </template>
    </view>
    <view style="padding: 0 28rpx">
      <uv-line color="var(--divider)" />
    </view>
    <view class="menus">
      <view class="menu" @click="navigate('扫码助手')">
        <uv-image
          src="/static/images/home/scan.png"
          width="80rpx"
          height="80rpx"
          :duration="0"
          :custom-style="{ marginBottom: '14rpx' }"
        />
        <view class="">扫码助手</view>
      </view>
      <view class="menu" @click="navigate('数据统计')">
        <uv-image
          src="/static/images/home/statistics.png"
          width="80rpx"
          height="80rpx"
          :duration="0"
          :custom-style="{ marginBottom: '14rpx' }"
        />
        <view class="">数据统计</view>
      </view>
      <view class="menu" @click="toGuide">
        <uv-image
          src="/static/images/home/guide.png"
          width="80rpx"
          height="80rpx"
          :duration="0"
          :custom-style="{ marginBottom: '14rpx' }"
        />
        <view class="">操作指南</view>
      </view>
      <button open-type="feedback" class="menu">
        <uv-image
          src="/static/images/home/feedback.png"
          width="80rpx"
          height="80rpx"
          :duration="0"
          :custom-style="{ marginBottom: '14rpx' }"
        />
        <view class="">问题反馈</view>
      </button>
    </view>
  </view>
  <!-- end -->
  <!-- banner -->
  <view class="banner" @click="follow">
    <uv-image
      width="100%"
      height="100%"
      :duration="0"
      src="/static/images/mine/banner.png"
    />
  </view>
  <!-- end -->
  <!-- 待接单运单 -->
  <view class="empty-wrapper" v-if="!getToken()">
    <uv-image
      src="/static/images/empty/index.png"
      width="176rpx"
      height="176rpx"
      :duration="0"
    />
    <view class="text">登录并添加车辆后方可接单</view>
  </view>
  <view class="bill-list" v-else>
    <view class="title-wrapper">
      <view class="title"
        >当前存在 <text class="total">{{ assignCnt }}</text> 项运输任务</view
      >
      <SelectCargo
        v-model="ownerId"
        :options="currentCarnoCargoOptions"
        @change="changeCargo"
      />
    </view>
    <template v-if="assignList.length > 0">
      <Item v-for="(item, index) in assignList" :record="item" :key="item.Id" />
      <uv-load-more
        :status="noMore ? 'nomore' : loading ? 'loading' : 'loadmore' "
        color="#B0BECC"
        line-color="#B0BECC"
        line
        :custom-style="{ marginTop: '28rpx' }"
      />
    </template>
    <my-empty v-else height="200px" text="暂无可接运单" />
  </view>

  <!-- 登录弹窗 -->
  <my-login-drawer ref="loginDrawer" @success="loginSuccess" />
  <!-- end -->
  <my-tabbar />
</template>

<script setup>
import {
  computed,
  ref,
  unref,
  watch,
  watchEffect,
  getCurrentInstance,
  nextTick,
} from "vue";
import {
  onLoad,
  onShow,
  onReady,
  onPageScroll,
  onReachBottom,
  onPullDownRefresh,
} from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app.js";
import { useUserStore } from "@/stores/user.js";
import { useLocationStore } from "@/stores/location.js";
import { getWxSetting, getLocationInfo } from "@/utils/authorize.js";
import { getToken } from "@/utils/token.js";
import {
  GetDriverWayCount,
  GetGoodsCompanyList,
  GetOnwayList,
  GetReceiveAssignList,
  GetDriverTakeTicketOwnerList,
  ScanQR,
  GetDriverOnwayCnt,
} from "@/api/index.js";
import SelectCargo from "./components/SelectCargo.vue";
import Item from "./components/Item.vue";
import useList from "@/hooks/useList.js";
const { ctx } = getCurrentInstance();

const appStore = useAppStore();
const userStore = useUserStore();
const locationStore = useLocationStore();
const { carList, defaultCar } = storeToRefs(userStore);

const isInit = ref(false);
onLoad(async () => {
  console.log("onLoad");
  if(isInit.value) {
    return;
  }
  if (!getToken()) {
    return;
  }
  console.log("onload handle");
  try {
    await getLocationInfo();
    console.log("locationStore", locationStore);
  } finally {
    await userStore.getCarList();
    await getCurrentCarnoCargoOptions();
    await getProcess();
    getScrollPos();
  }
  isInit.value = true;
});
onShow(async () => {
  console.log("onShow");
  appStore.switchTab(0);
  if (!isInit.value) {
    console.log("onShow is not init");
    return;
  }
  if (!getToken()) {
    return;
  }
  console.log("onshow handle");
  await userStore.getCarList();
  await getProcess();
});
// 顶部导航条逻辑
const scrollTop = ref(0);
const navbarHeight = ref(1);
async function getScrollPos() {
  await nextTick();
  // let navbarInfo = await ctx.$uv.getRect(".car-info");
  let navbarInfo = await ctx.$uv.getRect(".index-navbar");
  console.log("navbarInfo", navbarInfo);
  navbarHeight.value = navbarInfo.bottom;
}
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});
const ratio = computed(() => {
  const r = unref(scrollTop) / unref(navbarHeight);
  return r >= 1 ? 1 : r;
});
function toCarInfo() {
  if (ratio.value === 1) {
    uni.navigateTo({
      url: "/pages/carList/carList",
    });
  }
}
onPullDownRefresh(async () => {
  try {
    await userStore.getCarList();
    await getCurrentCarnoCargoOptions();
    await getProcess();
    await fetchData(true);
  } finally {
    uni.stopPullDownRefresh();
  }
});
// 获取进行中的运单数量
const processNumber = ref(0);
async function getProcess() {
  const res = await GetDriverOnwayCnt();
  processNumber.value = res;
}
// 查看运单
function toTask() {
  appStore.setWaybillQuery({
    status: "10",
  });
  uni.switchTab({
    url: "/pages/waybill/waybill",
  });
}
// 添加车辆
function addCar() {
  uni.navigateTo({
    url: "/pages/addCar/addCar",
  });
}
// 切换默认车辆
function changeCar() {
  uni.navigateTo({
    url: "/pages/carList/carList",
  });
}
// 操作指南
function toGuide() {
  const src = "https://mp.weixin.qq.com/s/6Hqb9mbfT_Te9Tu4cD26DQ";
  // uni.navigateTo({
  // 	url: `/pages/webview/webview?src=${encodeURIComponent(src)}`
  // })
  uni.openOfficialAccountArticle({
    url: src,
  });
}
// 关注公众号
function follow() {
  const src =
    "https://mp.weixin.qq.com/s?__biz=MzkxOTcyODM5OA==&mid=2247483675&idx=1&sn=3f1378b5f85fe5ed6144eb9446f63a32&chksm=c19cf97af6eb706cee30883335ba2e11ab4ebd79c23dac68af13106c2b56e20eee02ddfe656c#rd";
  // uni.navigateTo({
  // 	url: `/pages/webview/webview?src=${encodeURIComponent(src)}`
  // })
  uni.openOfficialAccountArticle({
    url: src,
  });
}
function navigate(type) {
  if (!getToken()) {
    openLoginDrawer();
    return;
  }
  switch (type) {
    case "扫码助手":
      handleScan();
      break;
    case "数据统计":
      uni.showToast({
        title: "敬请期待",
        icon: "none",
      });
      return;
      uni.navigateTo({
        url: "/pages/statistics/statistics",
      });
      break;
    case "操作指南":
      uni.navigateTo({
        url: "/pages/guide/guide",
      });
      break;
      扫码助手;
    case "问题反馈":
      break;
  }
}
// 扫码
async function handleScan() {
  if (!defaultCar.value) {
    uni.showToast({
      title: "请先添加车辆",
      icon: "none",
    });
    return;
  }
  let params = {};
  try {
    const res = await uni.scanCode();
    console.log(res);
    params = JSON.parse(res.result);
    console.log(params);
    const { htQRType } = params;
    if (!htQRType) {
      uni.showToast({
        title: "无效二维码",
        icon: "none",
      });
      return;
    }
  } catch (err) {
    console.log("无效二维码", err);
    uni.showToast({
      title: "无效二维码",
      icon: "none",
    });
    return;
  }

  try {
    uni.showLoading({
      mask: true,
    });
    const param = {
      scanParam: JSON.stringify({
        ...params,
      }),
    };
    console.log(param);
    await ScanQR(param);
    console.log("允许扫码");
    uni.hideLoading();
    const { assignId, supplyId } = params;
    uni.navigateTo({
      url: `/pages/billDetail/billDetail?assignId=${assignId}&supplyId=${supplyId}`,
    });
  } catch (err) {
    uni.hideLoading();
    uni.showToast({
      title: err.data,
      icon: "none",
    });
  }
}
// 登录
const loginDrawer = ref();
function openLoginDrawer() {
  loginDrawer.value.open();
}
function loginSuccess() {
  uni.reLaunch({
    url: "/pages/index/index",
  });
}
// 切换货主
const ownerId = ref("");
const currentCarnoCargoOptions = ref([]);
async function getCurrentCarnoCargoOptions() {
  try {
    const res = await GetDriverTakeTicketOwnerList({
      carno: defaultCar.value.Carno ? defaultCar.value.Carno.trim() : "",
    });
    const cargos = res.map((m) => ({
      value: m.Id,
      label: m.Ownername,
    }));
    currentCarnoCargoOptions.value = [
      {
        value: "",
        label: "全部货主",
      },
      ...cargos,
    ];
  } catch {
    ownerId.value = "";
    currentCarnoCargoOptions.value = [
      {
        value: "",
        label: "全部货主",
      },
    ];
  }
}
watch(
  defaultCar,
  async (val, oldVal) => {
    console.log("切换默认车辆时，获取当前默认车牌号下可接运单", val, oldVal);
    if ((val && !oldVal) || (val && oldVal && val.Id !== oldVal.Id)) {
      console.log("重新获取列表");
      try {
        ownerId.value = "";
        currentCarnoCargoOptions.value = [];
        await getCurrentCarnoCargoOptions();
      } catch {}
      await fetchData(true);
    } else {
      console.log("不需重新获取");
    }
  },
  {
    immediate: true,
  }
);
async function changeCargo(item) {
  try {
    uni.showLoading();
    await fetchData(true)
  } finally {
    uni.hideLoading();
  }
}
// 首页运单
const listParams = computed(() => ({
  ownerId: ownerId.value,
  latitude: locationStore.location ? locationStore.location.latitude : "",
  longitude: locationStore.location ? locationStore.location.longitude : "",
}))
const { list: assignList, loading, noMore, total: assignCnt, fetchData } = useList({
  api: GetReceiveAssignList,
  totalField: 'assignCnt',
  listField: 'assignList',
  params: listParams,
});
//上拉加载
onReachBottom(() => {
  fetchData();
})
</script>

<style lang="scss">
page {
  padding-bottom: 24rpx;
}
.page-bg {
  background: linear-gradient(to bottom, transparent 168px, #f2f4f7),
    url(/static/images/home/bg-text.png),
    linear-gradient(270deg, #31ce57 0%, #07b130 100%);
}
.index-navbar {
  width: 100%;
  font-weight: bold;
  padding-left: 24rpx;
  padding-top: 14rpx;
  margin-bottom: 24rpx;
}

.kingkong {
  background-color: #ffffff;
  border-radius: 24rpx;
  margin: 0 24rpx 20rpx;

  .tasks {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 500;
    font-size: 28rpx;
    color: #ffffff;
    padding: 24rpx 32rpx 32rpx;
    background: linear-gradient(90deg, #fc7e2c 0%, #ffa265 100%);
    border-radius: 24rpx 24rpx 0rpx 0rpx;
  }

  .car-wrapper {
    position: relative;
    .task-wrapper {
      .task-title {
        font-weight: 600;
        position: relative;
        padding: 0 32rpx 0 169rpx;
        height: 84rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        color: #ffffff;
        background-color: #fe7216;
        border-radius: 24rpx 24rpx 0 0;
        .task-img {
          position: absolute;
          bottom: 0;
          left: 0;
        }
        .task-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 108rpx;
          height: 48rpx;
          border-radius: 26rpx;
          font-weight: 600;
          font-size: 26rpx;
          color: #f56f18;
          background: #ffffff;
        }
      }
      .task-bg {
        position: absolute;
        left: 0;
        top: 76rpx;
        width: 100%;
        height: 262rpx;
        z-index: 1;
        background: linear-gradient(to bottom, #fe7216, #ffffff 70%);
      }
    }
    .car-info {
      &.car1 {
        background: url(/static/images/carType/car1-right.png) right 32rpx /
            auto 200rpx no-repeat,
          url(/static/images/home/mask.png) right 0 / auto 240rpx no-repeat,
          #ffffff;
      }
      &.car2 {
        background: url(/static/images/carType/car2-right.png) right 32rpx /
            auto 200rpx no-repeat,
          url(/static/images/home/mask.png) right 0 / auto 240rpx no-repeat,
          #ffffff;
      }
      &.car3 {
        background: url(/static/images/carType/car3-right.png) right 32rpx /
            auto 200rpx no-repeat,
          url(/static/images/home/mask.png) right 0 / auto 240rpx no-repeat,
          #ffffff;
      }
      height: 262rpx;
      padding: 36rpx 28rpx 32rpx;
      position: relative;
      z-index: 2;
      border-radius: 24rpx 24rpx 0 0;
      .my-plate {
        margin-bottom: 12rpx;
        margin-left: 4rpx;
      }

      .type {
        padding-left: 12rpx;
        font-size: 26rpx;
        color: var(--sub-color);
        line-height: 36rpx;
        margin-bottom: 46rpx;
      }

      .change-car {
        padding-left: 12rpx;
        width: fit-content;
        display: flex;
        align-items: center;
        font-weight: bold;
        font-size: 28rpx;
        color: var(--main-color);
        line-height: 36rpx;
      }
    }
    .placeholder {
      height: 262rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &.has-task {
      .car-info {
        margin: 0 10rpx;
        // position: absolute;
        // width: 100%;
        // bottom: 0;
        // left: 0;
      }
    }
  }

  .menus {
    padding: 32rpx 28rpx;
    display: flex;
    justify-content: space-between;

    .menu {
      background-color: transparent;
      padding: 0;
      flex: 1;
      display: flex;
      align-items: center;
      flex-direction: column;
      flex: 1;
      font-size: 26rpx;
      color: var(--title-color);
      line-height: 36rpx;
      &::after {
        display: none;
      }
    }
  }
}

.banner {
  margin: 0 24rpx 24rpx;
  height: 192rpx;
  border-radius: 24rpx 24rpx 24rpx 24rpx;
}

.bill-list {
  padding: 0 24rpx;

  .title-wrapper {
    padding: 0 8rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;

    .title {
      flex: none;
      font-weight: bold;
      font-size: 34rpx;
      color: var(--title-color);
      line-height: 48rpx;
      margin-right: 10rpx;

      .total {
        margin: 0 2rpx;
        color: var(--main-color);
      }
    }
  }
}

.empty-wrapper {
  height: 520rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: 24rpx;
  margin: 0 24rpx;
  .text {
    font-size: 26rpx;
    color: var(--intr-color);
    line-height: 56rpx;
  }
}
</style>

<template>
  <uv-navbar bgColor="rgba(255,255,255,0)" @leftClick="leftClick"></uv-navbar>
  <view class="placeholder" :style="{ height: placeholderHeight }"></view>
  <view
    class="page-bg"
    :class="{ 'no-auth': ['0', '2'].includes(info.EntryAuthened) }"
  />
  <!-- 状态 -->
  <!-- @click="openStepModal" -->
  <view class="status-wrapper">
    <view class="status-text">
      <template v-if="info.EntryAuthened === '0'">需完成安全认证</template>
      <template v-else-if="info.EntryAuthened === '2'">已存在装运计划</template>
      <template v-else>
        待接单
        <!-- <uv-icon name="arrow-right" size="32rpx" color="#FFFFFF" :custom-style="{ marginLeft: '8rpx' }" bold/> -->
      </template>
    </view>
    <view class="status-tip">
      <template v-if="info.EntryAuthened === '0'"
        >接单前，请先完成生产企业安全认证</template
      >
      <template v-else-if="info.EntryAuthened === '2'"
        >完成装车并出厂后方可再次接单</template
      >
      <template v-else>
        请选择装运物料
        <view class="">
          <template
            v-if="
              (!info.StartTime && !info.EndTime) ||
              (info.StartTime &&
                dayjs().isAfter(info.StartTime) &&
                !info.EndTime)
            "
          ></template>
          <template
            v-else-if="
              !info.EndTime &&
              info.StartTime &&
              dayjs().isBefore(info.StartTime)
            "
          >
            并于 {{ dayjs(info.StartTime).format("MM-DD HH:mm") }} 后入厂装货
          </template>
          <template
            v-else-if="
              info.EndTime && info.StartTime && dayjs().isBefore(info.StartTime)
            "
          >
            并于 {{ dayjs(info.StartTime).format("MM-DD HH:mm") }} 至
            {{ dayjs(info.EndTime).format("MM-DD HH:mm") }} 入厂装货
          </template>
          <template
            v-else-if="
              (info.StartTime &&
                dayjs().isAfter(info.StartTime) &&
                info.EndTime &&
                dayjs().isBefore(info.EndTime)) ||
              (!info.StartTime &&
                info.EndTime &&
                dayjs().isBefore(info.EndTime))
            "
          >
            并于 {{ dayjs(info.EndTime).format("MM-DD HH:mm") }} 前入厂装货
          </template>
        </view>
      </template>
    </view>
  </view>
  <!-- end -->
  <!-- 地址 -->
  <view class="location-wrapper">
    <view class="from-wrapper" @click="openMapModal(1)" v-if="info.SupEnt">
      <view class="icon">装</view>
      <view class="content-box my-border-bottom">
        <view class="info" @click="selectAddress">
          <view class="name uv-line-1">{{
            info.SupEnt ? info.SupEnt.Name : ""
          }}</view>
          <view class="address uv-line-1"
            >{{ info.SupEnt ? info.SupEnt.Province : ""
            }}{{ info.SupEnt ? info.SupEnt.City : ""
            }}{{ info.SupEnt ? info.SupEnt.District : ""
            }}{{ info.SupEnt ? info.SupEnt.Address : "" }}</view
          >
        </view>
        <uv-image
          src="/static/images/arrow.png"
          :duration="0"
          width="24rpx"
          height="24rpx"
        />
      </view>
    </view>
    <view class="to-wrapper" @click="openMapModal(2)" v-if="info.UnloadEnt">
      <view class="icon">卸</view>
      <view class="content-box">
        <view class="info" @click="selectAddress">
          <view class="name uv-line-1">{{
            info.UnloadEnt ? info.UnloadEnt.PlaceName : ""
          }}</view>
          <view class="address uv-line-1"
            >{{ info.UnloadEnt ? info.UnloadEnt.Province : ""
            }}{{ info.UnloadEnt ? info.UnloadEnt.City : ""
            }}{{ info.UnloadEnt ? info.UnloadEnt.District : ""
            }}{{ info.UnloadEnt ? info.UnloadEnt.Address : "" }}</view
          >
        </view>
        <uv-image
          src="/static/images/arrow.png"
          :duration="0"
          width="24rpx"
          height="24rpx"
        />
      </view>
    </view>
  </view>
  <!-- 物料 -->
  <view class="materials" v-if="info.MatList && info.MatList.length > 0">
    <Material
      :record="item"
      :bill="info"
      v-for="(item, i) in info.MatList"
      :border-bottom="i < info.MatList.length - 1"
      @confirm="confirm"
    />
  </view>
  <!-- end -->
  <!-- 磅单 -->
  <!-- <view class="bangdan">
		<view class="left">
			<view class="name">已生成磅单</view>
			<view class="no">磅单号：BD9090889889989000</view>
		</view>
		<view class="right">
			<uv-button shape="circle" color="var(--page-bg)":custom-style="{ height: '68rpx',color:'var(--main-color)', fontWeight: 'bold' }">
				查看磅单
			</uv-button>
		</view>
	</view> -->
  <!-- end -->
  <!-- 公司 -->
  <view class="mfrs" v-if="info.OwnerEnt">
    <view class="left">
      <view class="name">{{
        info.OwnerEnt ? info.OwnerEnt.OwnerName : ""
      }}</view>
      <view class="person">
        <text class="user">{{
          info.OwnerEnt ? info.OwnerEnt.Linker : ""
        }}</text>
        <text class="phone">{{
          info.OwnerEnt ? info.OwnerEnt.LinkerMobile : ""
        }}</text>
      </view>
    </view>
    <view class="right" v-if="info.OwnerEnt && info.OwnerEnt.LinkerMobile">
      <uv-button
        shape="circle"
        color="var(--page-bg)"
        :custom-style="{
          height: '68rpx',
          color: 'var(--main-color)',
          fontWeight: 'bold',
        }"
        @click="takePhone"
      >
        呼叫货主
      </uv-button>
    </view>
  </view>
  <!-- end -->
  <!-- 车 -->
  <view class="bill-car">
    <view class="info-wrapper my-border-bottom" v-if="info.CarEnt">
      <view class="info">
        <my-plate :plate="info.CarEnt.Carno" :color="info.CarEnt.Color" /><text
          class="type"
          >{{ info.CarEnt.CarType }}</text
        >
      </view>
      <view class="person" v-if="info.DriverEnt">
        <text class="user">{{
          info.DriverEnt ? info.DriverEnt.NickName : ""
        }}</text>
        <text class="phone">{{
          info.DriverEnt ? info.DriverEnt.Mobile : ""
        }}</text>
      </view>
    </view>
    <!-- <view class="weight my-border-bottom">
			<view class="label">皮重 15.80 吨</view>
			<view class="value">测量于 09/09 09:09</view>
		</view>
		<view class="weight">
			<view class="label">毛重 15.80 吨</view>
			<view class="value">测量于 09/09 09:09</view>
		</view> -->
  </view>
  <!-- end -->
  <!-- 运单详情 -->
  <view class="remark" v-if="info.Memo">
    <view class="title">运单备注</view>
    <view class="content">{{ info.Memo }}</view>
  </view>
  <!-- 派单时间 -->
  <view class="item">
    <view class="label">货主派单时间</view>
    <view class="value">{{ info.CreatorTime }}</view>
  </view>
  <!-- <view class="order-info">
		<view class="title">运单详情</view>
		<view class="content">
			<view class="item">
				<view class="label">运单号</view>
				<view class="value">GYI909088929309013801</view>
			</view>
			<view class="item">
				<view class="label">接单时间</view>
				<view class="value">2023-09-08 20:08</view>
			</view>
		</view>
	</view> -->
  <!-- end -->

  <!-- <view class="page-footer">
		<view class="btns">
			<view class="left">
				<uv-button text="取消运单" color="var(--page-bg)" :custom-style="{ height: '96rpx', borderRadius: '16rpx',color: 'var(--sub-color)' }"></uv-button>
			</view>
			<view class="right">
				<uv-button text="已到达装货厂家" color=" linear-gradient( 270deg, #31CE57 0%, #07B130 100%)" :custom-style="{ height: '96rpx', borderRadius: '16rpx' }"></uv-button>
			</view>
		</view>
	</view> -->
  <!-- 地图 -->
  <MapDrawer ref="mapModal" />
  <!-- 追踪 -->
  <StepDrawer ref="stepModal" />
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import Material from "./components/Material.vue";
import MapDrawer from "./components/MapDrawer.vue";
import StepDrawer from "./components/StepDrawer.vue";
import { GetReceiveAssignDetail, DriverMakeOnway } from "@/api/index.js";
import dayjs from "dayjs";
import { getStorage } from "@/utils/storage.js";
import Big from "big.js";

const statusBarHeight = ref();
const assignId = ref("");
const supplyId = ref("");
onLoad((options) => {
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight;
  assignId.value = options?.assignId ?? "";
  supplyId.value = options?.supplyId ?? "";
  getData();
});
const info = ref({});
async function getData() {
  try {
    const res = await GetReceiveAssignDetail({
      assignId: assignId.value,
      supplyId: supplyId.value,
    });
    info.value = {
      ...res,
      MatList: res.MatList.map((m) => {
        let FullLoad = "",
          Load = "",
          LoadType = "";
        if (res?.ConfigEnt?.fullLoad === "0") {
          FullLoad = "0";
          Load = res?.ConfigEnt?.fullLoadMax;
          LoadType = "0";
        } else if (res?.ConfigEnt?.fullLoad === "1") {
          FullLoad = "1";
          Load = 0;
          LoadType = "1";
        } else if (res?.ConfigEnt?.fullLoad === "2") {
          FullLoad = "0";
          Load = 0;
          LoadType = "";
        }

        //获取历史数据
        const driverMakeOnway = getStorage("driverMakeOnway");
        console.log("driverMakeOnway", driverMakeOnway);
        if (
          driverMakeOnway &&
          driverMakeOnway?.ConfigEnt?.fullLoad === res?.ConfigEnt?.fullLoad
        ) {
          FullLoad = driverMakeOnway.FullLoad;
          LoadType = driverMakeOnway.LoadType;

          //   处理因为上下限修改导致历史数据无法使用的情况
          const isGt =
            res?.ConfigEnt?.fullLoadMax &&
            Big(res?.ConfigEnt?.fullLoadMax).gt(driverMakeOnway.Load || 0);
          const isLt =
            res?.ConfigEnt?.fullLoadMin &&
            Big(res?.ConfigEnt?.fullLoadMin).lt(driverMakeOnway.Load || 0);
          if (isGt && isLt) {
            Load = driverMakeOnway.Load;
          } else if (isGt && !isLt) {
            Load = res?.ConfigEnt?.fullLoadMin;
          } else if (!isGt && isLt) {
            Load = res?.ConfigEnt?.fullLoadMax;
          }
          console.log("使用历史数据");
          return {
            ...m,
            FullLoad,
            Load,
            LoadType,
          };
        }
        console.log("使用新数据");
        return {
          ...m,
          FullLoad,
          Load,
          LoadType,
        };
      }),
    };
  } catch {
  } finally {
  }
}
const placeholderHeight = computed(() => `${statusBarHeight.value + 56}px`);
// 导航条
function leftClick() {
  uni.navigateBack();
}
// 地图
const mapModal = ref();
function openMapModal(type) {
  const data = {
    type,
    name:
      type === 1
        ? info.value?.SupEnt?.Name ?? ""
        : info.value?.UnloadEnt?.PlaceName ?? "",
    address:
      type === 1
        ? `${info.value?.SupEnt?.Province ?? ""}${
            info.value?.SupEnt?.City ?? ""
          }${info.value?.SupEnt?.District ?? ""}${
            info.value?.SupEnt?.Address ?? ""
          }`
        : `${info.value?.UnloadEnt?.Province ?? ""}${
            info.value?.UnloadEnt?.City ?? ""
          }${info.value?.UnloadEnt?.District ?? ""}${
            info.value?.UnloadEnt?.Address ?? ""
          }`,
    user:
      type === 1
        ? info.value?.SupEnt?.Linker ?? ""
        : info.value?.UnloadEnt?.NickName ?? "",
    phone:
      type === 1
        ? info.value?.SupEnt?.LinkerMobile ?? ""
        : info.value?.UnloadEnt?.Mobile ?? "",
    longitude:
      type === 1
        ? info.value?.SupEnt?.Logitude
        : info.value?.UnloadEnt?.Logitude,
    latitude:
      type === 1
        ? info.value?.SupEnt?.Latitude
        : info.value?.UnloadEnt?.Latitude,
  };
  mapModal.value.open(data);
}
// 跟踪
const stepModal = ref();
function openStepModal() {
  stepModal.value.open();
}
// 呼叫货主
function takePhone() {
  uni.makePhoneCall({
    phoneNumber: info.value.OwnerEnt.LinkerMobile,
  });
}

function confirm() {
  getData();
}
</script>

<style lang="scss">
page {
  padding: 0 24rpx;
}

.page-bg {
  &.no-auth {
    background: linear-gradient(to bottom, transparent 168px, #f2f4f7),
      linear-gradient(270deg, #fc7e2c 0%, #fc7e2c 100%);
  }
}

.status-wrapper {
  margin-bottom: 32rpx;
  padding-left: 12rpx;
  .status-text {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 48rpx;
    color: #ffffff;
    line-height: 64rpx;
  }
  .status-tip {
    font-weight: 500;
    font-size: 28rpx;
    color: #ffffff;
    line-height: 48rpx;
  }
}

.location-wrapper {
  padding: 0 24rpx;
  margin: 0 0 20rpx;
  background: #ffffff;
  border-radius: 24rpx;

  .from-wrapper,
  .to-wrapper {
    display: flex;
    align-items: center;

    .icon {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36rpx;
      height: 36rpx;
      border-radius: 8rpx;
      font-weight: 600;
      font-size: 22rpx;
      color: #ffffff;
      margin-right: 24rpx;
    }

    .content-box {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 24rpx 0;

      .info {
        flex: 1;
        line-height: 48rpx;
        margin-right: 20rpx;

        .name {
          font-weight: 500;
          font-size: 30rpx;
          color: var(--title-color);
        }

        .address {
          display: flex;
          align-items: center;
          font-size: 26rpx;
          color: var(--sub-color);
        }
      }
    }
  }

  .from-wrapper {
    .icon {
      background-color: var(--main-color);
    }
  }

  .to-wrapper {
    .icon {
      background-color: #fc7e2c;
    }
  }
}

.materials,
.bangdan,
.mfrs,
.bill-car,
.remark,
.order-info {
  padding: 28rpx;
  background-color: #ffffff;
  margin: 0 0 24rpx;
  border-radius: 24rpx;
}

.materials {
}
.bangdan {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--title-color);
  line-height: 48rpx;

  .name {
    font-weight: bold;
    font-size: 30rpx;
  }

  .no {
    font-size: 26rpx;
    color: var(--sub-color);
  }
}
.mfrs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--title-color);
  line-height: 48rpx;

  .name {
    font-weight: bold;
    font-size: 30rpx;
  }

  .person {
    font-size: 26rpx;
    color: var(--sub-color);

    .user {
      margin-right: 24rpx;
    }
  }
}

.bill-car {
  padding: 0 28rpx;
  .info-wrapper {
    padding: 32rpx 0;
    .info {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;

      .type {
        margin-left: 16rpx;
        color: var(--title-color);
        font-size: 26rpx;
        font-weight: bold;
      }
    }

    .person {
      font-size: 26rpx;
      color: var(--sub-color);

      .user {
        margin-right: 24rpx;
      }
    }
  }
  .weight {
    font-weight: bold;
    padding: 32rpx 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 26rpx;
    color: var(--content-color);
    line-height: 48rpx;
  }
}

.remark {
  line-height: 40rpx;

  .title {
    font-weight: bold;
    font-size: 30rpx;
    color: var(--title-color);
    margin-bottom: 16rpx;
  }

  .content {
    font-size: 26rpx;
    color: #4e5356;
    text-align: left;
  }
}

.order-info {
  line-height: 40rpx;
  .title {
    font-weight: bold;
    font-size: 30rpx;
    color: var(--title-color);
    margin-bottom: 16rpx;
  }
  .item {
    font-size: 26rpx;
    display: flex;
    &:not(:last-child) {
      margin-bottom: 16rpx;
    }
    .label {
      min-width: 130rpx;
      margin-right: 24rpx;
      color: var(--sub-color);
    }
    .value {
      flex: 1;
      color: var(--title-color);
    }
  }
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 28rpx;
  background: #ffffff;
  border-radius: 24rpx 24rpx 24rpx 24rpx;
  font-weight: 400;
  font-size: 26rpx;
  line-height: 40rpx;
  .label {
    color: #73838e;
  }
  .value {
    color: #1a1b1c;
  }
}
</style>

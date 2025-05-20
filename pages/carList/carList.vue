<template>
  <uv-radio-group v-model="isDefault" @change="setDefault">
    <view
      class="car"
      :class="{
        car1: item.Cartype === '自卸车',
        car2: item.Cartype === '半挂车',
        car3: item.Cartype === '罐车',
      }"
      v-for="item in carList"
      :key="item.Id"
    >
      <view class="car-info my-border-bottom">
        <view class="top">
          <my-plate
            :customStyle="{ marginBottom: '16rpx' }"
            :plate="item.Carno"
            :color="item.Color"
          />
          <view class="type">{{ item.Cartype }}</view>
        </view>
        <view class="status free">空闲</view>
      </view>
      <view class="car-btns my-flex">
        <uv-radio :name="item.Carno" activeColor="var(--main-color)">
          <view
            :style="{
              fontWeight: item === isDefault ? 'bold' : 'normal',
              color:
                item === isDefault
                  ? 'var(--main-color)'
                  : 'var(--content-color)',
            }"
            >设为当前车辆</view
          >
        </uv-radio>
        <view class="btns">
          <view class="btn" @click="remove(item)" v-if="item.Isdefault !== '1'">
            <uv-image
              src="/static/images/remove.png"
              width="32rpx"
              height="32rpx"
              :custom-style="{ marginRight: '8rpx' }"
              :duration="0"
            />
            删除
          </view>
          <view class="btn" @click="edit(item)">
            <uv-image
              src="/static/images/edit.png"
              width="32rpx"
              height="32rpx"
              :custom-style="{ marginRight: '8rpx' }"
              :duration="0"
            />
            修改
          </view>
        </view>
      </view>
    </view>
    <view class="tip">
      还可以添加
      <text
        style="color: var(--main-color); font-weight: bold; margin: 0 10rpx"
        >{{ canAddNum }}</text
      >
      辆车
    </view>
  </uv-radio-group>
  <view class="page-footer">
    <uv-button
      v-if="isFull"
      disabled
      text="车辆数量已达上限"
      color="#C8D4DF"
      :custom-style="{
        height: '96rpx',
      }"
    />
    <uv-button
      v-else
      text="+ 添加车辆"
      color="linear-gradient( 270deg, #31CE57 0%, #07B130 100%);"
      :custom-style="{
        height: '96rpx',
      }"
      @click="add"
    />
  </view>

  <my-confirm ref="modal" />
</template>

<script setup>
import { ref, computed } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user.js";
import { SetDriverCarDefault, DiabledDriverCar } from "@/api/index.js";
const userStore = useUserStore();
const { carList, carConfig } = storeToRefs(userStore);

// 剩余可添加车辆数量
const canAddNum = computed(() => {
  console.log("carConfig", carConfig.value?.carsLimit, carList.value.length);
  const num = carConfig.value?.carsLimit - carList.value.length;
  return num > 0 ? num : 0;
});
// 车辆是否已满
const isFull = computed(() => {
  return canAddNum.value <= 0;
});

// 默认车辆
const isDefault = ref();
onShow(async () => {
  await userStore.getCarList();
  isDefault.value = userStore.defaultCar?.Carno ?? "";
});

function add() {
  uni.navigateTo({
    url: `/pages/addCar/addCar`,
    success(res) {
      res.eventChannel.emit("setData", {
        data: null,
      });
    },
  });
}
const modal = ref();
function remove(record) {
  modal.value.confirm({
    title: "确定删除车辆？",
    content: "您的运单记录不会被影响",
    cancelText: "再想想",
    confirmText: "删除",
    asyncClose: true,
    async confirm() {
      try {
        await DiabledDriverCar({
          id: record.Id,
        });
        await userStore.getCarList();
        modal.value.close();
      } catch {
        modal.value.closeLoading();
      }
    },
  });
}
function edit(record) {
  uni.navigateTo({
    url: `/pages/addCar/addCar`,
    success(res) {
      res.eventChannel.emit("setData", {
        data: record,
      });
    },
  });
}
async function setDefault(carno) {
  uni.showLoading({
    mask: true,
  });
  await SetDriverCarDefault({
    carno,
  });
  uni.hideLoading();
  await userStore.getCarList();
}
</script>

<style lang="scss">
page {
  padding: 24rpx 24rpx 260rpx;
}

.car {
  width: 100%;
  padding: 0 28rpx;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
  background: #ffffff;

  &.car1 {
    background: url(/static/images/carType/car1-right.png) no-repeat right 36rpx/340rpx
      200rpx #ffffff;
  }

  &.car2 {
    background: url(/static/images/carType/car2-right.png) no-repeat right 36rpx/340rpx
      200rpx #ffffff;
  }

  &.car3 {
    background: url(/static/images/carType/car3-right.png) no-repeat right 36rpx/340rpx
      200rpx #ffffff;
  }

  .car-info {
    height: 272rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 32rpx 0;

    .number {
      background: #a0afba;
      border-radius: 12rpx;
      height: 64rpx;
      line-height: 64rpx;
      margin-bottom: 16rpx;
    }

    .type {
      color: var(--sub-color);
      font-size: 26rpx;
    }

    .status {
      width: fit-content;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48rpx;
      padding: 0 12rpx;
      font-size: 26rpx;
      border-radius: 8rpx;
      border: 1rpx solid;
      font-weight: bold;

      &.free {
        border-color: var(--main-color);
        color: var(--main-color);
        background-color: #e7f9e9;
      }

      &.work {
        border-color: #fc7e2c;
        color: #fc7e2c;
        background-color: #fff7f1;
      }
    }
  }

  .car-btns {
    padding: 32rpx 0;
    font-size: 28rpx;

    .btns {
      display: flex;

      .btn {
        display: flex;
        align-items: center;
        margin-left: 44rpx;
        font-size: 28rpx;
        color: var(--sub-color);
      }
    }
  }
}

.tip {
  width: 100%;
  text-align: center;
  font-size: 26rpx;
  color: var(--sub-color);
  line-height: 48rpx;
}
</style>

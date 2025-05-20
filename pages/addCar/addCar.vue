<template>
  <view class="tip" v-if="carConfig">
    <template v-if="carConfig.monthUptLeft <= 0"
      >本月已达添加/修改次数上限</template
    >
    <template v-else-if="carConfig.dayUptLeft <= 0"
      >今日已达添加/修改次数上限</template
    >
    <template v-else-if="carConfig.monthUptLeft <= carConfig.dayUptLeft">
      本月还可添加/修改
      <text class="number">{{ carConfig.monthUptLeft }}</text> 次
    </template>
    <template v-else
      >今日还可添加/修改
      <text class="number">{{ carConfig.dayUptLeft }}</text>
      次，本月还可添加/修改
      <text class="number">{{ carConfig.monthUptLeft }}</text> 次</template
    >
  </view>
  <view class="form-wrapper">
    <uv-form
      errorType="toast"
      :model="model"
      :rules="rules"
      ref="form"
      label-width="140rpx"
    >
      <view class="number-wrapper">
        <uv-form-item labelPosition="top" label="车牌号码" prop="Carno">
          <CarNumber v-model="model.Carno" />
        </uv-form-item>
      </view>
      <view class="form-box">
        <uv-form-item
          labelPosition="left"
          label="车牌颜色"
          prop="Color"
          borderBottom
        >
          <SelectColor v-model="model.Color" />
        </uv-form-item>
        <uv-form-item labelPosition="left" label="车辆类型" prop="Cartype">
          <SelectCarType v-model="model.Cartype" />
        </uv-form-item>
      </view>
    </uv-form>
    <view class="agreement"
      >* 车辆信息仅用于匹配装运任务，我们会严格保护您的信息</view
    >
  </view>

  <view class="page-footer">
    <view class="btns">
      <view class="left" v-if="model.Id">
        <uv-button
          text="删除车辆"
          color="#FFF0EE"
          :customTextStyle="{ fontSize: '30rpx', color: 'var(--red-color)' }"
          :custom-style="{ borderRadius: '16rpx', height: '96rpx' }"
          @click="remove"
        />
      </view>
      <view class="right">
        <uv-button
          :text="model.Id ? '确认修改' : '确认添加'"
          @click="submit"
          color=" linear-gradient( 270deg, #31CE57 0%, #07B130 100%)"
          :loading="loading"
          :custom-style="{ borderRadius: '16rpx', height: '96rpx' }"
          :customTextStyle="{ fontSize: '30rpx' }"
        />
      </view>
    </view>
  </view>

  <!-- 弹窗 -->
  <my-confirm ref="modal" />
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import SelectColor from "./components/SelectColor.vue";
import SelectCarType from "./components/SelectCarType.vue";
import CarNumber from "./components/CarNumber.vue";
import { UptOrNewDriverCar, DiabledDriverCar } from "@/api/index.js";
import { useUserStore } from "@/stores/user.js";
import { storeToRefs } from "pinia";
const userStore = useUserStore();

const { carConfig } = storeToRefs(userStore);

// 保存原始数据
const originData = ref({});

onMounted(() => {
  const instance = getCurrentInstance().proxy;
  const eventChannel = instance.getOpenerEventChannel();
  eventChannel.on("setData", function ({ data }) {
    console.log("setData", data);
    if (data) {
      model.value = {
        Id: data.Id,
        Carno: data.Carno,
        Color: data.Color,
        Cartype: data.Cartype,
      };
      originData.value = {
        Carno: data.Carno,
        Color: data.Color,
        Cartype: data.Cartype,
      };
    }
    uni.setNavigationBarTitle({
      title: data ? "修改车辆" : "添加车辆",
    });
  });
});

const form = ref(null);
const model = ref({
  Id: "",
  Carno: "",
  Color: "",
  Cartype: "",
});
const rules = ref({
  Carno: [
    {
      validator: (rule, value, callback) => {
        if (!value) return false;
        const arr = value.split("");
        if (arr.length <= 7 && arr.filter((m) => m !== " ").length < 7) {
          return false;
        }
        if (arr.length == 8 && arr.filter((m) => m !== " ").length < 8) {
          return false;
        }
        return true;
      },
      message: "请填写正确的车牌号",
    },
  ],
  Color: {
    required: true,
    message: "请选择颜色",
    trigger: ["blur", "change"],
  },
  Cartype: {
    required: true,
    message: "请选择类型",
    trigger: ["blur", "change"],
  },
});

const loading = ref(false);

function remove() {
  modal.value.confirm({
    title: "确定删除车辆？",
    content: "您的运单记录不会被影响",
    cancelText: "再想想",
    confirmText: "删除",
    asyncClose: true,
    async confirm() {
      try {
        await DiabledDriverCar({
          id: model.value.Id,
        });
        await userStore.getCarList();
        await uni.showToast({
          title: "操作成功",
          icon: "none",
          complete() {
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          },
        });
        modal.value.close();
      } catch (err) {
        uni.showToast({
          title: err.data,
          icon: "none",
        });
        modal.value.closeLoading();
      }
    },
  });
}

//判断是否修改
function isChange() {
  return (
    model.value.Carno !== originData.value.Carno ||
    model.value.Color !== originData.value.Color ||
    model.value.Cartype !== originData.value.Cartype
  );
}

async function submit() {
  if (!isChange() && model.value.Id) {
    uni.navigateBack();
    return;
  }

  try {
    const res = await form.value.validate();
    console.log("res", res, model.value);
  } catch (err) {
    console.log("err", err);
    return;
  }

  modal.value.confirm({
    title: model.value.Id ? "确认修改车辆？" : "确认添加车辆？",
    content: model.value.Id
      ? "请确保填写信息准确，运单记录不会被影响"
      : "请确保填写信息准确",
    cancelText: "再想想",
    confirmBgColor: "var(--main-color)",
    confirmText: model.value.Id ? "确认修改" : "确认添加",
    asyncClose: true,
    async confirm() {
      try {
        await UptOrNewDriverCar(model.value);
        await userStore.getCarList();
        await uni.showToast({
          title: model.value.Id ? "车辆编辑成功" : "车辆添加成功",
          icon: "none",
          complete() {
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          },
        });
        modal.value.close();
      } catch (err) {
        uni.showToast({
          title: err.data,
          icon: "none",
        });
        modal.value.closeLoading();
      }
    },
  });
}

const modal = ref();
</script>

<style lang="scss">
page {
  padding: 0 0 140rpx;
}

.tip {
  padding: 12rpx 32rpx;
  background-color: #fff7f1;
  font-weight: bold;
  font-size: 24rpx;
  color: #fc7e2c;
  line-height: 48rpx;
  text-align: center;
  .number {
    font-weight: bold;
    margin: 0 10rpx;
  }
}

.form-wrapper {
  padding: 24rpx;

  .number-wrapper {
    .uv-form-item__body__left {
      margin-bottom: 24rpx !important;
    }
  }

  .form-box,
  .number-wrapper {
    margin-bottom: 20rpx;
    background-color: #ffffff;
    border-radius: 24rpx;
    padding: 0 24rpx;

    .uv-form-item__body__left__content__label {
      font-size: 28rpx !important;
      color: #4e5356 !important;
    }

    .uv-form-item__body {
      padding: 32rpx 0 !important;
    }
  }

  .agreement {
    font-size: 24rpx;
    color: var(--sub-color);
    line-height: 48rpx;
  }
}
</style>

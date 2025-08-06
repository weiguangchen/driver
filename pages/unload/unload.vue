<template>
  <view class="page-container">
    <uv-form
      labelPosition="left"
      errorType="toast"
      :model="model"
      :rules="rules"
      ref="form"
    >
      <view class="item-wrapper">
        <view class="item-title">卸货说明</view>
        <uv-form-item label="" prop="memo">
          <uv-textarea
            v-model="model.memo"
            border="none"
            height="252rpx"
            :placeholder="
              textUnlPrompt
                ? `在此处填写卸货说明，&#10;${textUnlPrompt}`
                : '在此处填写卸货说明'
            "
            :customStyle="{
              borderRadius: '24rpx',
              padding: '28rpx',
            }"
            count
            :maxlength="500"
          ></uv-textarea>
        </uv-form-item>
      </view>
      <view v-if="needUnlVerpho == '1'" class="item-wrapper">
        <view class="item-title">
          <text>车辆照片</text>
          <text class="tip">（请保证车牌号码清晰可见，最多 1 张）</text>
        </view>
        <uv-form-item label="" prop="img1">
          <uv-upload
            :fileList="model.img1"
            :maxCount="1"
            :previewFullImage="true"
            name="img1"
            capture="camera"
            @afterRead="afterRead"
            @delete="deletePic"
          >
            <template>
              <view class="custom-upload">
                <uv-icon
                  name="/static/images/upload.png"
                  width="48rpx"
                  height="48rpx"
                />
              </view>
            </template>
          </uv-upload>
        </uv-form-item>
      </view>
      <view
        v-if="needUnlPho == '1'"
        class="item-wrapper"
        style="margin-bottom: 48rpx"
      >
        <view class="item-title">
          <text>{{
            needUnlVerpho == "1" ? "凭证及其他照片" : "卸货照片"
          }}</text>
          <text class="tip">（最多 4 张）</text>
        </view>
        <uv-form-item label="" prop="img2">
          <uv-upload
            name="img2"
            :fileList="model.img2"
            :maxCount="4"
            :previewFullImage="true"
            multiple
            :sizeType="['compressed']"
            capture="camera"
            @afterRead="afterRead"
            @delete="deletePic"
          >
            <template>
              <view class="custom-upload">
                <uv-icon
                  name="/static/images/upload.png"
                  width="48rpx"
                  height="48rpx"
                />
              </view>
            </template>
          </uv-upload>
        </uv-form-item>
      </view>
      <uv-button
        text="确认提交"
        color="linear-gradient( 270deg, #31CE57 0%, #02B72E 100%);"
        :customStyle="{
          height: '96rpx',
        }"
        :loading="loading"
        @click="submit"
      />
      <view
        style="
          margin-top: 20rpx;
          font-size: 24rpx;
          line-height: 32rpx;
          text-align: center;
          color: var(--sub-color);
        "
        >提交成功后将完成本次装运任务</view
      >
    </uv-form>
  </view>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { UnloadConfirm, UploadImg } from "@/api/index.js";
import { getToken } from "@/utils/token.js";

const needUnlVerpho = ref("");
const textUnlPrompt = ref("");
const needUnlPho = ref("");
const record = ref({});
let eventChannel = null;
onLoad(() => {
  console.log("onLoad");
  const instance = getCurrentInstance().proxy;
  eventChannel = instance.getOpenerEventChannel();
  eventChannel.on("unloadConfirmData", function (res) {
    console.log("unloadConfirmData", res);
    needUnlVerpho.value = res.data.needUnlVerpho;
    textUnlPrompt.value = res.data.textUnlPrompt;
    needUnlPho.value = res.data.needUnlPho;
    record.value = res.record;
  });
});

const form = ref(null);
const model = reactive({
  memo: "",
  img1: [],
  img2: [],
});
const rules = reactive({
  memo: [
    {
      required: true,
      message: "请填写卸货说明",
      trigger: ["blur", "change"],
    },
  ],
  img1: [
    {
      required: true,
      message: "请上传车辆照片",
      trigger: ["blur", "change"],
      type: "array",
    },
  ],
  img2: [
    {
      asyncValidator: (rule, value, callback) => {
        if (value.length === 0) {
          if (needUnlVerpho.value == "1") {
            callback(new Error("请上传凭证及其他照片"));
          } else {
            callback(new Error("请上传卸货照片"));
          }
        } else {
          callback();
        }
      },
      trigger: ["blur", "change"],
      type: "array",
    },
  ],
});

function uploadFilePromise(url) {
  console.log("uploadFilePromise url", url);
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: UploadImg, // 仅为示例，非真实的接口地址
      filePath: url,
      name: "file",
      success: (res) => {
        const img = JSON.parse(res?.data)?.data?.[0] ?? "";
        console.log("uploadFilePromise res", img);
        resolve(img);
      },
      fail(err) {
        console.log("uploadFilePromise err", err);
        reject(err);
      },
    });
  });
}

async function afterRead(e) {
  console.log("afterRead", e);
  let lists = [].concat(e.file);
  let fileListLen = model[e.name].length;
  lists.forEach((item) => {
    model[e.name].push({
      ...item,
      status: "uploading",
      message: "上传中",
    });
  });
  for (let i = 0; i < lists.length; i++) {
    const result = await uploadFilePromise(lists[i].url);
    let item = model[e.name][fileListLen];
    model[e.name].splice(
      fileListLen,
      1,
      Object.assign(item, {
        status: "",
        message: "",
        // url: result,
        path: result,
      })
    );
    fileListLen++;
  }
  form.value.validateField(e.name);
}

function deletePic(e) {
  console.log("deletePic", e);
  // 删除图片
  model[e.name].splice(e.index, 1);
  form.value.validateField(e.name);
}

const loading = ref(false);
async function submit() {
  loading.value = true;
  try {
    await form.value.validate();
  } catch {
    loading.value = false;
    return;
  }
  console.log("res", model);

  const params = {
    onwayId: record.value.Id,
    userId: getToken().userInfo.Id,
    uType: "driver",
    memo: model.memo,
    supplyId: record.value.SupplyId,
    imgChkPath: model.img1.map((item) => item.path).join(","),
    imgUnChkPath: model.img2.map((item) => item.path).join(","),
  };
  console.log("params", params);
  // return;
  try {
    await UnloadConfirm(params);
    uni.$emit(`waybill:confirmUnload`, record.value);
    eventChannel.emit("unloadFinish");
    uni.navigateBack();
  } catch (err) {
    uni.showToast({
      title: err.data,
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss">
.page-container {
  padding: 32rpx 28rpx;
  .item-wrapper {
    margin-bottom: 28rpx;
    .item-title {
      font-weight: bold;
      font-size: 32rpx;
      color: #000000;
      line-height: 48rpx;
      margin-bottom: 20rpx;
      .tip {
        font-weight: normal;
        font-size: 24rpx;
        color: var(--sub-color);
        line-height: 48rpx;
      }
    }
    textarea {
      white-space: pre-wrap;
    }
  }

  .uv-form-item__body {
    padding: 0 !important;
  }
}

.custom-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  background: #fff;
}
</style>

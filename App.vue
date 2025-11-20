<script setup>
import { getToken } from "@/utils/token.js";
import { useUserStore } from "@/stores/user.js";
import { onLaunch } from "@dcloudio/uni-app";

const userStore = useUserStore();
onLaunch(async () => {
  console.log("App Launch");
  userStore.setUserInfo(getToken() ? getToken()?.userInfo : {});

  // 微信更新
  const updateManager = wx.getUpdateManager();
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    console.log("onCheckForUpdate", res);
  });
  updateManager.onUpdateReady(function () {
    console.log("onUpdateReady");
    wx.showModal({
      title: "更新提示",
      content: "新版本已经准备好，是否重启应用？",
      success: function (res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
        }
      },
    });
  });
  updateManager.onUpdateFailed(function () {
    console.log("onUpdateFailed");
    // 新版本下载失败
    wx.showModal({
      title: "更新提示",
      content: "新版本下载失败，请稍后重试",
    });
  });
});

wx.loadFontFace({
  global: true,
  family: "misans400",
  source: 'url("https://www.wwwxapp.cn:28064/Resources/MiSansLatinVF.ttf")',
  desc: {
    weight: "380",
  },
  success: console.log,
});

wx.loadFontFace({
  global: true,
  family: "misans500",
  source: 'url("https://www.wwwxapp.cn:28064/Resources/MiSansLatinVF.ttf")',
  desc: {
    weight: "520",
  },
  success: console.log,
});

wx.loadFontFace({
  global: true,
  family: "misans600",
  source: 'url("https://www.wwwxapp.cn:28064/Resources/MiSansLatinVF.ttf")',
  desc: {
    weight: "630",
  },
  success: console.log,
});
</script>

<style lang="scss">
/*每个页面公共css */
@import "@/uni_modules/uv-ui-tools/index.scss";
@import "@/styles/public.scss";

page {
  --safe-area-inset-top: 0px;
  --safe-area-inset-right: 0px;
  --safe-area-inset-bottom: 0px;
  --safe-area-inset-left: 0px;
}

@supports (top: constant(safe-area-inset-top)) {
  page {
    --safe-area-inset-top: constant(safe-area-inset-top);
    --safe-area-inset-right: constant(safe-area-inset-right);
    --safe-area-inset-bottom: constant(safe-area-inset-bottom);
    --safe-area-inset-left: constant(safe-area-inset-left);
  }
}

@supports (top: env(safe-area-inset-top)) {
  page {
    --safe-area-inset-top: env(safe-area-inset-top);
    --safe-area-inset-right: env(safe-area-inset-right);
    --safe-area-inset-bottom: env(safe-area-inset-bottom);
    --safe-area-inset-left: env(safe-area-inset-left);
  }
}
</style>

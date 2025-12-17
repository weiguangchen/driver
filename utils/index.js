import { Base64 } from "js-base64";

export function sleep(time = 2000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

// 格式化日期
export function formatDateTime(date) {
  const now = new Date();
  const targetDate = new Date(date);

  // 设置时区偏移，确保日期比较正确
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDateOnly = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );

  // 计算日期差异（以天为单位）
  const diffTime = nowDate.getTime() - targetDateOnly.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 格式化时间部分
  const hours = targetDate.getHours().toString().padStart(2, "0");
  const minutes = targetDate.getMinutes().toString().padStart(2, "0");
  const timeStr = `${hours}:${minutes}`;

  if (diffDays === 0) {
    return `今天 ${timeStr}`;
  } else if (diffDays === 1) {
    return `昨天 ${timeStr}`;
  } else if (diffDays === -1) {
    return `明天 ${timeStr}`;
  } else {
    // 对于其他日期，显示为 MM-DD HH:mm 格式
    const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
    const day = targetDate.getDate().toString().padStart(2, "0");
    return `${month}-${day} ${timeStr}`;
  }
}

/**
 * 数字转为千分位
 */
export function formatNumberToThousand(value) {
  const isNumber = typeof value === "number" && !isNaN(value);
  if (!isNumber) return "";
  // 将数字转换为字符串
  const numStr = value.toString();
  // 使用正则表达式来插入逗号
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 手机号4到7位脱敏
export function deFormatPhone(phoneNumber) {
  if (!phoneNumber) return "";
  return phoneNumber.toString().replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

export function strToBase64(str) {
  return Base64.encode(str);
}

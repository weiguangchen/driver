const tokenKey = process.env.TOKEN_KEY;

export async function setStorage(key, data) {
  await uni.setStorageSync(`${tokenKey}:${key}`, data);
}
export function getStorage(key) {
  return uni.getStorageSync(`${tokenKey}:${key}`);
}
export function removeStorage(key) {
  return uni.removeStorageSync(`${tokenKey}:${key}`);
}

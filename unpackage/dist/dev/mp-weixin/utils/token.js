"use strict";
const common_vendor = require("../common/vendor.js");
const tokenKey = "test-driver-token";
function setToken(data) {
  return common_vendor.index.setStorageSync(tokenKey, data);
}
function getToken() {
  return common_vendor.index.getStorageSync(tokenKey);
}
function removeToken() {
  return common_vendor.index.removeStorageSync(tokenKey);
}
exports.getToken = getToken;
exports.removeToken = removeToken;
exports.setToken = setToken;

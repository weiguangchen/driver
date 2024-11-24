"use strict";
const common_vendor = require("../common/vendor.js");
const useLocationStore = common_vendor.defineStore("location", {
  state: () => {
    return {
      location: null
    };
  },
  actions: {
    setLocation(payload) {
      this.location = payload;
    }
  }
});
exports.useLocationStore = useLocationStore;

"use strict";
function sleep(time = 2e3) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
exports.sleep = sleep;

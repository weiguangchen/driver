import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import * as Pinia from 'pinia';

import uvUI from '@/uni_modules/uv-ui-tools'
export function createApp() {
  const app = createSSRApp(App)
  // pinia
  app.use(Pinia.createPinia());
  // uv-ui
  app.use(uvUI);
  
  return {
    app,
	Pinia
  }
}
// #endif
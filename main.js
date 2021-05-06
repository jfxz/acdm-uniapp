import Vue from 'vue'
import App from './App'
import store from './store'
import uView from "uview-ui";
// import scan from './components/p-scan/scan.vue'
Vue.prototype.$store = store
App.mpType = 'app'
// #ifdef H5
import tips from './components/top-tips'
Vue.prototype.$tips = tips.install;
// #endif
Vue.use(uView);
// Vue.component('scan',scan);
// 全局filters
// import * as filters from 'common/filters/format-time.js'
// Object.keys(filters).forEach((key) => {
//   Vue.filter(key, filters[key])
// })

// 全局提示变量定义
Vue.prototype.$message = (message, icon = 'none', position = 'center', duration = 2000) => {
  uni.showToast({
  	title: message,
  	duration: duration,
  	icon: icon,
    position: position
  })
}

// 全局加载变量定义
Vue.prototype.$loading = (title) => {
  uni.showLoading({
  	title: title || '加载中',
		icon: 'loading',
		mask: true
  })
}
const app = new Vue({
    ...App
})
app.$mount()

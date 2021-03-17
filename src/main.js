
import App from './App'
import Vue from 'vue'
import router from './router/index'
import store from './store'
import './permission' 
import 'babel-polyfill'
import 'normalize.css/normalize.css' 
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.scss' 

import eventBus from './utils/eventBus'
Vue.use(eventBus)
//element
import Element from 'element-ui'
Vue.use(Element, {
  size: 'medium'
})
// import echarts from 'echarts'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// import BaiduMap
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  ak: 'FHrkORZnT5ZfiEWpGwCkOlw1BnsF7IWq'
})
//print
import Print from 'vue-print-nb'//调用浏览器打印插件
Vue.use(Print);
// 
import * as filters from './utils/filters' 
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

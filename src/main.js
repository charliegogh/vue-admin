import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less' // 全局样式
import './core/lazy_use' // 按需加载组件
import * as fetch from '@/api'

// 权限认证
import './permission'
Vue.prototype.$fetch = fetch

// 全局配置
import config from './defaultSettings'
Vue.prototype.$config = config

// 动态表单
import '@/components/c-form/install.js'

// 全局过滤器
import * as filters from './filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false
// 环境
Vue.prototype.isPro = process.env.NODE_ENV === 'production'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

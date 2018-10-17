// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'                 //路由
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import ElementUI from 'element-ui';         //element组件
import 'element-ui/lib/theme-chalk/index.css';  //样式得单独引入
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie 缓存
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios 请求
import { isAuth } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'  //本地储存
import Croppa from 'vue-croppa'
import 'vue-croppa/dist/vue-croppa.css'



Vue.use(ElementUI);
Vue.use(VueCookie)
Vue.use(Croppa)
Vue.config.productionTip = false


// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock   index.html引入
if (process.env.NODE_ENV !== 'production') {
    require('@/mock')
}
// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法

// 保存整站vuex本地储存初始状态
// window.SITE_CONFIG['storeState'] = cloneDeep(store.state)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

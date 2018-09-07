// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll);

import axios from 'axios'
var instance = axios.create({
  baseURL: 'http://msspsvr.emarbox.com',
  timeout: 8000,
  headers: {
    'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
  }
});
Vue.prototype.$http = instance;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  components: { App },
  template: '<App/>'
})

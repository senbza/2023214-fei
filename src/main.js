// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueAxios from 'vue-axios'
import axios from 'axios'
import VueVant from 'vant';
import 'vant/lib/index.css';
Vue.use(VueVant)
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
import VueRouter from 'vue-router'
Vue.use(VueRouter)
 

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})

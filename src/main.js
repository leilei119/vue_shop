// 入口文件
import Vue from 'vue'
import App from './App.vue'
import router from './router' //引入router.js
import './assets/css/global.css' // 导入全局样式表

import { Form, FormItem, Input, Button, Message } from 'element-ui'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios//全局配置axios  将ajax挂载到vue的原型对象上


Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.prototype.$mes = Message//全局配置Message 将Message组件挂载到vue的原型对象上


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

// 入口文件
import Vue from 'vue'
import App from './App.vue'
import router from './router' //引入router.js
import './assets/css/global.css' // 导入全局样式表
import { Tabs,TabPane, Alert,Cascader, Select, Option, Tree, Tag, Dialog, Form, FormItem, Input, Button, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, MessageBox } from 'element-ui'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Form)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)


Vue.prototype.$mess = Message//全局配置Message 将Message组件挂载到vue的原型对象上
Vue.prototype.$confirm = MessageBox.confirm//全局配置MessageBox 将MessageBox组件挂载到vue的原型对象上

Vue.component('tree-table', TreeTable)//注册为全局可复用的组件


// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置拦截器,为请求头中的Authorization字段添加token   之后每次请求数据时看这个字段中是否有token就知道是否有权限查看了
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})

//全局配置axios  将ajax挂载到vue的原型对象上
Vue.prototype.$http = axios


Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

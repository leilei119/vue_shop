// 发布阶段的默认入口文件
import Vue from 'vue'
import App from './App.vue'
import router from './router.js' //引入router.js
import './assets/css/global.css' // 导入全局样式表
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor' // 导入富文本编辑器
import echarts from 'echarts'
// 导入进度条NProgress包的js和css
import NProgress from 'nprogress'
import { Timeline, TimelineItem, Upload, CheckboxGroup, Checkbox, Steps, Step, Tabs, TabPane, Alert, Cascader, Select, Option, Tree, Tag, Dialog, Form, FormItem, Input, Button, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, MessageBox } from 'element-ui'

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
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(TimelineItem)
Vue.use(Timeline)


Vue.prototype.$mess = Message//全局配置Message 将Message组件挂载到vue的原型对象上
Vue.prototype.$confirm = MessageBox.confirm//全局配置MessageBox 将MessageBox组件挂载到vue的原型对象上
Vue.prototype.$echarts = echarts//全局配置echarts 将echarts组件挂载到vue的原型对象上

Vue.component('tree-table', TreeTable)//将树形表格插件注册为全局可复用的组件
Vue.use(VueQuillEditor)//将富文本编辑器插件注册为全局组件



// 配置请求的根路径
axios.defaults.baseURL = 'http://39.105.174.57:8889/api/private/v1/' // 部署服务器的地址
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 设置拦截器,为请求头中的Authorization字段添加token   之后每次请求数据时看这个字段中是否有token就知道是否有权限查看了
// 在request请求拦截器中展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 在最后必须return config
    return config
})

// 在response响应拦截器中隐藏进度条NProgress.done()
axios.interceptors.response.use(config => {
    NProgress.done()
    // 在最后必须return config
    return config
})

//全局配置axios  将ajax挂载到vue的原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false


// 全局过滤器  ：格式化时间 daraFormat过滤器名字 originVal要处理的时间数据  过滤器函数
Vue.filter('dataFormat', function (originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


new Vue({
    router,
    render: h => h(App),
}).$mount('#app')

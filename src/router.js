import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/home/home.vue'
import Welcome from './components/home/welcome.vue'
import Users from './components/home/user/users.vue'
import Rights from './components/home/power/Rights.vue'
import Roles from './components/home/power/Roles.vue'
import Cate from './components/home/goods/Cate.vue'
import Params from './components/home/goods/Params.vue'
import List from './components/home/goods/List.vue'
import AddGoodsList from './components/home/goods/AddGoodsList.vue'
import Order from './components/home/orders/Order.vue'
import Report from './components/home/report/Report.vue'

Vue.use(Router)

// 创建接收路由
const router = new Router({
    routes: [
        // 访问的是/  就进入登录组件
        {
            path: '/',
            redirect: '/login',
        },
        // 登录路由组件
        {
            name: 'denglu',
            path: '/login',
            component: Login,
            meta: {// 具体权限  有无权限访问
                //isAuth:false, //不参与权限
                title: '登录'
            }
        },
        // 主页路由组件
        {
            name: 'zhuye',
            path: '/home',
            component: Home,
            meta: { // 具体权限  有无权限访问
                //isAuth:false, //不参与权限
                title: '后台主页'
            },
            redirect: '/welcome',//只要访问的是home就重定向到welcome
            children: [
                {// 欢迎页
                    name: 'huanying',
                    path: '/welcome',
                    component: Welcome
                },
                {// 用户列表
                    name: 'usersList',
                    path: '/users',
                    component: Users
                },
                {// 权限列表
                    name: 'rightslist',
                    path: '/rights',
                    component: Rights
                },
                {// 角色列表
                    name: 'roleslist',
                    path: '/roles',
                    component: Roles
                },
                {// 商品分类
                    name: 'goodsCate',
                    path: '/categories',
                    component: Cate
                },
                {// 分类参数
                    name: 'cateParam',
                    path: '/params',
                    component: Params
                },
                {// 商品列表
                    name: 'goodList',
                    path: '/goods',
                    component: List,
                },
                {// 添加商品
                    name: 'addgood',
                    path: '/goods/add',
                    component: AddGoodsList
                },
                {//订单管理
                    name:'orderlist',
                    path:'/orders',
                    component:Order
                },
                {//数据报表
                    name:'report',
                    path:'/reports',
                    component:Report
                }
            ]
        }
    ]
})


// 挂载路由导航守卫
// 全局前置路由守卫：初始化时执行，每次路由切换前执行
router.beforeEach((to, from, next) => {
    // 如果用户访问的是登录页  就直接放行
    if (to.path === '/login') return next()
    // 从sessionStorage中获取到保存的token值
    const token = window.sessionStorage.getItem('token')
    // 没有token，强制跳转到登录页
    if (!token) return next('/login')
    next()
})

// 全局后置路由守卫 ：初始化时执行，每次路由切换后执行
router.afterEach((to) => {
    document.title = to.meta.title || '电商后台管理系统'
})



// 暴露路由
export default router
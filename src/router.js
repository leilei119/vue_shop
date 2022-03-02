import Vue from 'vue'
import Router from 'vue-router'

// 路由懒加载
const Login = () => import(/* webpackChunkName: "login" */ './components/Login.vue')              

const Home = () => import(/* webpackChunkName: "home_welcome" */ './components/home/home.vue')
const Welcome = () => import(/* webpackChunkName: "home_welcome" */ './components/home/welcome.vue')

const Users = () => import(/* webpackChunkName: "users" */ './components/home/user/users.vue')

const Rights = () => import(/* webpackChunkName: "rights_roles" */ './components/home/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "rights_roles" */ './components/home/power/Roles.vue')

const Cate = () => import(/* webpackChunkName: "goods_cate_params_list_add" */ './components/home/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "goods_cate_params_list_add" */ './components/home/goods/Params.vue')
const List = () => import(/* webpackChunkName: "goods_cate_params_list_add" */ './components/home/goods/List.vue')
const AddGoodsList = () => import(/* webpackChunkName: "goods_cate_params_list_add" */ './components/home/goods/AddGoodsList.vue')

const Order = () => import(/* webpackChunkName: "order" */ './components/home/orders/Order.vue')
const Report = () => import(/* webpackChunkName: "report" */ './components/home/report/Report.vue')

Vue.use(Router)

// 创建接收路由
const router  = new Router({
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
// router.afterEach((to) => {
//     document.title = to.meta.title || '电商后台管理系统'
// })



// 暴露路由
export default router
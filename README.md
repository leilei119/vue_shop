# vue_shop
    可以cmd 命令创建
    也可以用可视化面板创建： vue ui
## 存在跨域问题使用token，不存在跨域使用cookie和session  来维持登录状态

## 格式化和eslint与法冲突
    格式化快捷键：shift+alt+f 
    格式化的时候会把所有的语句都加;号 ''变成""
    不想加分号 不想用双引号就需要配置:根路径新建文件  .prettierrc    进行配置
    {
        "semi":false,
        "singleQuote":true
    }

## GitHub
### GitHub第一次上传:
    初始化:        git init
    查看状态:      git status
    添加到缓存区:  git add  项目名
    查看状态:      git status
    提交给仓库:    git commit -m “描述”
    查看状态:      git status
    添加远程仓库:git remote add origin git@github.com:leilei119/vue2_test.git
    提交到远程仓库:git push -u origin master(第一次提交加-u 以后就不用加了)

### GitHub上传过一次之后再次(修改了代码)上传:
    查看状态:      git status
    添加到缓存区:  git add  项目名
    查看状态:      git status
    提交给仓库:    git commit -m “描述”
    查看状态:      git status
    提交到远程仓库: git push origin master



## 登录功能
### 每做一个功能  就创建一个子分支  最后在整合
        git checkout -b login    
        查看当前所有分支   git branch
### 登录时先用element的表单预验证，成功之后发起请求
        //登陆成功之后的行为
        //1.将token保存到客户端的sessionStorage中
        //  1）项目中除了登录之外的其他API接口，必须在登陆之后才能访问，所以需要携带token来验证
        //  2）token只在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem(res.data.token)

        //2.通过编程式导航跳转到后台主页，路由地址/home
        this.$router.push('/home')



## 路由导航守卫
    在router.js中进行 对路由进行权限控制
### 全局守卫 ：
    全局前置守卫：初始化时执行，每次路由切换前执行
    // 挂载路由导航守卫
    //全局前置路由守卫：初始化时执行，每次路由切换前执行    
    router.beforeEach((to,from,next)=>{
        // 如果用户访问的是登录页  就直接放行
        if(to.path === '/login') return next()
        // 从sessionStorage中获取到保存的token值
        const token = window.sessionStorage.getItem('token')
        // 没有token，强制跳转到登录页
         if(!token) return next('/login')
        
        next()
    })

    // 全局后置路由守卫 ：初始化时执行，每次路由切换后执行
    router.afterEach((to)=>{
        document.title = to.meta.title || '电商后台管理系统'
    })
### 独享守卫  :在设置路由的某个组件中写路由守卫 beforeEach
### 组件内守卫：再组件中写路由守卫   boforeRouterEnter((to,from,next)=>{...........})

## 退出功能
    基于token的方式实现退出比较简单，只需要销毁本地的token
    //清空token
    window.sessionStorage.clear()
    // 跳转到登录页
    this.$router.push('/login)

## MVVM模型
    M：对应data中的数据
    V：模板
    VM：Vue实例对象

## 插件
### axios:发送网络请求
    安装：npm i axios   
    //main.js中全局配置
    import axios from 'axios'
    // 配置请求的根路径
    axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    Vue.prototype.$http = axios//全局配置axios  将ajax挂载到vue的原型对象上

    //使用： // 预验证痛过之后发起登录请求 返回promis用await async修饰
    const { data:res } = await this.$http.post('login',this.loginForm)

    if(res.meta.status !== 200) return this.$mes.error('登陆失败！')
    this.$mes.success( '登陆成功!')

### vuex：对Vue应用中多个组件的共享状态进行集中式的管理（读/写）
### vue-router:专门来实现单页面(SPA)应用
#### 路由的基本使用
    component组件，用于展示页面内容，当浏览器的路径改变时，对应的组件就会显示
    安装:    npm i vue-router
    //新建一个文件专门存放路由    router.js
    import Vue from 'vue'
    import Router from 'vue-router'
    import Login from './components/Login.vue'
    //使用插件
    Vue.use(Router)
    // 创建接收路由
    const router = new Router({
        routes: [
            // 登录路由组件
            {
                name:'denglu',
                path:'/login',
                component:Login
            }
        ]
    })
    // 暴露路由
    export default router

    //在main.js中引入router.js
    import router from './router' //引入router.js
    //使用
    new Vue({
        router,
        render: h => h(App),
    }).$mount('#app')
#### 编程式路由导航
    不借助router-link 实现路由跳转，让路由跳转更加灵活
    this.$router.
### 按需引入 ：npm install babel-plugin-component -D 

## element-ui
### form表单
    表单都必须有一个 ：model='loginform' 来管理表单项的属性  v-model="loginform.name"
    在data中进行统一管理
    data() {
      return {
        loginform: {
          name: '',
          ......
        },
    }
### elementui对表单的校验
    1.通过 rules 通过属性绑定验证规则对象：    :rules="loginrules"
    2.再data中声明rules：{} 来写具体的校验
    3.将Form-Item的prop 属性设置为需校验的字段名，绑定不同的验证规则：  prop="name"
### elementui重置表单resetFields
    为表单添加ref引用对象: ref='loginFormRef'
    获取到ref引用对象并调用重置的方法：  this.$refs.loginFormRef.resetFields()
### elementui表单的预验证validate
    获取到ref引用对象并调用validate方法：  this.$refs.loginFormRef.validate(回调函数)
     this.$refs.loginFormRef.validate(async valid =>{
        // 预验证没通过false  直接返回
        if(!valid) return
        ......
    })
### elementui消息提示
    全局配置Message 将Message组件挂载到vue的原型对象上
    Vue.prototype.$mes = Message
    使用：
    this.$mes.error('登陆失败！')
    this.$mes.success( '登陆成功!')

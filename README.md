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
### 登录全部做完提交到github
        git status                          查看状态
        git add .                           所有代码提交到暂存区
        git status                          再次查看状态
        git commit -m "完成了登录功能"       把所有代码提交到本地仓库中
        git branch                          查看分支/所有代码都提交到了login分支中
        把login分支中的所有代码提交到master主分支中
        git checkout master                 切换到master主分支
        git branch                          查看当前是否再主分支上
        git merge login                     吧login里面的代码合并到master
        git push                            吧本地的master分支推送到云端的github中（远程推送）

### 把本地的子分支推送到云端进行保存
        git checkout login              切换到login分支             
        git branch                      查看当前所属分支            
        git push -u origin login        吧本地的login子分支推送到远端的origin仓储里面同时叫做login子分支来进行保存    

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
### menu：unique-opened 左侧菜单导航只保持展开一个子菜单
### menu：router 是否使用vue-router模式，使用时候会在激活导航时以index作为path进行路由跳转 :router="true"
### 解决点击菜单栏高亮并选中的问题
    思路：将点击的地址保存到sessionStorage 
        <el-menu :default-active="activePath" >
            <!-- 二级菜单 -->
            <el-menu-item
                v-for="mc in m.children"
                :key="mc.id"
                :index="'/' + mc.path"
                @click="saveNavState('/' + mc.path)"
            >
        </el-menu>
        // 点击菜单栏保存当前点击的path地址
        saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        }


         页面一加载的时候就把地址取出赋值给default-active
         data() {
            return {
            activePath:'',//被激活的链接地址
            }
        },

        // 点击菜单栏保存当前点击的path地址
        saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath = activePath
        }

        // 页面一加载就执行
        created() {
            // 保存激活的状态地址
            this.activePath=window.sessionStorage.getItem('activePath')
        },

## 通过接口获取菜单数据
    通过axios请求拦截器添加token，保证拥有获取数据的权限
    // 配置请求的根路径
    axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

    // 设置拦截器,为请求头中的Authorization字段添加token  之后每次请求数据时看这个字段中是否有token就知道是否有权限查看了
    axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 在最后必须return config
    return config
    })

    //全局配置axios  将ajax挂载到vue的原型对象上
    Vue.prototype.$http = axios

## 查询用户列表
### 请求接口时如果有多个参数要求，可以写成一个参数对象
    data() {
        return {
            // 获取用户列表的参数对象
            queryInfo:{
                query:'',//查询参数
                pagenum:1,//当前页码
                pagesize:10,//每页显示条数
            },
        }
    },
    在请求接口时的参数写法：const {data:res} = await this.$http.get('users',{params:this.queryInfo})

### 渲染表格
    el-table：  stripe 隔行变色
                data  绑定数据
    <el-table-column type="index"></el-table-column>  索引列            
    prop：要绑定的数据列名
    label：要展示的列名
    sortable：排序

#### 渲染状态列用作用域插槽
    <el-table-column prop="mg_state" label="状态">
        <!-- 使用作用域插槽实现状态的展示 -->
        <template slot-scope="scope">
        <!-- {{scope.row}} 能取到这一行的所有数据-->
        <el-switch
            v-model="scope.row.mg_state"
            active-color="#1cbcc5"
            inactive-color="#ff4949"
        >
        </el-switch>
        </template>
    </el-table-column>
#### 使用作用域插槽自定义列的渲染：表格中的操作
    <el-table-column label="操作" width="180">
        <template slot-scope="scope">
        <!-- {{scope.row}} -->
        <el-button type="primary" icon="el-icon-edit" circle></el-button>
        <el-button type="danger" icon="el-icon-delete" circle></el-button>
        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-s-tools" circle></el-button>
        </el-tooltip>
        </template>
    </el-table-column>

### 分页组件Pagination 
    <el-pagination
    @size-change="handleSizeChange"        切换每页显示多少条数据
    @current-change="handleCurrentChange"  切换页码
    :current-page="queryInfo.pagenum"      当前页码
    :page-sizes="[2, 3, 4]"
    :page-size="queryInfo.pagesize"        每页显示的条数
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"                         总条数
    >
    </el-pagination>

    // 切换每页显示多少条
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
      this.getUsersList()
      // console.log(`每页显示 ${newpagesize} 条`);
    },
    // 切换页码
    handleCurrentChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum
      this.getUsersList()
      // console.log(`当前页: ${newpagenum}`);
    },

### 用户状态修改：开关按钮   保存到后台数据库
    <el-table-column label="状态">
        <!-- 使用作用域插槽实现状态的展示 -->
        <template slot-scope="scope">
        <!-- {{scope.row}} 能取到这一行的所有数据-->
        <el-switch
            v-model="scope.row.mg_state"
            active-color="#1cbcc5"
            inactive-color="#ff4949"
            @change="handelSwitchState(scope.row)"  监听switch改变的事件  吧整行数据返回
        >
        </el-switch>
        </template>
    </el-table-column>


    // 监听switch开关状态的改变
    async handelSwitchState(userinfo){
        const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        if(res.meta.status !== 200){
            userinfo.mg_state = !userinfo.mg_state
            return this.$mess.error('更新状态失败！')
        }
        this.$mess.success('更新状态成功.')
    }

### 搜索功能
     v-model双向绑定
     @click="getUsersList" 直接绑定获取用户数据的方法
     clearable属性可得到一个可清空的输入框使用clearable属性即可得到一个可清空的输入框
     @clear="getUsersList"	在点击clearable 属性生成的清空按钮时触发clear

     <!-- 搜索框区域 -->
    <el-col :span="20">
        <el-input placeholder="你要搜索啥？^_^" class="ss" v-model="queryInfo.query" clearable @clear="getUsersList">
        <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
        </el-input>
    </el-col>

    data() {
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                query: '', //搜索功能的查询参数
                pagenum: 1, //当前页码
                pagesize: 2, //每页显示的条数
            },
        }
    },

### 添加用户的功能
#### element对话框
    <!-- 对话框区域 -->           对话框是否打开的属性                           关闭对话框的事件
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
    <!-- 内容区域 -->
    <span>123</span>
    <!-- 底部区域 -->
    <div slot="footer" class="dialog-footer">
        <!--                           点击取消关闭对话框 -->
        <el-button class="bt" @click="addDialogVisible = false">取 消</el-button>
        <el-button class="tjyh" @click="addUser">确 定</el-button>
    </div>
    </el-dialog>

    <!-- 添加用户区域 -->
    <el-col :span="4">            点击打开对话框
        <el-button class="tjyh" @click="addDialogVisible = true">添加用户</el-button>
    </el-col>

    data() {
    return { 
      addDialogVisible:false,// 对话框的显示和隐藏
    }
    methods: {
        // 监听添加用户对话框的关闭事件，将表单进行清空
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        }
    }
#### element自定义校验规则
     data() {
        // 自定义校验规则：邮箱 rule：校验规则  value：要校验的值 callback：回调函数
        var checkemail = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('邮箱不能为空'))
            }
            // 验证邮箱的正则
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            // 合法的邮箱
            if (regEmail.test(value)) return callback()
            callback(new Error('请输入合法的邮箱'))
        }
    return {
        addFormRules: {
        //添加表单的验证规则对象
        email: [{ required: true,validator: checkemail, trigger: 'blur' }],
      },
    }
#### 添加用户
    <!-- 底部区域 -->
    <div slot="footer" class="dialog-footer">
        <el-button class="bt" @click="addDialogVisible = false"
        >取 消</el-button
        >
        <el-button class="tjyh" @click="addUser"
        >确 定</el-button
        >
    </div>

    addUser(){
        // 添加之前先进行预验证
        this.$refs.addFormRef.validate(async valid=>{
            // 未通过直接返回
            if(!valid) return
            // 通过之后发起添加用户的网络请求
            const {data:res} = await this.$http.post('users',this.addForm)
            if(res.meta.status!==201) return this.$mess.error('添加用户失败！')

            this.$mess.success('添加用户成功！')
            // 成功之后直接关闭对话框
            this.addDialogVisible = false
            // 刷新用户列表
            this.getUsersList()
        })
    }

### 用户修改操作功能
#### 打开修改的对话框之后需要吧用户信息展示出来，根据id查询用户信息
    return {
      editDialogVisible:false,// 修改用户的对话框的显示和隐藏
      editForm:{},//修改用户的信息
      // 修改用户表单的验证规则对象
      editFormRules:{....}
    }

    <el-button
        ...
        @click="showEditDialog(scope.row.id)"
    ></el-button>

    <!-- 修改用户的对话框区域 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%">
    <!-- 内容区域 -->
    <el-form
         ref="editFormRef"
          :model="editForm"
          :rules="editFormRules"
    >
    .......
    </el-dialog>

     // 点击编辑按钮弹出修改用户信息的对话框((根据 ID 查询用户信息))
    async showEditDialog(userinfo){
      this.editDialogVisible = true
      const {data:res} = await this.$http.get(`users/${userinfo}`)
      if(res.meta.status!==200) return this.$mess.error('获取用户信息失败！')
      this.editForm =res.data
    },
#### 修改用户信息并提交
    editUser(){
      this.$refs.editFormRef.validate(async valid=>{
        // 预验证未通过
        if(!valid) return 

        const {data:res} = await this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
        if(res.meta.status!==200) return this.$mess.error('更新失败！')

        this.$mess.success('更新成功！')
        // 更新完关闭对话框
        this.editDialogVisible = false
        // 更新完重新加载用户列表
        this.getUsersList()
      })
    }

### 删除用户的操作 根据用户id进行删除
    <el-button
    type="danger"
    icon="el-icon-delete"
    circle
    @click="removeUserById(scope.row.id)"
    ></el-button>

    async removeUserById(id){
      const confirmResult = await this.$confirm(
        '是否确定删除此用户？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type: 'warning'
      }).catch(err => err)  返回错误信息

      // 如果用户点击确认，返回字符串 confirm，取消，返回字符串 cancel
      if(confirmResult !== 'confirm') return this.$mess.info('已取消删除.')
      const {data:res} = await this.$http.delete('users/'+id)
      if(res.meta.status!==200) return this.$mess.error('删除用户失败！')
        // 刷新用户列表
        this.getUsersList()
        this.$mess.success('删除用户成功！')
    }
### 将用户列表功能代码提交到git
    git branch              查看所处分支
    git checkout -b user    创建新的分支并切换到user分支上
    git branch              查看所处分支
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


    /*如果请求接口参数是对象，访问方式是get 参数名：params*/
    data：// 查询条件   --接口需要的参数
        queryInfo:{
            type:3,
            pagenum:1,//当前页码值
            pagesize:5,//每页显示多少条数据
        },
    methods:const {data:res} = await this.$http.get('categories',{params:this.queryInfo})


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
### element表格展开列和索引列
    <!-- 展开列 -->
    <el-table-column type="expand"></el-table-column>
    <!-- 索引列 -->
    <el-table-column type="index"></el-table-column>

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
    git branch                              查看所处分支
    git checkout -b user                    创建新的分支并切换到user分支上
    git branch                              查看所处分支
    git status                              检查当前user上文件状态 都是红色
    git add .                               将所有文件添加到暂存区
    git status                              再重新检查状态，都是绿色
    git commit -m "完成了用户列表功能的开发"  将user分支提交到仓库中

    现在看github/码云中并没有user的分支，吧user分支推送到云端的github/码云中
    git push -u origin user    吧本地user分支推送到云端origin仓库中保存，同时以user分支进行保存（第一次提交  要加-u origin user）
    吧所有代码合并到主分支上
    git checkout master   切换到主分支
    git merge user        吧user里的代码合并到主分支
    git push              吧本地master提交到云端进行保存（已经有master  就不需要加后面的-u ）

## 权限管理功能开发
    新的功能开始 创建个新的分支 并切换到新分支上
    git checkout -b rights
    吧本地的分支rights推送到云端进行保存（第一次推送）
    git push -u origin rights
### 角色下权限数据的渲染以及删除
    作用域茶菜取到的scope数据美化
    <pre>{{ scope.row }}</pre>

    <!-- 展开列 使用作用域插槽实现展开列下面的权限列表-->
    <el-table-column type="expand">
        <template slot-scope="scope">
        <!-- 添加动态样式类， bdbottom所有row都有底边框线，bdtop顶边框线只有在下标为0的元素上才有 -->
        <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bdbottom', i1 === 0 ? 'bdtop' : '','vcenter']">

            <!-- 渲染一级权限 -->
            <el-col :span="5">
            <el-tag closable @close="removeRightsById(scope.row,item1.id)">> {{ item1.authName }} </el-tag>
            <i class="el-icon-caret-right"></i>
            </el-col>

            <!-- 渲染二级和三级权限 -->
            <el-col :span="19">

            <!-- 添加动态样式类， 下标为0的元素上不加上边框线bdtop，其余都加 -->
            <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'bdtop','vcenter']">
                    <!-- 渲染二级权限 -->
                <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightsById(scope.row,item2.id)">> {{ item2.authName }} </el-tag>
                    <i class="el-icon-caret-right"></i>
                </el-col>

                <!-- 渲染三级权限 -->
                <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightsById(scope.row,item3.id)">> {{ item3.authName }} </el-tag>
                </el-col>
            </el-row>
            </el-col>
        </el-row>
        </template>
    </el-table-column>

     // 获取角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$mess.error('获取角色列表失败哦~')

      this.rolesList = res.data
    },
    // 根据id删除对应的权限
    async removeRightsById(roles,rightsId){
        // 弹框提示是否删除
        const confirmRes = await this.$confirm('确认删除此权限吗？','提示',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
        }).catch(err =>err)
        // 取消删除
        if(confirmRes !== 'confirm') return this.$mess.info('取消了删除.')

        // 调删除接口
        const {data:res} = await this.$http.delete(`roles/${roles.id}/rights/${rightsId}`)
        if(res.meta.status!==200) return this.$mess.error('删除权限失败！')
        // 刷新权限列表   返回的data, 是当前角色下最新的权限数据 
        // 吧服务器返回的数据直接赋值给角色的children属性
        roles.children = res.data
        this.$mess.success('删除权限成功！')
    }
### 分配权限的功能
#### 树形结构element
    <!-- 主体区域  树形控件 treeProps:要展示的对象    多选框          默认全部打开所有节点        选中的值是唯一id而不是文本-->
    <el-tree :data="rightsList" :props="treeProps" show-checkbox :default-expand-all="true" node-key="id"></el-tree>
#### 吧已有的权限在树形结构中默认勾选上（递归函数的方式吧三级节点id保存到数组中）
    tree：   :default-checked-keys="defCheckedKeys" //默认选中的数组
    el-dialog：@close="serRightsDialogClose"    //监听关闭对话框
    data：   defCheckedKeys:[],                //树形结构中默认选中的节点id值数组
             rolesId:'',     //当前要授权的角色id
    methods：
            // 打开对话框并获取所有的权限数据role（scope.row）就是当前角色，是最父级的节点
            async openRightsDialog(role) {
                
                // 将当前角色id保存，用于后面的具体授权
                this.rolesId = role.id

                const { data: res } = await this.$http('rights/tree')
                if (res.meta.status !== 200) return this.$mess.error('获取权限列表失败！')
                this.rightsList = res.data
                
                // 递归获取三级的节点的id 在打开属性结构时，就把已有的权限选中
                this.getDefCheckedKeys(role,this.defCheckedKeys)
                // 打开权限配置对话框
                this.rightsDialogVisible = true
            },
            // 通过递归的形式，获取角色下所有三级权限的id，并保存到defCheckedKeys数组中
            // node节点：父级角色-用来判断三级节点   arr数组：用来保存数组
            getDefCheckedKeys(node,arr){
                // 先判断是否为三级节点:三级节点不包含children
                if(!node.children){
                    // 是三级节点：将节点中的id保存起来
                    return arr.push(node.id)
                }
                // 不是三级节点：通过递归获取到最终的三级节点  
                // 循环当前node里面的所有children数组，每循环一项拿到一个子节点item，再根据item再次调用递归函数，把当前item当做一个子节点给传进去，同时吧数组也传进去，只要递归完毕，就把所有三级节点id保存到了数组里面
                node.children.forEach(item => {
                    this.getDefCheckedKeys(item,arr)
                });
            },
            // 关闭对话框就把默认选中数组中的数据清空一下
            serRightsDialogClose(){
                this.defCheckedKeys=[]
            }
#### 分配权限功能
    tree: ref="treeRef"   //给tree一个引用对象
    获取当前要授权的角色id
    data：....
         rolesId:'',//当前要授权的角色id
    methods：async openRightsDialog(role) {
                // 将当前角色id保存  用于后面的具体授权
                this.rolesId = role.id
                ......
            }
            // 点击分配权限对话框中确定按钮   给角色授权
            async setRights(){
            // 获取到点击授权的角色id（半选）和权限id（全选） 给tree个引用对象treeRef  调用tree的方法获取id
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]

            // 接口要求授权id要用' ，'号分割
            const idStr = keys.join(',')

            const {data:res} = await this.$http.post(`roles/${this.rolesId}/rights`,{rids:idStr})
            if(res.meta.status!==200) return this.$mess.error('分配权限失败！')

            this.$mess.success('分配权限成功！')
            // 刷新一下角色列表
            this.getRolesList()
            // 关闭对话框
            this.rightsDialogVisible = false

            }

#### 用户列表功能中的分配角色功能
    <el-button
        type="warning"
        icon="el-icon-s-tools"
        circle
        @click="openRolesDialog(scope.row)"    点击分配角色按钮打开对话框，将用户信息传过去
    ></el-button>

    dialog：<div>              用户信息双向绑定
                <p>当前用户：{{ userinfoByRoles.username }}</p>
                <p>当前角色：{{ userinfoByRoles.role_name }}</p>
                <p>
                    分配新角色：          选中的新角色id
                    <el-select v-model="selectRolesId" placeholder="请选择">
                    <el-option
                        v-for="item in rolesList"
                        :key="item.id"
                        :label="item.roleName"    下拉框文本
                        :value="item.id"          下拉框id
                    >
                    </el-option>
                    </el-select>
                </p>
            </div>
    
    data：....
            userinfoByRoles: {}, // 需要被分配角色的用户信息
            setRolesDialogVisible: false, //显示或隐藏分配角色的对话框
            selectRolesId:'',//下拉框选择的新角色
            rolesList: [], //所有角色的数据列表(需要循环渲染角色列表)
    methods:...
            // 点击分配角色按钮弹出对话框
            async openRolesDialog(userinfo) {
                // 吧要分配角色的用户信息存起来
                this.userinfoByRoles = userinfo

                // 在打开分配角色的对话框之前，获取所有角色列表
                const { data: res } = await this.$http.get('roles')
                if (res.meta.status !== 200) return this.$mess.error('获取角色列表失败！')

                this.rolesList = res.data

                // 打开对话框
                this.setRolesDialogVisible = true
            },
            // 将分配的新角色selectRolesId保存到后台用户userinfoByRoles.id身上
            async saveRolesInfo() {
                // 有没有新角色
                if(!this.selectRolesId) return this.$mess.info('请选择要分配的角色')

                const {data:res} = await this.$http.put(`users/${this.userinfoByRoles.id}/role`,{rid:this.selectRolesId})
                if(res.meta.status !==200) return this.$mess.error('更新角色失败')

                this.$mess.success('更新角色成功！')
                //  刷新用户列表
                this.getUsersList()
                // 关闭对话框
                this.setRolesDialogVisible = false
            },
            // 监听分配角色对话框关闭事件，重置下拉框
            setRolesDialogClosed(){
                this.selectRolesId = ''
                this.userinfoByRoles = {}
            }
### 推送权限管理功能代码到github
    git branch                              查看分支
    git add .                               所有修改过得文件添加到暂存区
    git commit -m "完成了权限功能的开发"      将代码提交到rights分支
    git push                                吧本地rights分支push到github的rights分支中，不需要加-u因为云端已经有了rights分支
    git checkout master                     切换到主分支
    git merge rights                        吧本地rights分支中的代码合并到本地master主分支
    git push                                再把本地master推送到github的master中进行保存

## 商品管理-商品分类功能开发
    新的功能开始 创建个新的分支 并切换到新分支上
    git checkout -b goods_cate
    吧本地的分支rights推送到云端进行保存（第一次推送）
    git push -u origin goods_cate
### 渲染树形表格
#### 依赖第三方插件：（这个的索引值只有一级有）
    安装插件：npm i vue-table-with-tree-grid -S
    main.js中：
        import TreeTable from 'vue-table-with-tree-grid'
        Vue.use(TreeTable)
        or
        Vue.component('tree-table',TreeTable)//注册为全局可复用的组件
    data：....
        //为table指定列的定义
        columns:[
            {
                label:'分类名称',
                prop:'cat_name'
            },
            {
                label:'是否有效',
                type:'template',//将当前列定义为模板列
                template:'isok'//当前这一列使用的模板名称
            },
            {
                label:'排序',
                type:'template',//将当前列定义为模板列
                template:'order'//当前这一列使用的模板名称
            },
            {
                label:'操作',
                type:'template',//将当前列定义为模板列
                template:'opt'//当前这一列使用的模板名称
            },
        ]
    .vue中：expand-type取消复选框  show-index 添加索引列 索引列名自定义
        <tree-table class="treetable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen;"></i>
            <i class="el-icon-error" v-else style="color:red;"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level ===0">一级</el-tag>
            <el-tag type="success" size="mini" v-else-if="scope.row.cat_level ===1">二级</el-tag>
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" plain size="mini"
              >删除</el-button
            >
        </template>
    </tree-table>
    
#### element树形表格（这个索引值所有的都有，排序乱）
     <!-- 表格区域 -->
      <el-table
        :data="cateList"
        row-key="cat_id"    
        border
        :tree-props="{ children: 'children' }"  cateList中包含children字段时，被视为树形数据
      >
        <el-table-column prop="cat_name" label="分类名称" sortable>
        </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" sortable>
        </el-table-column>
        <el-table-column prop="cat_level" sortable label="排序">
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" plain size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
### 添加分类功能
    element级联选择器 cascader
    <!-- 级联选择器 options用来指定数据源 props用来指定配置对象-->
    <el-cascader
    :options="parentCateList"
    v-model="selectedKeys"
    :props="cateCaderProps"
    clearable
    size="medium"
    @change="parentCateChanged"></el-cascader>


    //   添加分类对话框的显示与隐藏
    addCateDialogVisible:false,
    addCateForm:{//添加分类的表单数据对象
        cat_name:'',//将要添加的分类名称
        cat_pid:0,//父级分类的id
        cat_level:0//分类的等级，默认要添加的是一级分类
    },
    addCateFormRules:{//添加分类表单的验证规则对象
        cat_name:[
            {required:true,message:'请输入分类名称',trigger:'blur'}
        ]
    },
    parentCateList:[],//父级分类的列表  展示在级联下拉的文本
    selectedKeys:[],//选中的父级分类的id数组
    cateCaderProps:{//指定级联选择器的配置对象
        expandTrigger: 'hover',//鼠标移入展开
        value:'cat_id',//选中的值的id
        label:'cat_name',//选中的值的名称
        children:'children'//父子嵌套用的哪个属性
    },

    
        this.getParentCateList()
        this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList(){
        const {data:res} = await this.$http.get('categories',{params:{type:2}})
        if(res.meta.status!==200) return this.$mess.error('获取父级分类列表成功')

        this.parentCateList = res.data
    },
    // 选择项的值发生变化触发这个函数
    parentCateChanged(){
      
      console.log(this.selectedKeys);
      // 如果selectedKeys数组中的length大于0 证明选中了父级分类
      if(this.selectedKeys.length>0){
        // 为父级分类id赋值： 获取最后一项父级id，不管是一级还是二级父id  都以最后一项的id为准
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
        // 为当前分类的等级赋值:等级就是选中数组的长度 0 1 2一共三个等级
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }else{
        // 反之 没有选中任何父级分类 为父级分类id赋值v
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }

    },
    // 点击确定添加新增加的分类到后台
    addCate(){
      // 表单预验证
      this.$refs.addCateFormRef.validate(async valid=>{
        if(!valid) return

        const {data:res} = await this.$http.post('categories',this.addCateForm)

        if(res.meta.status!==201) return this.$mess.error('保存分类失败！')

        this.$mess.success('保存分类成功！')
        // 刷新分类列表
        this.getCateList()
        // 关闭对话框
        this.addCateDialogVisible = false
      })
      console.log(this.addCateForm);
    },
    // 监听关闭对话框的事件 重置表单数据
    addCateDialogClosed(){
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
    },
### git：吧添加分类的代码上传
    git branch
    git status
    git add .
    git status
    git commit -m "完成了分类功能的开发"
    git push
    git branch
    git checkout master
    git merge goods_cate
    git push
    


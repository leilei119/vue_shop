<template>
  <el-container class="TopContainer">
    <!-- 头部 -->
    <el-header class="header">
      <div class="tb">
        <img src="../../assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>

      <el-button @click="logout" class="tc">Out</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container class="mainContainer">
      <!-- 侧边栏 -->
      <el-aside :width="iscollape ? '64px' : '200px'" class="aside">
        <!-- 折叠和展开 -->
        <div class="toggle-button" @click="showMenu">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#9af1ff"
          text-color="#868689"
          active-text-color="#1cbcc5"
          :unique-opened="true"
          :collapse="iscollape"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 index只接收字符串-->
          <el-submenu v-for="m in menulist" :key="m.id" :index="m.id + ''">
            <template slot="title">
              <i :class="iconlist[m.id]"></i>
              <span>{{ m.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="mc in m.children"
              :key="mc.id"
              :index="'/' + mc.path"
              @click="saveNavState('/' + mc.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ mc.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧 -->
      <el-main class="main">
        <!-- 路由占位符  -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'Home',
  data() {
    return {
      menulist: [], //左侧菜单数据
      iscollape: false, //是否折叠
      iconlist: {
        125: 'iconfont icon-yonghu1',
        103: 'iconfont icon-houtaiguanli-xitongguanli',
        101: 'iconfont icon-23',
        102: 'iconfont icon-houtaiguanli-tiaochawenjuan',
        145: 'iconfont icon-houtaitubiao-16',
      }, //创建图标对象
      activePath:'',//被激活的链接地址
    }
  },
  methods: {
    // 退出功能
    logout() {
      // 清空token
      window.sessionStorage.clear()
      // 编程式导航跳转到登录页
      this.$router.push('/login')
    },
    // 获取左侧菜单数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$mess.error(res.meta.msg)
      this.menulist = res.data
    },
    // 点击按钮，切换菜单的折叠和展开
    showMenu() {
      this.iscollape = !this.iscollape
    },
    // 点击菜单栏保存当前点击的path地址
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  },
  // 页面一加载就执行
  created() {
    this.getMenuList()
    // 保存激活的状态地址
    this.activePath=window.sessionStorage.getItem('activePath')
  },
}
</script>
<style scoped>
.TopContainer {
  height: 100%;
}
.header {
  height: 10% !important;
  background-color: #9af1ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
}
.header .tb {
  display: flex;
  align-items: center;
}
.tb span {
  padding-left: 15px;
  font-size: x-large;
  font-family: cursive;
  color: #ffffff;
  text-shadow: 6px 2px 2px #d7f531;
}
.header img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.aside {
  background-color: #9af1ff;
  overflow: hidden;
}
.main {
  background-color: #fff;
}
.el-menu {
  height: 100%;
  border-right: none;
}
.toggle-button {
  background-color: #b7f7ef;
  text-align: center;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  /* 间距 */
  letter-spacing: 0.2em;
  cursor: pointer;
}
.iconfont {
  padding-right: 10px;
}
.tc{
    background: #1cbcc5;
    border: 1px solid #fee202;
    font-family: cursive;
    color: #f5f5f5;
    text-shadow: 6px 2px 2px #fee202;
    border-radius: 27% !important;

}
</style>
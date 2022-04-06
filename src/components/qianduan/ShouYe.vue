<template lang="">
  <div class="home">
      <el-container>
          <el-header class="header">
              <div class="tb">
                  <img src="../../assets/img/logo.png" alt="" />
                  <el-menu class="el-menu-demo" mode="horizontal"  @select="handleSelect" >
                  <el-menu-item index="1">处理中心</el-menu-item>
                    
                  <el-submenu index="2">
                    <template slot="title">我的工作台</template>
                    <el-menu-item index="2-1">选项1</el-menu-item>
                    <el-menu-item index="2-2">选项2</el-menu-item>
                    <el-menu-item index="2-3">选项3</el-menu-item>
                  </el-submenu>
                  <el-menu-item index="3">消息中心</el-menu-item>
                  <el-menu-item index="4">订单管理</el-menu-item>
                  <el-menu-item index="5">关于我们</el-menu-item>
                  <el-menu-item index="6">地址</el-menu-item>
                  <el-menu-item index="7">电话</el-menu-item>
                </el-menu>
              </div>
          </el-header>
          <el-main>
            <canvas id="dog-walking" style="position:fixed;left:0;bottom:0"></canvas>
          </el-main>
          <el-footer>Footer</el-footer>
      </el-container>
  </div>
</template>

<script>
export default {
  name: 'ShouYe',
  data() {
    return {
    }
  },
  mounted() {
    let canvas = document.querySelector("#dog-walking");
    canvas.width = window.innerWidth;
    canvas.height = 200;
  },
  methods: {
    handleSelect() { },
  
  }
}
</script>

<style scoped>
.header {
  margin-top: 10px;
}
.el-main {
  /* background: #d3055b; */
}
.el-footer {
  /* background: #b3547b; */
}

.header img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.tb {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-container {
  padding: 0 100px;
}

.el-menu--horizontal > .el-menu-item {
  border-bottom: none;
  color: #f4f8ff;
}
.el-menu--horizontal .el-menu-item[data-v-2e35bd73]:not(.is-disabled):focus,
.el-menu--horizontal .el-menu-item[data-v-2e35bd73]:not(.is-disabled):hover {
  color: #d7d9df;
}

.el-menu--horizontal .el-menu .el-menu-item,
.el-menu--horizontal .el-menu .el-submenu__title {
  background-color: #fff0;
  float: none;
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
  color: #f4f8ff;
}
</style>
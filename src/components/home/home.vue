<template>
  <div>
    <el-button @click="logout">Out</el-button>
  </div>
</template>
<script>
export default {
  name: 'Home',
  methods: {
    // 退出功能
    logout() {
      // 清空token
      window.sessionStorage.clear()
      // 编程式导航跳转到登录页
      this.$router.push('/login')
    },
  },
}
</script>
<style scoped>
</style>
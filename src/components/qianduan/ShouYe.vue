<template lang="">
    <div class="home">
        <el-container>
            <el-header class="header">
                <div class="tb">
                    <img src="../../assets/img/logo.png" alt="" />
                    <div>
                        111
                    </div>
                </div>

                <el-button @click="logout" class="tc">Out</el-button>
                </el-header>
            <el-main>Main</el-main>
            <el-footer>Footer</el-footer>
        </el-container>
  </div>
</template>

<script>
export default {
  name: 'ShouYe',
}
</script>

<style scoped>
.header {
  background: #b4d305;
}
.el-main {
  background: #d3055b;
}
.el-footer {
  background: #b3547b;
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
</style>
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb class="cont">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card shadow="always">
      <el-table :data="rightsList" stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="authName"
          sortable
          label="权限名称"
        ></el-table-column>
        <el-table-column prop="path" sortable label="路径"></el-table-column>
        <el-table-column prop="level" sortable label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'Rights',
  data() {
    return {
      rightsList: [], //权限列表数据
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表数据
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status != 200) return this.$mess.error('获取权限列表失败')

      this.rightsList = res.data
    },
  },
}
</script>
<style scoped>
</style>
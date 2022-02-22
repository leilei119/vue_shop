<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb class="cont">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card shadow="always">
      <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <!-- 搜索框区域 -->
        <el-col :span="10">
          <el-input placeholder="你要搜索啥？^_^" class="ss" clearable v-model="queryInfo.query" @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>

        <!-- 添加商品区域 -->
        <el-col :span="4">
          <el-button class="tjyh" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodsList" stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" sortable label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90"></el-table-column>
        <el-table-column prop="add_time" sortable label="创建时间" width="140">
          <template slot-scope="scope">
            <!-- 使用过滤器dataFormat格式化时间格式 -->
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-tooltip
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button type="primary" icon="el-icon-edit" circle></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button type="danger" icon="el-icon-delete" circle @click="romoveGood(scope.row.goods_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 7, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'List',
  data() {
    return {
      //   查询商品参数对象
      queryInfo: {
        query: '', //搜索参数
        pagenum: 1, //当前页码
        pagesize: 5, //每页显示条数
      },
      total: 0, //总条数
      goodsList: [], //商品列表
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //   获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$mess.error('获取商品列表失败。')
        this.goodsList = res.data.goods
        this.total = res.data.total
        console.log(res.data);
    },
    // 切换每页显示的条数
    handleSizeChange(newvpagesize){
      this.queryInfo.pagesize = newvpagesize
      this.getGoodsList()
    },
    // 切换当前页码
    handleCurrentChange(newpagenum){
      this.queryInfo.pagenum = newpagenum
      this.getGoodsList()
    },
    // 打开添加商品页面
    goAddPage(){
      this.$router.push('/goods/add')
    },
    // 点击删除按钮删除商品信息调接口
    async romoveGood(goodsId){
      // 弹窗提示
      const confirmResult = await this.$confirm('确定删除此商品吗？','提示',{
        confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
      }).catch((err) =>err)

      // 如果用户点击确认，返回字符串 confirm，取消，返回字符串 cancel
      if(confirmResult !== 'confirm') return this.$mess.info('已取消删除')
      const {data:res} = await this.$http.delete('goods/'+goodsId)
      if(res.meta.status!==200) return this.$mess.error('删除商品失败')
      this.getGoodsList()
      this.$mess.success('删除商品成功')

    }

  },
}
</script>

<style scoped>
</style>
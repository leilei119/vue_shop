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
          <el-button type="primary"  plain  @click="goAddPage">添加商品</el-button>
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
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle @click="editGood(scope.row.goods_id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
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

      <!-- 编辑商品对话框 -->
      <el-dialog title="编辑商品" :visible.sync="editGoodDialogVisible" width="50%"  @close="editGoodDialogClosed">

          <!-- 内容区域 -->
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="goods_price">
            <el-input type="number" v-model="editForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="goods_number">
            <el-input type="number" v-model="editForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="重量" prop="goods_weight">
            <el-input type="number" v-model="editForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="介绍" >
            <el-input  v-html="editForm.goods_introduce"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="editGoodDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGoodeditGood">确 定</el-button>
        </span>
      </el-dialog>
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

      // 编辑商品
      editGoodDialogVisible: false, //编辑商品对话框的显示与隐藏
      editForm:{

      },
      editFormRules:{
        goods_name:[{ required: true, message: '请输入商品名称', trigger: 'blur' },],
        goods_price:[{ required: true, message: '请输入商品价格', trigger: 'blur' },],
        goods_number:[{ required: true, message: '请输入商品数量', trigger: 'blur' },],
        goods_weight:[{ required: true, message: '请输入商品总量 ', trigger: 'blur' },]
      },
      att:[]
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
    },
    // 切换每页显示的条数
    handleSizeChange(newvpagesize) {
      this.queryInfo.pagesize = newvpagesize
      this.getGoodsList()
    },
    // 切换当前页码
    handleCurrentChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum
      this.getGoodsList()
    },
    // 打开添加商品页面
    goAddPage() {
      this.$router.push('/goods/add')
    },
    // 点击删除按钮删除商品信息调接口
    async romoveGood(goodsId) {
      // 弹窗提示
      const confirmResult = await this.$confirm('确定删除此商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)

      // 如果用户点击确认，返回字符串 confirm，取消，返回字符串 cancel
      if (confirmResult !== 'confirm') return this.$mess.info('已取消删除')
      const { data: res } = await this.$http.delete('goods/' + goodsId)
      if (res.meta.status !== 200) return this.$mess.error('删除商品失败')
      this.getGoodsList()
      this.$mess.success('删除商品成功')
    },
    // 点击打开编辑对话框  根据id差此商品  将获取到的数据赋值给本地
    async editGood(id) {
      const { data: res } = await this.$http.get('goods/' + id)

      if (res.meta.status !== 200) return this.$mess.error('获取商品信息失败')
      this.editForm=res.data
      this.editGoodDialogVisible = true
      console.log(res.data);
    },
    // 点击确定提交数据到后台 预校验 刷新列表 关闭对话框
    editGoodeditGood(){
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) this.$mess.error('请填写必要的表单项')

        const { data: res } = await this.$http.put('goods/'+this.editForm.goods_id,{
          goods_name:this.editForm.goods_name,
          goods_price:this.editForm.goods_price,
          goods_number:this.editForm.goods_number,
          goods_weight:this.editForm.goods_weight,
          goods_introduce:this.editForm.goods_introduce,
          goods_cat:this.editForm.goods_cat
        })
        console.log(this.editForm.goods_cat);
        if (res.meta.status !== 201) return this.$mess.error('更新商品失败')
        this.$mess.success('更新商品成功')
        this.editGoodDialogVisible = false
      })
      
    },
    // 关闭编辑商品对话框
    editGoodDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
  },
}
</script>

<style scoped>
</style>
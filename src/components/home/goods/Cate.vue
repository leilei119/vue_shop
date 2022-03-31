<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb class="cont">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card shadow="always">
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary"  plain @click="openAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- element表格区域 渲染树形数据时，必须要指定 row-key  cateList中包含children字段时，被视为树形数据-->
      <!-- <el-table
        :data="cateList"
        row-key="cat_id"
        border
        :stripe="true"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="cat_name" label="ele/分类名称" sortable>
        </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" sortable>
          <template slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
              style="color: lightgreen"
            ></i>
            <i class="el-icon-error" v-else style="color: red"></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" sortable label="排序">
          <template slot-scope="scope"
            >
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag
              type="success"
              size="mini"
              v-else-if="scope.row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" plain size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table> -->

      <!-- 插件树形表格 -->
      <tree-table class="treetable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#">
        <template slot="isok" slot-scope="scope"
          ><!-- 是否有效 -->
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

        <template slot="order" slot-scope="scope"
          ><!-- 排序 -->
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>

        <template slot="opt" slot-scope="scope"
          ><!-- 操作 -->
          <el-button type="primary" icon="el-icon-edit" plain size="mini" @click="editCateByID(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="removeCateByID(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
        <!-- 内容区域 -->
        <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules">
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- 级联选择器 options用来指定数据源 props用来指定配置对象-->
            <el-cascader :options="parentCateList" v-model="selectedKeys" :props="cateCaderProps" clearable size="medium" @change="parentCateChanged"></el-cascader>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <div slot="footer" class="dialog-footer">
          <el-button class="bt" @click="addCateDialogVisible = false">取 消</el-button>
          <el-button class="tjyh" @click="addCate">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑分类对话框 -->
      <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%" @close="editCateDialogClosed">
        <!-- 内容区域 -->
        <el-form ref="editCateFormRef" :model="editCateForm" :rules="editCateFormRules">
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <div slot="footer" class="dialog-footer">
          <el-button class="bt" @click="editCateDialogVisible = false">取 消</el-button>
          <el-button class="tjyh" @click="editCate">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      cateList: [], //所有商品分类数据
      // 查询条件   --接口需要的参数
      queryInfo: {
        type: 3,
        pagenum: 1, //当前页码值
        pagesize: 5, //每页显示多少条数据
      },
      total: 0, //总数据条数

      //插件树形表格：为table指定列的定义
      columns: [
        {
          label: '插件/分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template', //将当前列定义为模板列
          template: 'isok', //当前这一列使用的模板名称
        },
        {
          label: '排序',
          type: 'template', //将当前列定义为模板列
          template: 'order', //当前这一列使用的模板名称
        },
        {
          label: '操作',
          type: 'template', //将当前列定义为模板列
          template: 'opt', //当前这一列使用的模板名称
        },
      ],

      //   添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      addCateForm: {
        //添加分类的表单数据对象
        cat_name: '', //将要添加的分类名称
        cat_pid: 0, //父级分类的id
        cat_level: 0, //分类的等级，默认要添加的是一级分类
      },
      addCateFormRules: {
        //添加分类表单的验证规则对象
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
      parentCateList: [], //父级分类的列表  展示在级联下拉的文本
      selectedKeys: [], //选中的父级分类的id数组
      cateCaderProps: {
        //指定级联选择器的配置对象
        expandTrigger: 'hover', //鼠标移入展开
        value: 'cat_id', //选中的值的id
        label: 'cat_name', //选中的值的名称
        children: 'children', //父子嵌套用的哪个属性
      },

      // 编辑分类
      editCateDialogVisible:false,//编辑分类的现实与隐藏
      editCateForm:{},//编辑分类对象
      editCateFormRules:{//编辑分类校验对象
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      // get请求 参数用params
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$mess.error('获取商品分类失败！')
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(res.data)
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变的事件
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 点击按钮打开添加分类对话框,并展示父级分类列表
    openAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$mess.error('获取父级分类列表成功')

      this.parentCateList = res.data
    },
    // 选择项的值发生变化触发这个函数
    parentCateChanged() {
      // 如果selectedKeys数组中的length大于0 证明选中了父级分类
      if (this.selectedKeys.length > 0) {
        // 为父级分类id赋值： 获取最后一项父级id，不管是一级还是二级父id  都以最后一项的id为准
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值:等级就是选中数组的长度 0 1 2一共三个等级
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 反之 没有选中任何父级分类 为父级分类id赋值v
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击确定添加新增加的分类到后台
    addCate() {
      // 表单预验证
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return

        const { data: res } = await this.$http.post('categories', this.addCateForm)

        if (res.meta.status !== 201) return this.$mess.error('保存分类失败！')

        this.$mess.success('保存分类成功！')
        // 刷新分类列表
        this.getCateList()
        // 关闭对话框
        this.addCateDialogVisible = false
      })
      console.log(this.addCateForm)
    },
    // 监听关闭对话框的事件 重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 点击按钮打开编辑分类对话框  根据id获取此分类信息复制到表单上
    async editCateByID(id){
      const {data:res} = await this.$http.get('categories/'+id)
      if(res.meta.status!==200) return this.$mess.error('获取分类信息失败')

      this.editCateForm = res.data
      this.editCateDialogVisible = true
    },
    // 点击确定 预校验  更新分类信息   关闭对话框 刷新列表
    editCate(){
      this.$refs.editCateFormRef.validate( async valid=>{
        if(!valid) return

        const {data:res} = await this.$http.put('categories/'+this.editCateForm.cat_id,{cat_name:this.editCateForm.cat_name})

        if(res.meta.status!==200) return this.$mess.error('更新失败')

        this.getCateList()
        this.editCateDialogVisible = false
        this.$mess.success('更新成功')
      })
    },
    // 关闭编辑分类对话框 重置表单
    editCateDialogClosed(){
      this.$refs.editCateFormRef.resetFields()
    },
    // 根据id删除商品分类
    async removeCateByID(id){
      const confirmResult = await this.$confirm(
        '是否确定删除此分类？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)


      // 如果用户点击确认，返回字符串 confirm，取消，返回字符串 cancel
      if (confirmResult !== 'confirm') return this.$mess.info('已取消删除.')
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$mess.error('删除商品分类失败！')
      // 刷新用户列表
      this.getCateList()
      this.$mess.success('删除商品分类成功！')
    },
  },
}
</script>

<style scoped>
.treetable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
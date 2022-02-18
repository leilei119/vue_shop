<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb class="cont">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card shadow="always">
      <!-- 头部提示信息 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>

      <!-- 级联选择器 -->
      <el-row>
        <span>选择商品分类：</span>
        <el-cascader
          :options="cateList"
          v-model="selectedCateKeys"
          :props="cateProps"
          clearable
          size="medium"
          @change="CateChanged"
        ></el-cascader>
      </el-row>

      <!-- tab标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisable"
            @click="addDialogVisible = true"
            >动态参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableList" stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="removeTag(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              sortable
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  plain
                  size="mini"
                  @click="openEidtDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  plain
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisable"
            @click="addDialogVisible = true"
            >静态属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableList" stripe>
              <!-- 展开列 -->
              <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="removeTag(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              sortable
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  plain
                  size="mini"
                  @click="openEidtDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  plain
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加参数对话框 title使用计算属性来计算-->
      <el-dialog
        :title="'添加' + this.addTitleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose"
      >
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
          <el-form-item :label="addTitleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑参数对话框-->
      <el-dialog
        :title="'修改' + this.addTitleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
          <el-form-item :label="addTitleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      cateList: [], //商品分类数据列表
      selectedCateKeys: [], //选中的商品分类id数组
      cateProps: {
        //级联选择器的配置对象
        expandTrigger: 'hover', //鼠标移入展开
        value: 'cat_id', //选中的值的id
        label: 'cat_name', //选中的值的名称
        children: 'children', //父子嵌套用的哪个属性
      },

      //tab选中的数据  双向数据绑定
      activeName: 'many',
      manyTableList: [], //动态参数数据列表
      onlyTableList: [], //静态属性数据列表

      //添加参数对话框的显示与隐藏
      addDialogVisible: false,
      addForm: {
        //添加表单的数据对象
        attr_name: '', //参数名称
      },
      addFormRules: {
        //添加表单的验证规则对象
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },

      //   编辑参数随想的显示与隐藏
      editDialogVisible: false,
      editForm: {
        //编辑参数表单的参数对象
        attr_name: '',
        attr_id: '',
      },
      editFormRules: {
        //编辑参数表单的验证规则对象
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //   获取商品分类数据列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200)
        return this.$mess.error('获取商品分类列表失败。')
      this.cateList = res.data
    },
    //   监听级联选择器文本框的值发生变化触发的函数
    CateChanged() {
        // 更新参数列表
      this.getTableList()
    },
    //   监听tab标签页切换事件的函数
    handleClick() {
      this.getTableList()
    },
    // 获取表格数据列表 参数：选中的三级分类id   tabs选项卡选中的值
    async getTableList() {
      //   判断选中的值的长度来决定是否展示在文本框  只有三级分类才可以展示
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        // 清空表格数据
        this.onlyTableList = []
        this.manyTableList = []
        this.$mess.info('请选择三级分类！')
        return
      }

      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200)
        return this.$mess.error('获取表格数据参数列表失败')

      //   获取可选项数据attr_vals 是个字符串，将字符串以空格形式循环分割为数组
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏:给数据中自定义添加俩属性
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      console.log(res.data)

      // 获取数据成功，判断是动态参数还是静态属性
      if (this.activeName === 'only') {
        this.onlyTableList = res.data
      } else {
        this.manyTableList = res.data
      }
    },
    // 点击确定按钮添加参数到后台
    addParams() {
      // 表单预验证
      this.$refs.addFormRef.validate(async (valide) => {
        if (!valide) return

        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          { attr_name: this.addForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 201) return this.$mess.error('添加参数失败')
        this.$mess.success('添加参数成功')
        // 刷新表格数据
        this.getTableList()
        // 关闭对话框
        this.addDialogVisible = false
      })
    },
    // 监听添加参数对话框的关闭事件 重置表单
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击编辑根据id查询当前参数的信息  打开编辑参数的对话框
    async openEidtDialog(attr_id) {
      // 根据id查询当前参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200) return this.$mess.errer('获取参数信息失败')

      // 将获取到的参数信息保存到editForm对象
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 点击确定修改参数保存到后台
    async editParams() {
      // 表单预验证
      this.$refs.editFormRef.validate(async (valide) => {
        if (!valide) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200) return this.$mess.error('修改参数名称失败')

        // 刷新表格数据
        this.getTableList()
        this.$mess.success('修改参数名称成功')
        this.editDialogVisible = false
      })
    },
    // 监听编辑参数对话框的关闭事件 重置表单
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 根据id删除参数
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        '是否确定删除此参数？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      // 如果用户点击确认，返回字符串 confirm，取消，返回字符串 cancel
      if (confirmResult !== 'confirm') return this.$mess.info('已取消删除.')
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      )
      if (res.meta.status !== 200) return this.$mess.error('删除参数失败！')
      // 刷新参数列表
      this.getTableList()
      this.$mess.success('删除参数成功！')
    },
    // 按下键盘的 enter 或者鼠标失去焦点都会触发
    handleInputConfirm(row) {
      // 如果文本框没有值，就清空文本框，并隐藏文本框
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }

      // 如果有值，先保存到数据中
      row.attr_vals.push(row.inputValue.trim())
      // 吧文本框请空
      row.inputValue = ''
      // 关闭文本框
      row.inputVisible = false

      // 再发起请求保存到后台
      this.saveAttrVals(row)
    },
    // 对attr_vals的操作，保存到后台数据库
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        }
      )
      if (res.meta.status !== 200) return this.$mess.error('更新参数项失败！')

      this.$mess.success('更新参数项成功！')
    },
    // 点击添加tag按钮打开input输入框
    showInput(row) {
      row.inputVisible = true
      // $nextTick:当页面上的元素被重新渲染之后,才会执行函数中的代码
      this.$nextTick(() => {
        // 让input框自动获得焦点
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除tag标签
    removeTag(i, row) {
      row.attr_vals.splice(i, 1)
    //   刷新参数项
      this.saveAttrVals(row)
    },
  },
  computed: {
    //用计算属性来计算根据级联文本框数组的长度来判断按钮是否禁用  显示
    // 禁用 返回false    显示 返回true
    isDisable() {
      if (this.selectedCateKeys.length === 3) {
        return false
      }
      return true
    },
    // 计算当前选中的三级分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 计算添加按钮的文本信息title
    addTitleText() {
      if (this.activeName == 'only') {
        return '静态属性'
      }
      return '动态参数'
    },
  },
}
</script>

<style scoped>
.tjyh {
  background: #1cbcc5;
  border: 1px solid #fee202;
  font-family: cursive;
  color: #f5f5f5;
  text-shadow: 6px 2px 2px #fee202;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 100px;
}
</style>
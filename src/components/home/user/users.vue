<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb class="usercont">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card shadow="always">
      <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <!-- 搜索框区域 -->
        <el-col :span="20">
          <el-input
            placeholder="你要搜索啥？^_^"
            class="ss"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>

        <!-- 添加用户区域 -->
        <el-col :span="4">
          <el-button class="tjyh" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="userList" stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="username"
          sortable
          label="姓名"
        ></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column
          prop="role_name"
          sortable
          label="角色"
        ></el-table-column>
        <el-table-column label="操作信息">
          <el-table-column label="状态">
              <!-- 使用作用域插槽实现状态的展示 -->
              <template slot-scope="scope">
                <!-- {{scope.row}} 能取到这一行的所有数据-->
                <el-switch
                  v-model="scope.row.mg_state"
                  active-color="#1cbcc5"
                  inactive-color="#ff4949"
                  @change="handelSwitchState(scope.row)"
                >
                </el-switch>
              </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <!-- {{scope.row}} -->
              <el-tooltip
                effect="dark"
                content="修改"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="showEditDialog(scope.row.id)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                  effect="dark"
                  content="删除"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="removeUserById(scope.row.id)"
                  ></el-button>
              </el-tooltip>
              <el-tooltip
                  effect="dark"
                  content="分配角色"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="warning"
                    icon="el-icon-s-tools"
                    circle
                  ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加用户的对话框区域 -->
      <el-dialog
        title="添加用户信息"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <!-- 内容区域 -->
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules">
          <el-form-item label="username" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="password" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="email" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="mobile" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <div slot="footer" class="dialog-footer">
          <el-button class="bt" @click="addDialogVisible = false"
            >取 消</el-button
          >
          <el-button class="tjyh" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改用户的对话框区域 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <!-- 内容区域 -->
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules">
          <el-form-item label="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="email" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="mobile" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <div slot="footer" class="dialog-footer">
          <el-button class="bt" @click="editDialogVisible = false"
            >取 消</el-button
          >
          <el-button class="tjyh" @click="editUser">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'Users',
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
    // 自定义校验规则：手机号
    var checkmobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      // 验证邮箱的正则
      const regmobile =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      // 合法的邮箱
      if (regmobile.test(value)) return callback()
      callback(new Error('请输入合法的手机号'))
    }

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '', //搜索功能的查询参数
        pagenum: 1, //当前页码
        pagesize: 2, //每页显示的条数
      },

      userList: [], // 所有用户列表
      total: 0, //返回的总数据条数

      addDialogVisible: false, // 添加用户的对话框的显示和隐藏
      addForm: {
        //添加用户表单的数据
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      addFormRules: {
        //添加用户表单的验证规则对象
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 10,
            message: '长度在 6 到 10 个字符',
            trigger: 'blur',
          },
        ],
        email: [{ required: true, validator: checkemail, trigger: 'blur' }],
        mobile: [{ required: true, validator: checkmobile, trigger: 'blur' }],
      },

      editDialogVisible: false, // 修改用户的对话框的显示和隐藏
      editForm: {}, //修改用户信息的对象数据
      // 修改用户表单的验证规则对象
      editFormRules: {
        email: [{ required: true, validator: checkemail, trigger: 'blur' }],
        mobile: [{ required: true, validator: checkmobile, trigger: 'blur' }],
      },
    }
  },
  created() {
    // 获取所有用户数据
    this.getUsersList()
  },
  methods: {
    // 获取所有用户
    async getUsersList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$mess.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
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
    // 监听switch开关状态的改变
    async handelSwitchState(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$mess.error('更新状态失败！')
      }
      this.$mess.success('更新状态成功.')
    },
    // 监听添加用户对话框的关闭事件，将表单进行清空
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户的请求
    addUser() {
      // 添加之前先进行预验证
      this.$refs.addFormRef.validate(async (valid) => {
        // 未通过直接返回
        if (!valid) return
        // 通过之后发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$mess.error('添加用户失败！')

        this.$mess.success('添加用户成功！')
        // 成功之后直接关闭对话框
        this.addDialogVisible = false
        // 刷新用户列表
        this.getUsersList()
      })
    },
    // 点击编辑按钮弹出修改用户信息的对话框((根据 ID 查询用户信息) 请求接口)
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$mess.error('获取用户信息失败！')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件，将表单进行重置
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交 (包含用户id)
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        // 预验证未通过
        if (!valid) return

        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        if (res.meta.status !== 200) return this.$mess.error('更新失败！')

        this.$mess.success('更新成功！')
        // 更新完关闭对话框
        this.editDialogVisible = false
        // 更新完重新加载用户列表
        this.getUsersList()
      })
    },
    // 点击删除按钮弹出提示信息,并根据用户id删除对应信息
    async removeUserById(id){
      // 弹框---- 第一种书写方式
      // this.$confirm('是否确定删除此用户？','提示',{
      //   confirmButtonText:'确定',
      //   cancelButtonText:'取消',
      //   type: 'warning'
      // }).then(async ()=>{
      //   const {data:res} = await this.$http.delete('users/'+id)
      //   if(res.meta.status!==200) return this.$mess.error('删除用户失败！')
      //   // 刷新用户列表
      //   this.getUsersList()
      //   this.$mess.success('删除用户成功！')
      // }).catch((err)=>{
      //   this.$mess.info('已取消删除.')
      //   console.log(err);
      // })

      // 第二种书写方式
      const confirmResult = await this.$confirm(
        '是否确定删除此用户？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type: 'warning'
      }).catch(err => err)

      // 如果用户点击确认，返回字符串 confirm，取消，返回字符串 cancel
      if(confirmResult !== 'confirm') return this.$mess.info('已取消删除.')
      const {data:res} = await this.$http.delete('users/'+id)
      if(res.meta.status!==200) return this.$mess.error('删除用户失败！')
        // 刷新用户列表
        this.getUsersList()
        this.$mess.success('删除用户成功！')
    }
  },
}
</script>
<style scoped>
.usercont {
  font-size: 12px;
  font-weight: 400;
  color: #606266;
  cursor: text;
  font-weight: inherit;
}
.ss {
  background-color: aliceblue !important;
}
.tjyh {
  background: #1cbcc5;
  border: 1px solid #fee202;
  font-family: cursive;
  color: #f5f5f5;
  text-shadow: 6px 2px 2px #fee202;
  border-radius: 27% !important;
}
.bt {
  background: #f5f5f5;
  border: 1px solid #f5f5f5;
  font-family: cursive;
  color: #1cbcc5;
  text-shadow: 6px 2px 2px #fee202;
  border-radius: 27% !important;
}
</style>
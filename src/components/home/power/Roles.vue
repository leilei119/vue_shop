<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb class="cont">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card shadow="always">
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button class="tjyh" @click="addRights">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="rolesList" stripe :row-key="rolesList.id" lazy>
        <!-- 展开列 使用作用域插槽实现展开列下面的权限列表-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 添加动态样式类， bdbottom所有row都有底边框线，bdtop顶边框线只有在下标为0的元素上才有 -->
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightsById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 添加动态样式类， 下标为0的元素上不加上边框线bdtop，其余都加 -->
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']">
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightsById(scope.row, item2.id)">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightsById(scope.row, item3.id)">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- pre 数据美化 scope.row拿到对应的权限信息-->
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>

        <el-table-column prop="roleName" sortable label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" sortable label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain size="mini" @click="editRoleByID(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="removeRoleByID(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-s-tools" plain size="mini" @click="openRightsDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 权限配置对话框 -->
      <el-dialog title="权限配置" :visible.sync="rightsDialogVisible" width="50%" @close="serRightsDialogClose">
        <!-- 主体区域  树形控件 treeProps:要展示的对象    多选框          默认全部打开所有节点        选中的值是唯一id而不是文本-->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox :default-expand-all="true" node-key="id" :default-checked-keys="defCheckedKeys" ref="treeRef"></el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="rightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRights">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%" @close="addRoleDialogClose">
        
        <!-- 主体 -->
        <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" >
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer">
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoleFormDialog">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑角色对话框 -->
      <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="50%" @close="editRoleDialogClose">
        
        <!-- 主体 -->
        <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" >
            <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer">
          <el-button @click="editRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoleFormDialog">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'Roles',
  data() {
    return {
      rolesList: [], //所有角色列表数据---表格的

      rightsDialogVisible: false, //权限配置对话框的展示和隐藏
      rightsList: [], //所有权限数据---树形控件的
      // 树形控件的属性绑定对象  要展示的字段名  要循环的自己字段名
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      defCheckedKeys: [], //树形结构中默认选中的节点id值数组
      rolesId: '', //当前要授权的角色id

      // 添加角色
      addRoleDialogVisible: false, //添加角色对话框的显示与隐藏
      addRoleForm:{//添加角色对象
        roleName:'',
        roleDesc:''
      },
      addRoleFormRules:{//添加角色校验对象
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ]
      },

      // 编辑角色
      editRoleDialogVisible: false,//编辑角色对话框的显示与隐藏
      editRoleForm:{//编辑角色对象
      },
        // 修改用户表单的验证规则对象
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ]
      },
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$mess.error('获取角色列表失败哦~')
      console.log(res);
      this.rolesList = res.data
    },
    // 根据id删除对应的权限
    async removeRightsById(roles, rightsId) {
      // 弹框提示是否删除
      const confirmRes = await this.$confirm('确认删除此权限吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      // 取消删除
      if (confirmRes !== 'confirm') return this.$mess.info('取消了删除.')

      // 调删除接口
      const { data: res } = await this.$http.delete(`roles/${roles.id}/rights/${rightsId}`)
      if (res.meta.status !== 200) return this.$mess.error('删除权限失败！')
      // 刷新权限列表   返回的data, 是当前角色下最新的权限数据
      // 吧服务器返回的数据直接赋值给角色的children属性
      roles.children = res.data
      this.$mess.success('删除权限成功！')
    },
    // 打开对话框并获取所有的权限数据role（scope.row）就是当前角色，是最父级的节点
    async openRightsDialog(role) {
      // 将当前角色id保存  用于后面的具体授权
      this.rolesId = role.id

      const { data: res } = await this.$http('rights/tree')
      if (res.meta.status !== 200) return this.$mess.error('获取权限列表失败！')
      this.rightsList = res.data

      // 递归获取三级的节点的id 在打开属性结构时，就把已有的权限选中
      this.getDefCheckedKeys(role, this.defCheckedKeys)
      // 打开权限配置对话框
      this.rightsDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defCheckedKeys数组中
    // node节点：父级角色-用来判断三级节点   arr数组：用来保存数组
    getDefCheckedKeys(node, arr) {
      // 先判断是否为三级节点:三级节点不包含children
      if (!node.children) {
        // 是三级节点：将节点中的id保存起来
        return arr.push(node.id)
      }
      // 不是三级节点：通过递归获取到最终的三级节点
      // 循环当前node里面的所有children数组，每循环一项拿到一个子节点item，再根据item再次调用递归函数，
      // 把当前item当做一个子节点给传进去，同时吧数组也传进去，只要递归完毕，就把所有三级节点id保存到了数组里面
      node.children.forEach((item) => {
        this.getDefCheckedKeys(item, arr)
      })
    },
    // 关闭对话框就把默认选中数组中的数据清空一下
    serRightsDialogClose() {
      this.defCheckedKeys = []
    },
    // 点击分配权限对话框中确定按钮   给角色授权
    async setRights() {
      // 获取到点击授权的角色id（半选）和权限id（全选） 给tree个引用对象treeRef  调用tree的方法获取id
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]

      // 接口要求授权id要用' ，'号分割
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(`roles/${this.rolesId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$mess.error('分配权限失败！')

      this.$mess.success('分配权限成功！')
      // 刷新一下角色列表
      this.getRolesList()
      // 关闭对话框
      this.rightsDialogVisible = false
    },
    // 点击按钮打开添加角色对话框
    addRights() {
      this.addRoleDialogVisible = true
    },
    // 关闭添加角色对话框 清空表单
    addRoleDialogClose(){
        this.$refs.addRoleFormRef.resetFields()
    },
    // 点击确定保存添加角色的数据到后台
    addRoleFormDialog(){
        // 保存前先预校验
        this.$refs.addRoleFormRef.validate(async valid=>{
          if(!valid) return 

          // 添加接口
          const {data:res} = await this.$http.post('roles',this.addRoleForm)
          console.log(res);
          if (res.meta.status !== 201) return this.$mess.error('添加角色失败！')

        this.$mess.success('添加角色成功！')
        // 刷新列表
        this.getRolesList()
        // 关闭对话框
        this.addRoleDialogVisible = false
        })
    },
    // 点击编辑打开对话框 根据id先查询到此角色信息放在表单中
    async editRoleByID(rolesID){
      console.log(rolesID);
      const {data:res} = await this.$http.get(`roles/${rolesID}`)
      if(res.meta.status !== 200) return this.$mess.error('获取角色信息失败')

      this.editRoleForm = res.data
      this.editRoleDialogVisible = true
    },
    // 点击确定 预校验 更新角色 刷新列表
    editRoleFormDialog(){
      this.$refs.editRoleFormRef.validate(async valid=>{
        if(!valid) return

        const {data:res} = await this.$http.put('roles/'+this.editRoleForm.roleId,{roleName:this.editRoleForm.roleName,roleDesc:this.editRoleForm.roleDesc})
        if(res.meta.status!==200)return this.$mess.error('更新角色失败')

        this.editRoleDialogVisible = false
        this.getRolesList()
        this.$mess.success('更新成功')
      })
    },
    // 关闭编辑角色对话框清空表单
    editRoleDialogClose(){
      this.$refs.editRoleFormRef.resetFields()
    },
    // 点击删除根据id删除角色
    removeRoleByID(rolesID){
      // 弹窗提示
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} = await this.$http.delete('roles/'+rolesID)

          if(res.meta.status!==200) return  this.$mess.error('删除角色失败')

          this.getRolesList()
          this.$mess.success('删除角色成功')

        }).catch(() => {
          this.$mess.info('已取消删除.')        
        });
    },
    
  },
}
</script>
<style scoped>
.tjyh {
  background: #eba93c;
  border: 1px solid #fee202;
  font-family: cursive;
  color: #f5f5f5;
  text-shadow: 6px 2px 2px #fee202;
}
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
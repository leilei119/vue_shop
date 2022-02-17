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
          <el-button class="tjyh" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="rolesList" stripe :row-key="rolesList.id" lazy>
        <!-- 展开列 使用作用域插槽实现展开列下面的权限列表-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 添加动态样式类， bdbottom所有row都有底边框线，bdtop顶边框线只有在下标为0的元素上才有 -->
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
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
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightsById(scope.row, item3.id)"
                    >
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

        <el-table-column
          prop="roleName"
          sortable
          label="角色名称"
        ></el-table-column>
        <el-table-column
          prop="roleDesc"
          sortable
          label="角色描述"
        ></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" plain size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-s-tools"
              plain
              size="mini"
              @click="openRightsDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 权限配置对话框 -->
      <el-dialog
        title="权限配置"
        :visible.sync="rightsDialogVisible"
        width="50%"
        @close="serRightsDialogClose"
      >
        <!-- 主体区域  树形控件 treeProps:要展示的对象    多选框          默认全部打开所有节点        选中的值是唯一id而不是文本-->
        <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          :default-expand-all="true"
          node-key="id"
          :default-checked-keys="defCheckedKeys"
          ref="treeRef"
        ></el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="rightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRights">确 定</el-button>
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
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$mess.error('获取角色列表失败哦~')

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
      const { data: res } = await this.$http.delete(
        `roles/${roles.id}/rights/${rightsId}`
      )
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
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]

      // 接口要求授权id要用' ，'号分割
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.rolesId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) return this.$mess.error('分配权限失败！')

      this.$mess.success('分配权限成功！')
      // 刷新一下角色列表
      this.getRolesList()
      // 关闭对话框
      this.rightsDialogVisible = false
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
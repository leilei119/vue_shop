<template>
  <div>
    <!-- 面包屑导航1区域 -->
    <el-breadcrumb class="cont">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card shadow="always">
      <!-- 警告区域 -->
      <el-alert
        title="添加商品"
        type="warning"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tabs标签页 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-position="top"
      >
        <!-- 即将离开标签页的时候触发  @tab-clicktab 被选中时触发-->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateLists"
                :props="cateProps"
                @change="CateChanged"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <!-- 循环attr_vals 拿到每一个val -->
                <el-checkbox
                  border
                  :label="val"
                  v-for="(val, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <!-- 渲染表单item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <!-- action：图片上传到后台的路径，要写完整的api接口路径 
            list-type：图片呈现的页面效果 
            headerObj:图片上传组件的请求头对象
             :on-success="handleSuccess"：上传成功的回调函数
             :on-preview="handlePreview":点击图片预览事件
             :on-remove="handleRemove":点击删除图片事件-->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'AddGoodsList',
  data() {
    return {
      activeIndex: '0', //步骤条默认选中下标,和tabs共用一个，实现同步切换

      //   添加商品表单对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [], //选中的父级分类的id数组
        pics: [], //图片信息数组
        goods_introduce: '', //商品描述
        attrs:[],//动态参数和静态属性
      },
      // 添加商品验证规则对象
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      //   商品分类列表
      cateLists: [],
      cateProps: {
        //指定级联选择器的配置对象
        expandTrigger: 'hover', //鼠标移入展开
        value: 'cat_id', //选中的值的id
        label: 'cat_name', //选中的值的名称
        children: 'children', //父子嵌套用的哪个属性
      },

      //  动态参数列表数据:商品参数
      manyTableData: [],
      //  静态属性列表数据：商品属性
      onlyTableData: [],
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 预览图片的图片地址
      previewPath: '',
      // 预览图片的对话框现实与隐藏
      previewVisible: false,
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据：展示在级联选择器上
    async getCateList() {
      // get请求 参数用params
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$mess.error('获取商品分类失败！')
      this.cateLists = res.data
    },
    // 级联选择器中选择项的值发生变化触发这个函数
    CateChanged() {
      // 级联选择器只允许选中三级   ，如果不是三级就清空
      if (this.addForm.goods_cat.length !== 3) {
        this.$mess.info('请选择三级分类！')
        this.addForm.goods_cat = []
      }
    },
    // 即将离开标签页时触发的事件  即将进入的标签activeName    即将离开的标签oldActiveName
    beforeTabLeave(activeName, oldActiveName) {
      // 判断如果是第一个标签页  并且商品分类没有选择  就不让切换标签
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$mess.error('请先选择商品分类')
        return false
      }
    },
    // tab被选中时触发的事件
    async tabClicked() {
      // 如果选中的是1(商品参数) ，证明访问的是动态参数面板 访问参数列表接口 id三级分类id
      if (this.activeIndex === '1') {
        const { data: res1 } = await this.$http.get(
          `categories/${this.cataId}/attributes`,
          { params: { sel: 'many' } }
        )
        if (res1.meta.status !== 200)
          return this.$mess.error('获取动态参数列表失败')

        // 处理一下attr_vals  将字符串转换为数组:商品参数
        res1.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        // 保存数据，渲染页面用
        this.manyTableData = res1.data
      }

      // 如果选中的是2 （商品属性），证明访问的是静态属性面板 访问参数列表接口 id三级分类id
      if (this.activeIndex === '2') {
        const { data: res2 } = await this.$http.get(
          `categories/${this.cataId}/attributes`,
          { params: { sel: 'only' } }
        )
        if (res2.meta.status !== 200)
          return this.$mess.error('获取动态参数列表失败')
        this.onlyTableData = res2.data
        console.log(this.onlyTableData)
      }
    },
    // 点击图片预览效果 file预览的图片信息
    handlePreview(file) {
      // 给预览的图片信息赋值
      this.previewPath = file.response.data.url
      // 打开预览图片对话框
      this.previewVisible = true
    },
    // 点击删除图片事件 file移除的图片信息
    handleRemove(file) {
      // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_oath
      // 2.从pics数组中，找到这个图片对应的索引值
      const index = this.addForm.pics.findIndex((x) => x.pic === filePath)
      // 3.调用数组的splice方法，吧图片信息对象从pics数组中移除
      this.addForm.pics.splice(index, 1)
      console.log(this.addForm)
    },
    // 监听图片上传成功的事件 respinse上传的图片信息
    handleSuccess(respinse) {
      // 1.拼接得到一个图片信息对象
      const picInfo = { pic: respinse.data.tmp_path }
      // 2.讲图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) this.$mess.error('请填写必要的表单项')

        // 执行添加的业务逻辑，对要添加的数据进行处理

        // 给数组重新赋值字符串之前给addForm做一下深拷贝:因为级联选择器也绑定的这个属性，它只支持数组形式，直接赋值会报错
        // lodash包  cloneDeep（obj）方法
        const form = _.cloneDeep(this.addForm)
        // goods_cat ：要求以，分割的字符串
        form.goods_cat = form.goods_cat.join(',')
        // attrs：商品的参数 是多个对象组成：在页面的商品参数和商品属性中填写的内容都保存再attrs中：包含俩属性 attr_id  attr_vals
        // 处理动态参数 商品参数 拼接成需要的对象和包含的属性   添加到attrs中  attr_value需要的是字符串 attr_vals是数组做一下拼接
        this.manyTableData.forEach(item=>{
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性 商品属性 静态属性的vals本身就是字符串
        this.onlyTableData.forEach(item=>{
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals 
          }
          this.addForm.attrs.push(newInfo)
        })
        // 将this.addForm.attrs赋值给form.attrs
        form.attrs = this.addForm.attrs
        // 发起请求添加商品，商品的名称必须是唯一的(后台接口已做处理)
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$mess.error('添加商品失败')
        this.$mess.success('添加商品成功')
        // 路由导航跳转带商品列表
        this.$router.push('/goods')
      })
    },
  },
  computed: {
    //   获取三级分类id
    cataId() {
      //  如果分类列表的长度是3  说明选了商品分类
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
  },
}
</script>

<style scoped>
.el-checkbox {
  margin: 0 15px 0 0 !important;
}
.el-upload__tip {
  margin-bottom: 7px;
}
.previewImg {
  width: 100%;
}
</style>
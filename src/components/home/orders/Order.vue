<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb class="cont">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card shadow="always">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="20">
          <el-input placeholder="你要搜索啥？^_^" class="ss" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" type="primary" plain icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="orderList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="70"> </el-table-column>
        <el-table-column label="是否付款" width="80">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="70"></el-table-column>
        <el-table-column label="下单时间" width="140">
          <!-- 过滤器 ： 格式化时间格式 -->
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template>
            <el-tooltip effect="dark" content="修改地址" placement="top" :enterable="false"> <el-button type="primary" icon="el-icon-edit" circle @click="showAddAress"></el-button></el-tooltip>
            <el-tooltip effect="dark" content="物流信息" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-location" circle @click="showProgressBox"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 修改地址对话框 -->
      <el-dialog width="50%" @close="addressDialogClosed" title="修改地址" :visible.sync="addressDialogVisible">
        <el-form :model="addressForm" ref="addressFormRes" :rules="addressFormRules">
          <el-form-item label="省市区/县" prop="addressS">
            <el-cascader v-model="addressForm.addressS" :options="cityData" :props="{ expandTrigger: 'hover' }"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="addressX">
            <el-input v-model="addressForm.addressX"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="addressDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 物流进度信息对话框 -->
      <el-dialog width="50%" title="物流进度信息" :visible.sync="progressDialogVisible">
        <!-- 时间线 Timeline reverse指定节点排序方向，默认为正序
         timestamp	时间戳-->
        <el-timeline :reverse="true">
          <el-timeline-item v-for="(activity, index) in progressList" :key="index" :timestamp="activity.time" :icon="activity.icon" :type="activity.type" :color="activity.color" :size="activity.size">
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  name: 'Order',
  data() {
    return {
      orderList: [], //订单列表数据
      queryInfo: {
        //订单数据列表参数对象 查询对象
        query: '', //查询参数
        pagenum: 1, //当前页码
        pagesize: 5, //每页显示条数
      },
      total: 0, //总条数

      addressDialogVisible: false, //打开或隐藏修改地址对话框
      addressForm: {
        //修改地址表单对象
        addressS: [], //级联选择器数组
        addressX: '',
      },
      cityData, //省市级县
      addressFormRules: {
        //修改地址表单验证规则对象
        addressS: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        addressX: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
      },

      progressDialogVisible: false, //物流信息的展示与隐藏
      // progressList: [], //物流进度信息数据
      progressList: [
        {
          context: '快件已签收 签收人：家人 感谢使用圆通速递，期待再次为您服务',
          time: '2018-04-14',
          color: '#0bbd87',
        },
        {
          context: '北京市顺义区顺义机场公司派件人：后果宝（15510285526）正在派件',
          time: '2018-04-13',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more',
        },
        {
          context: '快件已到达 北京市和损益去顺义机场公司',
          time: '2018-04-13',
        },
        {
          context: '快件已发往 北京市和损益去顺义机场公司',
          time: '2018-04-13',
        },
        {
          context: '快件已发出',
          time: '2018-04-12',
        },
        {
          context: '等待快递员揽收',
          time: '2018-04-11',
        },
      ],
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    //   获取所有订单数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$mess.error('获取订单列表失败')

      // 吧查询得到的total赋值给data中的total
      this.total = res.data.total
      // 把查询到的结果赋值给data中的orderlist
      this.orderList = res.data.goods
    },
    // 切换每页显示条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 切换当前页码
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    // 点击编辑打开修改地址的对话框
    showAddAress() {
      this.addressDialogVisible = true
    },
    // 监听关闭修改地址对话框清空表单
    addressDialogClosed() {
      this.$refs.addressFormRes.resetFields()
    },
    // 点击查询物流进度信息
    async showProgressBox() {
      // 查询物流信息的接口
      // const { data: res } = await this.$http.get('/kuaidi/804909574412544580')

      // if (res.meta.status !== 200) {
      //   return this.$message.error('获取物流进度失败！')
      // }
      // console.log(res)
      // this.progressList = res.data
      this.progressDialogVisible = true
    },
  },
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
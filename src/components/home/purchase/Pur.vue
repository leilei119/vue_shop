<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb class="cont">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>采购管理</el-breadcrumb-item>
      <el-breadcrumb-item>采购入库</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 按钮组+搜索 -->
    <el-card shadow="always">
      <el-form :inline="true" :model="purForm" :rules="purFormRules" ref="purFormRef" label-position="right" label-width="100px">
        <!-- 按钮搜索区域 -->
        <el-row :gutter="20">
          <!-- 按钮区域 -->
          <el-col :span="20">
            <el-dropdown split-button type="primary" size="mini">
              新增
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>新增</el-dropdown-item>
                <el-dropdown-item>复制新增</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown split-button type="primary" size="mini">
              保存
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>保存</el-dropdown-item>
                <el-dropdown-item>保存</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown split-button type="primary" size="mini">
              审核
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>审核</el-dropdown-item>
                <el-dropdown-item>审核</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-button class="aa" type="primary" size="mini" plain>来源</el-button>

<el-dropdown split-button type="primary" size="mini">
              关联查询
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>关联查询</el-dropdown-item>
                <el-dropdown-item>关联查询</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown split-button type="primary" size="mini">
              业务操作
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>业务操作</el-dropdown-item>
                <el-dropdown-item>业务操作</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-button class="aa" type="primary"  size="mini" plain>前一页</el-button>
            <el-button class="aa1" type="primary" size="mini" plain>后一页</el-button>
            <el-button class="aa1" type="primary" size="mini" plain>退出</el-button>
          </el-col>

          <!-- 搜索 -->
          <el-col :span="4">
            <el-input size="mini" placeholder="请输入内容" class="ss" v-model="queryInfo.query" clearable @clear="getUsersList">
              <el-button slot="append" icon="el-icon-search" class="search" type="primary"  size="mini" plain @click="getUsersList"></el-button>
            </el-input>
          </el-col>
        </el-row>

        <!-- 中间表单部分 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="jbxx">
            <el-form-item label="单据编号" prop="djbh">
              <el-input v-model="purForm.bh" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="单据类型" prop="djlx">
              <el-input v-model="purForm.lx" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="业务类型" prop="ywlx">
              <el-input v-model="purForm.lx" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="入库时间" prop="rksj">
              <el-date-picker v-model="purForm.rksj" size="mini" align="right" type="date" placeholder="选择日期"> </el-date-picker>
            </el-form-item>
            <el-form-item label="供应商" prop="gys">
              <el-input v-model="purForm.gys" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="采购部门" prop="cgbm">
              <el-input v-model="purForm.cgbm" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="采购员" prop="cgy">
              <el-input v-model="purForm.cgy" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="单据状态" prop="djzt">
              <el-input v-model="purForm.djzt" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="bz">
              <el-input class="bz" v-model="purForm.bz" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="财务信息" name="cwxx">
            <el-form-item label="是否含税" prop="sfhs">
              <el-col :span="8">
                <el-checkbox v-model="purForm.sfhs"></el-checkbox>
              </el-col>
            </el-form-item>
            <el-form-item label="价格表" prop="jgb" class="jgb">
              <el-col :span="12">
                <el-input v-model="purForm.jgb" size="mini"><el-button slot="append" size="mini" icon="el-icon-search"></el-button></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="折扣表" prop="zkb">
              <el-input v-model="purForm.zkb" size="mini"><el-button slot="append" size="mini" icon="el-icon-search"></el-button></el-input>
            </el-form-item>
            <el-form-item label="结算币种" prop="jsbz">
              <el-input v-model="purForm.jsbz" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="本位币" prop="bwb">
              <el-input v-model="purForm.bwb" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="汇率类型" prop="hllx">
              <el-input v-model="purForm.hllx" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="汇率" prop="hl">
              <el-input v-model="purForm.hl" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="金额" prop="je">
              <el-input v-model="purForm.je" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="税额" prop="se">
              <el-input v-model="purForm.se" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="价税合计" prop="jshj">
              <el-input v-model="purForm.jshj" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="金额(本位币)" prop="jsbwb">
              <el-input v-model="purForm.jsbwb" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="税额(本位币)" prop="sebwb">
              <el-input v-model="purForm.sebwb" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="价税合计(本位币)" prop="jshjbwb">
              <el-input v-model="purForm.jshjbwb" size="mini"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="物流信息" name="wlxx">
            <el-form-item label="运输方式" prop="ysfs">
              <el-input v-model="purForm.ysfs" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="配送方式" prop="psfs">
              <el-input v-model="purForm.psfs" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="车号" prop="ch">
              <el-input v-model="purForm.ch" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="承运单位" prop="cydw">
              <el-input v-model="purForm.cydw" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="驾驶员" prop="jsy">
              <el-input v-model="purForm.jsy" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="司机电话" prop="sjdh">
              <el-input v-model="purForm.sjdh" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="核载吨位" prop="hzdw">
              <el-input v-model="purForm.hzdw" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="实际吨位" prop="sjdw">
              <el-input v-model="purForm.sjdw" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="是否按照实际吨位计算" prop="isSjdwjs">
              <el-input v-model="purForm.isSjdwjs" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="运费单价" prop="yfdj">
              <el-input v-model="purForm.yfdj" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="总运费" prop="zyf">
              <el-input v-model="purForm.zyf" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="始发地" prop="sfd">
              <el-input v-model="purForm.sfd" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="目的地" prop="mdd">
              <el-input v-model="purForm.mdd" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="毛重" prop="mz">
              <el-input v-model="purForm.mz" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="皮重" prop="pz">
              <el-input v-model="purForm.pz" size="mini"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="费用明细" name="fymx">
            <el-button-group>
              <el-button size="mini">新增行</el-button>
              <el-button size="mini">复制行</el-button>
              <el-button size="mini">插入行</el-button>
              <el-button size="mini">修改行</el-button>
              <el-button size="mini" @click="toggleSelection(rows)">删除行</el-button>
            </el-button-group>
            <el-table
              ref="userListRef"
              :data="purForm.tableData.slice((queryInfo.pagenum - 1) * queryInfo.pagesize, queryInfo.pagenum * queryInfo.pagesize)"
              stripe
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column prop="fyxm" label="费用项目"></el-table-column>
              <el-table-column prop="fydw" label="费用单位"></el-table-column>
              <el-table-column prop="sl" label="数量"></el-table-column>
              <el-table-column prop="dj" label="单价"></el-table-column>
              <el-table-column prop="jshj" label="价税合计"></el-table-column>
              <el-table-column prop="fplx" label="发票类型"></el-table-column>
              <el-table-column prop="ftfs" label="分摊方式"></el-table-column>
              <el-table-column prop="bz" label="备注"></el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 50]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="其他信息" name="qtxx">
            <el-form-item label="创建人" prop="cjr">
              <el-input v-model="purForm.ysfs" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="cjsj">
              <el-date-picker v-model="purForm.cjsj" type="date" size="mini" placeholder="选择日期"> </el-date-picker>
            </el-form-item>
            <el-form-item label="修改人" prop="xgr">
              <el-input v-model="purForm.xgr" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="修改时间" prop="xgsj">
              <el-date-picker v-model="purForm.xgsj" type="date" size="mini" placeholder="选择日期"> </el-date-picker>
            </el-form-item>
            <el-form-item label="审核人" prop="shr">
              <el-input v-model="purForm.shr" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="审核时间" prop="shsj">
              <el-date-picker v-model="purForm.shsj" type="date" size="mini" placeholder="选择日期"> </el-date-picker>
            </el-form-item>
            <el-form-item label="禁用人" prop="jyr">
              <el-input v-model="purForm.jyr" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="禁用时间" prop="jysj">
              <el-date-picker v-model="purForm.jysj" type="date" size="mini" placeholder="选择日期"> </el-date-picker>
            </el-form-item>
            <el-form-item label="数据状态" prop="sjzt">
              <el-input v-model="purForm.sjzt" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="禁用状态" prop="jyzt">
              <el-input v-model="purForm.jyzt" size="mini"></el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <!-- 最下面部分 -->
      <el-form :inline="true" :model="xinixForm" :rules="xinixFormRules" ref="xinixFormRef" label-position="right" label-width="100px">
        <el-tabs v-model="activeName2" @tab-click="handleClick2">
          <el-tab-pane label="明细信息" name="mxxx">
            <el-button-group>
              <el-button size="mini">新增行</el-button>
              <el-button size="mini">删除行</el-button>
              <el-button size="mini">批量填充</el-button>
              <el-button size="mini">获取批号</el-button>
              <el-button size="mini" @click="toggleSelection(rows)">行操作</el-button>
            </el-button-group>

            <el-table
              ref="userListRef"
              :data="purForm.tableData.slice((queryInfo.pagenum - 1) * queryInfo.pagesize, queryInfo.pagenum * queryInfo.pagesize)"
              stripe
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="index" label="行号"> </el-table-column>
              <el-table-column prop="wlbm" label="物料编码"></el-table-column>
              <el-table-column prop="fydw" label="物料名称"></el-table-column>
              <el-table-column prop="sl" label="规格型号"></el-table-column>
              <el-table-column prop="dj" label="辅助属性"></el-table-column>
              <el-table-column prop="jshj" label="件支数"></el-table-column>
              <el-table-column prop="fplx" label="基本单位"></el-table-column>
              <el-table-column prop="ftfs" label="批号"></el-table-column>
              <el-table-column prop="bz" label="仓库"></el-table-column>
              <el-table-column prop="bz" label="采购数量"></el-table-column>
              <el-table-column prop="bz" label="复磅数量"></el-table-column>
              <el-table-column prop="bz" label="包装单位"></el-table-column>
              <el-table-column prop="bz" label="整件"></el-table-column>
              <el-table-column prop="bz" label="辅助单位"></el-table-column>
              <el-table-column prop="bz" label="零支"></el-table-column>
              <el-table-column prop="bz" label="总支数"></el-table-column>
              <el-table-column prop="bz" label="含税单价"></el-table-column>
              <el-table-column prop="bz" label="不含税单价"></el-table-column>
              <el-table-column prop="bz" label="税率"></el-table-column>
              <el-table-column prop="bz" label="税额"></el-table-column>
              <el-table-column prop="bz" label="不含税金额"></el-table-column>
              <el-table-column prop="bz" label="价税合计"></el-table-column>
              <el-table-column prop="bz" label="计件单位"></el-table-column>
              <el-table-column prop="bz" label="计件数量"></el-table-column>
              <el-table-column prop="bz" label="条码重量"></el-table-column>
              <el-table-column prop="bz" label="磅差"></el-table-column>
              <el-table-column prop="bz" label="磅差比"></el-table-column>
              <el-table-column prop="bz" label="备注"></el-table-column>
              <el-table-column prop="bz" label="赠品"></el-table-column>
              <el-table-column prop="bz" label="库存更新标志"></el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 50]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="明细财务信息" name="mxcwxx">
            <el-button-group>
              <el-button size="mini">首行</el-button>
              <el-button size="mini">上一行</el-button>
              <el-button size="mini">下一行</el-button>
              <el-button size="mini">末行</el-button> </el-button-group
            ><br />

            <el-form-item label="折扣率" prop="zkl">
              <el-input v-model="purForm.bh" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="折扣额" prop="zke">
              <el-input v-model="purForm.zke" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="材料成本" prop="clcb">
              <el-input v-model="purForm.clcb" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="费用成本" prop="fycb">
              <el-input v-model="purForm.fycb" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="总成本" prop="zcb">
              <el-input v-model="purForm.zcb" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="含税单价(本位币)" prop="hsdjbwb">
              <el-input v-model="purForm.hsdjbwb" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="不含税单价(本位币)" prop="bhsdjbwb">
              <el-input v-model="purForm.bhsdjbwb" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="税额(本位币)" prop="sebwb">
              <el-input v-model="purForm.sebwb" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="不含税金额(本位币)" prop="bhsjebwb">
              <el-input v-model="purForm.bhsjebwb" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="价税合计(本位币)" prop="jshjbwb">
              <el-input v-model="purForm.jshjbwb" size="mini"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="其他信息" name="qtxx2">
            <el-button-group>
              <el-button size="mini">首行</el-button>
              <el-button size="mini">上一行</el-button>
              <el-button size="mini">下一行</el-button>
              <el-button size="mini">末行</el-button> </el-button-group
            ><br />

            <el-form-item label="源单类型" prop="ydlx">
              <el-input v-model="purForm.ydlx" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="源单编号" prop="ydbh">
              <el-input v-model="purForm.ydbh" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="订单单号" prop="ddbh">
              <el-input v-model="purForm.ddbh" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="订单行号" prop="ddhh">
              <el-input v-model="purForm.ddhh" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="合同单号" prop="htdh">
              <el-input v-model="purForm.htdh" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="合同行号" prop="hthh">
              <el-input v-model="purForm.hthh" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="累计退货数量(基本单位)" prop="ljthsl">
              <el-input v-model="purForm.ljthsl" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="累计开票数量(基本单位)" prop="ljkpsl">
              <el-input v-model="purForm.ljkpsl" size="mini"></el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Pur',
  data() {
    return {
      queryInfo: {
        query: '', //搜索内容
        pagenum: 1,
        pagesize: 5,
      },
      //tab选中的数据  双向数据绑定
      activeName: 'jbxx',
      activeName2: 'mxcwxx',

      purForm: {
        //表单对象数据
        djbh: '',
        djlx: '',
        yelx: '',
        rksj: '',
        gys: '',
        cgbm: '',
        cgy: '',
        bz: '',
        djzt: '',
        sfhs: false,
        jgb: '',
        zkb: '',
        jsbz: '',
        bwb: '',
        hllx: '',
        hl: '',
        je: '',
        se: '',
        jshj: '',
        jsbwb: '',
        sebwb: '',
        jshjbwb: '',
        ysfs: '',
        psfs: '',
        ch: '',
        cydw: '',
        jsy: '',
        sjdh: '',
        hzdw: '',
        sjdw: '',
        isSjdwjs: '',
        yfdj: '',
        zyf: '',
        sfd: '',
        mdd: '',
        mz: '',
        pz: '',
        cjr: '',
        cjsj: '',
        xgr: '',
        xgsj: '',
        shr: '',
        shsj: '',
        jyr: '',
        jysj: '',
        sjzt: '',
        jyzt: '',
        tableData: [
          {
            fyxm: 'move',
            fydw: 'AA1',
            sl: '100-200',
            dj: 10,
            jshj: 100,
            fplx: 'AA',
            ftfs: 'AA',
            bz: 'AA',
          },
          {
            fyxm: 'move',
            fydw: 'AA2',
            sl: '100-200',
            dj: 10,
            jshj: 100,
            fplx: 'AA',
            ftfs: 'AA',
            bz: 'AA',
          },
          {
            fyxm: 'move',
            fydw: 'AA3',
            sl: '100-200',
            dj: 10,
            jshj: 100,
            fplx: 'AA',
            ftfs: 'AA',
            bz: 'AA',
          },
          {
            fyxm: 'move',
            fydw: 'AA3',
            sl: '100-200',
            dj: 10,
            jshj: 100,
            fplx: 'AA',
            ftfs: 'AA',
            bz: 'AA',
          },
          {
            fyxm: 'move',
            fydw: 'AA1',
            sl: '100-200',
            dj: 10,
            jshj: 100,
            fplx: 'AA',
            ftfs: 'AA',
            bz: 'AA',
          },
          {
            fyxm: 'move',
            fydw: 'AA',
            sl: '100-200',
            dj: 10,
            jshj: 100,
            fplx: 'AA',
            ftfs: 'AA',
            bz: 'AA',
          },
          {
            fyxm: 'move',
            fydw: 'AA',
            sl: '100-200',
            dj: 10,
            jshj: 100,
            fplx: 'AA',
            ftfs: 'AA',
            bz: 'AA',
          },
          {
            fyxm: 'move',
            fydw: 'AA',
            sl: '100-200',
            dj: 10,
            jshj: 100,
            fplx: 'AA',
            ftfs: 'AA',
            bz: 'AA',
          },
          {
            fyxm: 'move',
            fydw: 'AA',
            sl: '100-200',
            dj: 10,
            jshj: 100,
            fplx: 'AA',
            ftfs: 'AA',
            bz: 'AA',
          },
          {
            fyxm: 'move',
            fydw: 'AA',
            sl: '100-200',
            dj: 10,
            jshj: 100,
            fplx: 'AA',
            ftfs: 'AA',
            bz: 'AA',
          },
          {
            fyxm: 'move',
            fydw: 'AA',
            sl: '100-200',
            dj: 10,
            jshj: 100,
            fplx: 'AA',
            ftfs: 'AA',
            bz: 'AA',
          },
          {
            fyxm: 'move',
            fydw: 'AA',
            sl: '100-200',
            dj: 10,
            jshj: 100,
            fplx: 'AA',
            ftfs: 'AA',
            bz: 'AA',
          },
          {
            fyxm: 'move',
            fydw: 'AA',
            sl: '100-200',
            dj: 10,
            jshj: 100,
            fplx: 'AA',
            ftfs: 'AA',
            bz: 'AA',
          },
          {
            fyxm: 'move',
            fydw: 'AA',
            sl: '100-200',
            dj: 10,
            jshj: 100,
            fplx: 'AA',
            ftfs: 'AA',
            bz: 'AA',
          },
          {
            fyxm: 'move',
            fydw: 'bb',
            sl: '100-200',
            dj: 10,
            jshj: 100,
            fplx: 'bb',
            ftfs: 'b',
            bz: 'bb',
          },
        ],
      },
      purFormRules: {
        //表单验证规则对象
      },

      total: 100,

      xinixForm: {
        zkl: '',
        zke: '',
        clcb: '',
        fycb: '',
        zcb: '',
        hsdjbwb: '',
        sebwb: '',
        bhsjebwb: '',
        jshjbwb: '',

        ydlx: '',
        ydbh: '',
        ddbh: '',
        ddhh: '',
        htdh: '',
        hthh: '',
        ljthsl: '',
        ljkpsl: '',
      },
      xinixFormRules: {},
      tablelistsmx: [
        // 明细信息
      ],
    }
  },
  methods: {
    getUsersList() {},
    handleClick() {},
    handleClick2() {},
    // 切换每页显示多少条
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
    },
    // 切换页码
    handleCurrentChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    toggleSelection(rows) {
      console.log(rows)
      if (rows) {
        rows.forEach((row) => {
          this.$refs.userListRef.toggleRowSelection(row)
        })
      } else {
        this.$refs.userListRef.clearSelection()
      }
    },
  },
}
</script>

<style scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 178px !important;
}
.bz {
  width: 178px;
}
.el-form-item__content .el-input-group {
  vertical-align: initial;
}
/* .el-form--inline .el-form-item{
    margin: 0;
} */
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

.aa{
  color: #FFF;
    background: #409EFF;
    border-color: #409EFF;
    margin:0 15px;
}
.aa1{
  color: #FFF;
    background: #409EFF;
    border-color: #409EFF;
    margin:0 15px 0 0;
}
.search{
  background-color: #409EFF !important;
    color: #fff !important;
}
.aa:focus, .aa:hover, .search:focus, .search:hover, .aa1:focus, .aa1:hover {
    background: #66b1ff !important;
    border-color: #66b1ff !important;
    color: #FFF !important;
}
</style>
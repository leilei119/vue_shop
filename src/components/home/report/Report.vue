<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb class="cont">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card shadow="always">
      <!-- 为echarts准备一个具有高度的dom -->
      <div id="main" style="height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Report',
  data() {
    return {
      // 需要合并的数据：api接口中提供的
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  created() {},
  //此时，页面上的元素，已经被渲染完毕了
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = this.$echarts.init(document.getElementById('main'))

    // 获取数据报表数据  // 指定图表的配置项和数据
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$mess.error('获取图表数据失败')

    //   准备数据和配置项  合并数据
    const result = _.merge(res.data, this.options)

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  },
}
</script>

<style scoped>
</style>
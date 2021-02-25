<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 2、为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1、导入echarts
import echarts from "echarts"
// 导入lodash 实现对象的合并
import _ from "lodash"

export default {
  data() {
    return {
      // 需要合并的数据（因为返回数据没有鼠标指向提示内容，官网默认模版有）

      data: [{ name: "速度", value: 10 }],
    }
  },
  created() {},
  // 初始化报表，需要页面元素都渲染完毕，所以在mounted生命周期才行
  async mounted() {
    // 3、初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"))

    //4、准备数据和配置项（自己接口获取的）
    const { data: res } = await this.$http.get("reports/type/1")
    console.log(res)
    if (res.meta.status !== 200) {
      return this.$message.error("获取数据失败")
    }

    // 4、准备数据和配置项（官网默认的）
    // var option = {
    //   title: {
    //     text: "各种图表",
    //   },
    //   // 提示框
    //   tooltip: {},
    //   // 工具栏
    //   toolbox: {},
    //   // 图例
    //   legend: {
    //     // 图例中的data，对应series中的name
    //     data: ["柱状图", "折线图", "饼图", "散点图", "k线图", "雷达图", "仪表盘", "鲁班", "关羽","学习人数","就业人数"],
    //     left: 0,
    //     top: 30,
    //   },
    //   /*x 轴*/
    //   xAxis: {
    //     data: ["html", "css", "js"],
    //   },

      /*y 轴
       *   name 坐标轴名称
       *   min 刻度最小值
       *   max 刻度最大值
       *   interval 强制设置坐标轴分割间隔
       * */
      // yAxis: [
      //   { name: "学习人数", min: 0, max: 50, interval: 50 / 5 },
      //   { name: "就业人数", min: 0, max: 900, interval: 900 / 5 },
      // ],
      // 绘图区
      // grid: {
      //   top: 80,
      // },
      // 雷达图坐标系
      // radar: {
      //   // 雷达图指示器
      //   indicator: [
      //     { name: "生命", min: 0, max: 100, color: "green" },
      //     { name: "攻击", min: 0, max: 100, color: "maroon" },
      //     { name: "暴击", min: 0, max: 100, color: "orange" },
      //     { name: "防御", min: 0, max: 100, color: "black" },
      //     { name: "速度", min: 0, max: 100, color: "blue" },
      //   ],
      //   // 雷达图形状
      //   // shape:"circle"
      // },
      // series: [
        // {
        //   type: "gauge",
        //   // 散点图，二维数组，三个值 x，y，散点大小
        //   // k线图，二维数组，四个值 开盘值, 收盘值, 最低值, 最高值
        //   // 雷达图，对象数组，name则对应图例，雷达指示器的数据分别对应data的value数据
        //   // 仪表盘
        //   data: this.data,
        // },
        // {
        //   name: "学习人数",
        //   yAxisIndex: 0,
        //   type: "bar",
        //   data: [30, 20, 40],
        // },
        // {
        //   name: "就业人数",
        //   yAxisIndex: 1,
        //   type: "bar",
        //   data: [330, 450, 850],
        // },
      // ],
    // }
    var option ={
      tooltip:{
         trigger:"axis"
      }
    }

    // 通过lodash合并对象
    const result = _.merge(res.data, option)

    // 5、展示数据
    // myChart.setOption(option)  默认的图表数据
    // console.log(res.data)
    // myChart.setOption(res.data)
    myChart.setOption(result)
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}
</style>
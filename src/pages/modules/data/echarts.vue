<template>
  <div class="mod-role">
    <div id="myChart" :style="{width: '100%', height: '600px'}"></div>
  </div>
</template>

<script>
  // 引入基本模板
  let echarts = require('echarts/lib/echarts')
  // 引入柱状图组件
  require('echarts/lib/chart/line')
  // 引入提示框和title组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')
  export default {
    name: 'hello',
    data() {
      return {
        dataList:[ '周一', '周二', '周三', '周四', '周五', '周六', '周日' ]
      }
    },
    props: ['data'],
    mounted() {
      this.drawLine();
    },
    methods: {
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          title: {
            text: '活跃用户'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: this.dataTitle
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [ '周一', '周二', '周三', '周四', '周五', '周六', '周日' ]
          },
          yAxis: {
            type: 'value'
          },
          series: this.data
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="stylesheet/scss" scoped>

</style>

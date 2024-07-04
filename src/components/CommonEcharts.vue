<template>
  <div :id="chartId" class="w-full h-full"></div>
</template>

<script setup>
import { onMounted, watch, defineProps } from 'vue'
import * as echarts from 'echarts'
// 传入参数定义
const props = defineProps({
  // 图表ID
  chartId: {
    type: String,
    required: true,
  },
  // 图表数据
  chartData: {
    type: Object,
    required: true,
  },
})

let chart

// 组件挂载完毕
onMounted(() => {
  chart = echarts.init(document.getElementById(props.chartId))
  setChartOption()
})

// 监听图表数据的变化
watch(
  () => props.chartData,
  () => {
    setChartOption()
  }
)

function setChartOption() {
  const option = {
    grid: {
      top: '15%',
      left: '0%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      show: false,
      type: 'category',
      data: props.chartData.dates,
    },
    yAxis: {
      show: false,
      type: 'value',
    },
    series: [
      {
        name: '白天温度',
        type: 'line',
        data: props.chartData.dayTemps,
        smooth: true,
        itemStyle: {
          color: '#5470c6',
        },
        label: {
          show: true,
          // 格式化标签显示内容
          formatter: (params) => `白${params.value}℃`,
          color: '#ffffff',
          fontSize: 15,
        },
      },
      {
        name: '夜间温度',
        type: 'line',
        data: props.chartData.nightTemps,
        smooth: true,
        itemStyle: {
          color: '#91cc75',
        },
        label: {
          show: true,
          formatter: (params) => `晚${params.value}℃`,
          color: '#ffffff',
          fontSize: 15,
          position: 'bottom',
        },
      },
    ],
    backgroundColor: 'transparent',
  }

  chart.setOption(option)
}

// 响应式调整
window.addEventListener('resize', () => {
  chart && chart.resize()
})
</script>

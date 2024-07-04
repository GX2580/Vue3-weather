<template>
  <div :id="chartId" class="w-full h-full"></div>
</template>

<script setup>
import { onMounted, watch, defineProps } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  chartId: {
    type: String,
    required: true,
  },
  chartData: {
    type: Object,
    required: true,
  },
})

let chart

onMounted(() => {
  chart = echarts.init(document.getElementById(props.chartId))
  setChartOption()
})

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

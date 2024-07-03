<template>
  <div id="app">
    <div class="flex flex-col min-h-screen bg-weather-primary">
      <header class="bg-weather-primary shadow-lg sticky top-0 z-10">
        <nav class="w-2/3 mx-auto flex items-center justify-between gap-4 text-white py-6">
          <div class="flex items-center gap-8">
            <router-link to="/weather" aria-current="page">
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-sun text-2xl"></i>
                <p class="text-3xl ">新中地天气</p>
              </div>
            </router-link>
            <div class="flex gap-4 items-center">
              <h4 class="text-2xl">武汉市</h4>
              <span class="text-lg">实时天气:阴 29℃</span>
              <span class="text-lg">西风≤3级</span>
            </div>
          </div>
          <div>
            <i class="fa-solid fa-circle-info text-xl hover:text-weather-secondary cursor-pointer duration-1000"></i>
          </div>
        </nav>
      </header>

      <main class="w-2/3 mx-auto text-white flex flex-col items-center">
        <div class="w-full pt-4 mb-8 relative">
          <input
            type="text"
            placeholder="请输入城市名称"
            class="py-3 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none placeholder-text-lg focus:shadow-md"
          />
          <ul
            class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[62px]"
            style="display: none"
          >
            <p style="display: none">对不起网络似乎出了点问题 请稍后再查询</p>
            <p style="display: none">似乎没有找到你查找的城市</p>
          </ul>
        </div>
        
        <div class="w-full mt-10 max-h-[300px] overflow-y-scroll scrollbar-thin hover:scrollbar-thumb-blue-300">
          <div class="flex justify-between">
            <div class="mb-4 bg-weather-secondary py-4 px-5 flex justify-between cursor-pointer w-full duration-300">
              <h3>武汉市</h3>
              <span>30度</span>
            </div>
            <div class="flex mb-4 gap-2" style="display: none">
              <button class="bg-yellow-500 text-center w-[80px]">查看</button>
              <button class="bg-yellow-500 text-center w-[80px]">删除</button>
            </div>
          </div>
        </div>
        
        <div class="w-full mt-10 max-h-[300px] overflow-y-scroll scrollbar-thin hover:scrollbar-thumb-blue-300">
          <div class="flex justify-between">
            <div class="mb-4 bg-weather-secondary py-4 px-5 flex justify-between cursor-pointer w-full duration-300">
              <h3>安庆市</h3>
              <span>26度</span>
            </div>
            <div class="flex mb-4 gap-2" style="display: none">
              <button class="bg-yellow-500 text-center w-[80px]">查看</button>
              <button class="bg-yellow-500 text-center w-[80px]">删除</button>
            </div>
          </div>
        </div>
        
        <h2 class="mt-6 w-full">近期天气</h2>
        <div class="w-full bg-weather-secondary px-12 pt-10 mt-2 rounded">
          <div class="flex gap-6">
            <div class="flex flex-col flex-1 text-center gap-4">
              <span>今天</span><span>07-02</span><span>小雨</span><span>风力1-3级</span>
            </div>
            <div class="flex flex-col flex-1 text-center gap-4">
              <span>明天</span><span>07-03</span><span>小雨</span><span>风力1-3级</span>
            </div>
            <div class="flex flex-col flex-1 text-center gap-4">
              <span>周四</span><span>07-04</span><span>小雨</span><span>风力1-3级</span>
            </div>
            <div class="flex flex-col flex-1 text-center gap-4">
              <span>周五</span><span>07-05</span><span>小雨</span><span>风力1-3级</span>
            </div>
          </div>
          <div class="weathercanvas h-60 mt-6">
            <div id="weatherChart" style="width: 100%; height: 100%;"></div>
          </div>
        </div>
      </main>
    </div>
    
    <div class="fixed z-20 w-full bg-black bg-opacity-30 h-screen top-0 left-0 flex justify-center px-8 text-black" style="display: none">
      <div class="p-4 bg-white self-start mt-32 max-w-screen-md">
        <h2>关于:</h2>
        <p class="text-xs mb-4">这个应用可以用来追踪你选择城市的当前天气</p>
        <h2>如何使用:</h2>
        <p class="text-xs mb-4">
          "1.点击搜索框输入你希望追踪的城市"
          <br>
          "2.在搜索结果中选中一个城市,你将获取当地最新的天气"
          <br>
          "3.点击右侧的+号可以将追踪城市的天气情况保存在首页"
          <h2>移除城市</h2>
          <p class="text-xs">
            "如果你不想在首页关注某个城市,可以通过底部的按钮删"
            <br>
            "除它"
          </p>
        </p>
        <button class="text-white mt-8 bg-wheather-primary py-2 px-6 text-xs"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

const weatherData = ref([
  { date: '07-02', dayTemp: 29, nightTemp: 21 },
  { date: '07-03', dayTemp: 31, nightTemp: 25 },
  { date: '07-04', dayTemp: 36, nightTemp: 26 },
  { date: '07-05', dayTemp: 35, nightTemp: 27 },
]);

onMounted(() => {
  const chartDom = document.getElementById('weatherChart');
  const myChart = echarts.init(chartDom);
  
  const option = {
    grid: {
      top: '15%',
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      show: false,
      type: 'category',
      data: weatherData.value.map(item => item.date)
    },
    yAxis: {
      show: false,
      type: 'value'
    },
    series: [
      {
        name: '白天温度',
        type: 'line',
        data: weatherData.value.map(item => item.dayTemp),
        smooth: true,
        itemStyle: {
          color: '#5470c6'
        },
        label: {
          show: true,
          formatter: (params) => `白${params.value}℃`,
          color: '#ffffff'
        }
      },
      {
        name: '夜间温度',
        type: 'line',
        data: weatherData.value.map(item => item.nightTemp),
        smooth: true,
        itemStyle: {
          color: '#91cc75'
        },
        label: {
          show: true,
          formatter: (params) => `夜${params.value}℃`,
          color: '#ffffff'
        }
      }
    ],
    backgroundColor: 'transparent'
  };

  myChart.setOption(option);

  // 响应式调整
  window.addEventListener('resize', () => {
    myChart.resize();
  });
});
</script>

<style scoped>
/* 如果需要任何特定的样式，可以在这里添加 */
</style>
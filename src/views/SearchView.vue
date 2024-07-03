<template>
  <div class="flex flex-col min-h-screen bg-weather-primary">
    <Header
      :city="currentCity"
      :weather="currentWeather"
      :temperature="currentTemp"
      :wind="currentWind"
      @showInfo="showInfoModal"
    />

    <main class="w-3/4 mx-auto text-white flex flex-col items-center">
      <!-- Search input -->
      <div class="w-full pt-4 mb-6 relative">
        <div class="p-2 text-center bg-weather-secondary">
          您正在预览青岛市的天气信息
          <span style="display: none">,可以通过右上角的"+"号按钮保存起来</span>
        </div>
        <div class="container flex flex-col text-center mt-6 gap-4">
          <h1>当日气温是:25摄氏度</h1>
          <h1>当日天气是:多云</h1>
          <h1>当日风向是:南风</h1>
          <h1>当日风力是:≤3级</h1>
        </div>
        <hr class="border-white border-opacity-10 mt-6" />
        <ul
          v-show="false"
          class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[62px]"
        >
          <p v-if="true">对不起网络似乎出了点问题 请稍后再查询</p>
          <p v-if="false">似乎没有找到你查找的城市</p>
          <li
            v-for="result in searchResults"
            :key="result.id"
            @click="selectCity(result)"
            class="cursor-pointer hover:bg-weather-primary p-2"
          >
            {{ result.name }}
          </li>
        </ul>
      </div>

      <!-- Recent weather -->
      <h2 class="mt-6 w-full text-lg">近期天气</h2>
      <div class="w-full bg-weather-secondary px-12 pt-10 mt-2 rounded">
        <div class="flex gap-6 text-lg">
          <div
            v-for="day in recentWeather"
            :key="day.date"
            class="flex flex-col flex-1 text-center gap-4"
          >
            <span>{{ day.dayOfWeek }}</span>
            <span>{{ day.date }}</span>
            <span>{{ day.weather }}</span>
            <span>{{ day.wind }}</span>
          </div>
        </div>
        <div class="weathercanvas h-80 mt-6">
          <CommonEcharts :chartId="'weatherChart'" :chartData="chartData" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import CommonEcharts from '@/components/CommonEcharts.vue'

const chartData = ref({
  dates: ['07-02', '07-03', '07-04', '07-05'],
  dayTemps: [29, 31, 36, 35],
  nightTemps: [21, 25, 26, 27],
})

function showInfoModal() {
  // 实现显示信息模态框的逻辑
}

function handleSearch() {
  // 这里应该实现实际的搜索逻辑
  // 模拟搜索过程
  showSearchResults.value = true
  networkError.value = false
  noResults.value = false

  if (searchQuery.value.length > 0) {
    // 模拟API调用
    setTimeout(() => {
      if (Math.random() > 0.9) {
        networkError.value = true
        searchResults.value = []
      } else if (Math.random() > 0.5) {
        noResults.value = true
        searchResults.value = []
      } else {
        searchResults.value = [
          { id: 1, name: searchQuery.value + '市' },
          { id: 2, name: searchQuery.value + '县' },
          { id: 3, name: '新' + searchQuery.value + '区' },
        ]
      }
    }, 300)
  } else {
    showSearchResults.value = false
  }
}

function selectCity(city) {
  // 处理城市选择逻辑
  currentCity.value = city.name
  showSearchResults.value = false
  searchQuery.value = ''
  // 这里应该触发获取所选城市天气数据的逻辑
}
</script>

<style scoped>
/* 如果需要任何特定的样式，可以在这里添加 */
</style>

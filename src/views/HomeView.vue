<template>
  <div class="flex flex-col min-h-screen bg-weather-primary">
    <Header />

    <main class="w-3/4 mx-auto text-white flex flex-col items-center">
      <!-- Search input -->
      <div class="w-full pt-4 mb-6 relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="请输入城市名称"
          class="py-3 px-3 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none placeholder-text-3xl focus:shadow-md"
          @input="handleSearch"
        />
        <ul
          v-show="showSearchResults"
          class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[62px]"
        >
          <p v-if="networkError">对不起网络似乎出了点问题 请稍后再查询</p>
          <p v-if="noResults">似乎没有找到你查找的城市</p>
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

      <!-- City list -->
      <div
        class="w-full mt-4 max-h-[300px] overflow-y-scroll scrollbar-thin hover:scrollbar-thumb-blue-300"
      >
        <div class="flex flex-col gap-2">
          <div
            v-for="city in cities"
            :key="city.name"
            class="mb-4 text-xl relative group"
          >
            <div
              class="bg-weather-secondary py-4 px-5 flex justify-between cursor-pointer w-full transition-all duration-300 ease-in-out group-hover:w-[80%]"
            >
              <h3>{{ city.name }}</h3>
              <span>{{ city.temp }}度</span>
            </div>
            <div
              class="absolute right-0 top-0 h-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
            >
              <button
                class="bg-yellow-500 text-center w-[100px] py-4 px-5"
                @click.stop="viewCity(city.name)"
              >
                查看
              </button>
              <button
                class="bg-yellow-500 text-center w-[100px] py-4 px-5"
                @click.stop="deleteCity(city.name)"
              >
                删除
              </button>
            </div>
          </div>
        </div>
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

const searchQuery = ref('')
const showSearchResults = ref(false)
const searchResults = ref([])
const networkError = ref(false)
const noResults = ref(false)

const cities = ref([
  { name: '武汉市', temp: 30 },
  { name: '安庆市', temp: 26 },
  { name: '大庆市', temp: 26 },
])

const recentWeather = ref([
  { dayOfWeek: '今天', date: '07-02', weather: '小雨', wind: '风力1-3级' },
  { dayOfWeek: '明天', date: '07-03', weather: '小雨', wind: '风力1-3级' },
  { dayOfWeek: '周四', date: '07-04', weather: '小雨', wind: '风力1-3级' },
  { dayOfWeek: '周五', date: '07-05', weather: '小雨', wind: '风力1-3级' },
])

const chartData = ref({
  dates: ['07-02', '07-03', '07-04', '07-05'],
  dayTemps: [29, 31, 36, 35],
  nightTemps: [21, 25, 26, 27],
})

/* function handleSearch() {
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
        searchResults.value = [{ id: 1, name: searchQuery.value + '市' }]
      }
    }, 300)
  } else {
    showSearchResults.value = false
  }
} */

function selectCity(city) {
  // 处理城市选择逻辑
  showSearchResults.value = false
  searchQuery.value = ''
  // 这里应该触发获取所选城市天气数据的逻辑
}

function viewCity(cityName) {
  // 实现查看城市的逻辑
  console.log('查看城市:', cityName)
}

function deleteCity(cityName) {
  // 实现删除城市的逻辑
  console.log('删除城市:', cityName)
}
</script>

<style scoped>
/* 如果需要任何特定的样式，可以在这里添加 */
</style>

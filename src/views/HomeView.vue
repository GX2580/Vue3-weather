// src/views/HomeView.vue
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
            :key="city.adcode"
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
                @click.stop="deleteCity(city.adcode)"
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
            v-for="(day, index) in currentWeather"
            :key="index"
            class="flex flex-col flex-1 text-center gap-4"
          >
            <span>{{ getDayOfWeek(index) }}</span>
            <span>{{ day.date }}</span>
            <span>{{ day.dayweather }}</span>
            <span> 风力:{{ day.daywind }} {{ day.daypower }} </span>
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
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import CommonEcharts from '@/components/CommonEcharts.vue'
import { getLocationInfo, getWeather } from '@/api/weatherApi'

const searchQuery = ref('')
const showSearchResults = ref(false)
const searchResults = ref([])
const networkError = ref(false)
const noResults = ref(false)

const cities = ref([]) // 使用 ref([]) 初始化 cities

const currentWeather = ref([]) // 使用 ref([]) 初始化 currentWeather

const chartData = ref({
  dates: [],
  dayTemps: [],
  nightTemps: [],
})
// 获取今天是周几
const getDayOfWeek = (index) => {
  const daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const today = new Date().getDay()
  const calculatedIndex = (today + index) % 7
  if (index === 0) {
    return '今天'
  } else if (index === 1) {
    return '明天'
  } else {
    return daysOfWeek[calculatedIndex]
  }
}

// 处理搜索逻辑
const handleSearch = () => {
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
}

// 处理城市选择逻辑
const selectCity = (city) => {
  // 处理城市选择逻辑
  showSearchResults.value = false
  searchQuery.value = ''
  // 这里应该触发获取所选城市天气数据的逻辑
}

// 查看城市天气
const viewCity = (cityName) => {
  // 实现查看城市的逻辑
  console.log('查看城市:', cityName)
}
// 删除城市
const deleteCity = (adcode) => {
  // 实现删除城市的逻辑
  // 根据 adcode 从 cities 中删除对应的城市
  cities.value = cities.value.filter((city) => city.adcode !== adcode)
}
// 初始化页面，加载默认城市天气信息
onMounted(async () => {
  try {
    const res = await getLocationInfo() // 获取位置信息
    const adcode = res.data.adcode
    const weatherRes = await getWeather(adcode) // 获取天气信息
    const forecasts = weatherRes.data.forecasts[0].casts // 获取预报信息

    // 更新 cities 数据
    cities.value = [
      {
        name: weatherRes.data.forecasts[0].city,
        temp: forecasts[0].daytemp, // 使用当天白天温度
        adcode: weatherRes.data.forecasts[0].adcode, // 添加 adcode 属性
      },
    ]

    // 更新 currentWeather 数据
    currentWeather.value = forecasts

    // 更新 chartData 数据
    chartData.value = {
      dates: forecasts.map((item) => item.date),
      dayTemps: forecasts.map((item) => item.daytemp),
      nightTemps: forecasts.map((item) => item.nighttemp),
    }
  } catch (error) {
    console.error('获取天气信息失败：', error)
  }
})
</script>

<style scoped>
/* 如果需要任何特定的样式，可以在这里添加 */
</style>

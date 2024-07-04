<!-- src/views/HomeView.vue -->
<template>
  <div class="flex flex-col min-h-screen bg-weather-primary">
    <!-- 头部组件 -->
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
        <!-- 搜索结果列表 -->
        <div
          v-show="showSearchResults"
          class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[62px]"
        >
          <p v-if="networkError">对不起网络似乎出了点问题 请稍后再查询</p>
          <p v-if="!networkError && !searchResult">似乎没有找到你查找的城市</p>
          <div
            v-for="result in searchResult"
            :key="result.id"
            @click="handleCitySelect(result)"
            class="cursor-pointer hover:bg-weather-primary p-2"
          >
            {{ result.name }}
          </div>
        </div>
      </div>

      <!-- 城市列表 -->
      <div
        v-show="!showSearchResults"
        class="w-full mt-4 max-h-[300px] overflow-y-scroll scrollbar-thin hover:scrollbar-thumb-blue-300"
      >
        <h2 v-if="cities.length === 0" class="text-center duration-200">
          暂时没有保存过城市天气信息，请查询后点击右上角"+"号保存。
        </h2>
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
              <span>{{ getLiveTemp(city.adcode) }}度</span>
            </div>
            <div
              class="absolute right-0 top-0 h-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
            >
              <button
                class="bg-yellow-500 text-center w-[100px] py-4 px-5"
                @click.stop="handleCitySelect(city)"
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
      <div class="w-full bg-weather-secondary px-12 pt-10 mt-2 rounded">
        <h2 class="mt-6 w-full text-lg">近期天气</h2>
        <div class="flex gap-6 text-lg">
          <div
            v-for="(day, index) in currentWeather"
            :key="index"
            class="flex flex-col flex-1 text-center gap-4"
          >
            <span>{{ weatherStore.getDayOfWeek(index) }}</span>
            <span>{{ weatherStore.formatDate(day.date) }}</span>
            <span>{{ day.dayweather }}</span>
            <span> 风力:{{ weatherStore.formatWind(day.daypower) }} </span>
          </div>
        </div>
        <div class="weathercanvas h-80 mt-6">
          <CommonEcharts
            :chartId="'weatherChart'"
            :chartData="currentCityChartData"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Header from '@/components/Header.vue'
import CommonEcharts from '@/components/CommonEcharts.vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { useRouter } from 'vue-router' // 引入 useRouter

const weatherStore = useWeatherStore()
const router = useRouter() // 创建 router 实例

const searchQuery = ref('') // 搜索关键词
const showSearchResults = ref(false) // 是否显示搜索结果
const searchResult = ref(null) // 搜索结果
const networkError = ref(false) // 是否出现网络错误

// 获取天气数据
const cities = computed(() => weatherStore.cities) // 城市列表
const currentWeather = computed(() => weatherStore.currentWeather) // 当前位置天气预报

// 使用 computed 计算当前位置的 chartData
const currentCityChartData = computed(() => {
  // 直接使用 store 中存储的当前位置天气预报数据
  const forecasts = weatherStore.currentWeather
  return {
    dates: forecasts.map((item) => item.date),
    dayTemps: forecasts.map((item) => item.daytemp),
    nightTemps: forecasts.map((item) => item.nighttemp),
  }
})

// 获取实时温度
const getLiveTemp = (adcode) => {
  const city = cities.value.find((city) => city.adcode === adcode)
  if (city) {
    return city.temp // 返回城市的实时温度
  }
  return 'N/A' // 如果没有找到城市，返回 N/A
}
// 处理搜索逻辑
const handleSearch = async () => {
  if (searchQuery.value === '') {
    showSearchResults.value = false
    return
  }
  showSearchResults.value = true
  networkError.value = false
  try {
    const result = await weatherStore.searchCity(searchQuery.value)
    searchResult.value = result
  } catch (error) {
    networkError.value = true
    console.error('搜索城市时出错:', error)
  }
}

// 处理城市选择逻辑
const handleCitySelect = async (city) => {
  searchQuery.value = ''
  showSearchResults.value = false
  // 跳转到 SearchView 并传递 adcode
  router.push({ name: 'weather', params: { adcode: city.adcode } })
}

const deleteCity = (adcode) => {
  weatherStore.deleteCity(adcode)
}

onMounted(async () => {
  await weatherStore.initialize()
})
</script>

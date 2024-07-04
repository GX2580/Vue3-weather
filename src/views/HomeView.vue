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
          <p v-if="!networkError && searchResults.length === 0">
            似乎没有找到你查找的城市
          </p>
          <li
            v-for="result in searchResults"
            :key="result.adcode"
            @click="handleCitySelect(result)"
            class="cursor-pointer hover:bg-weather-primary p-2"
          >
            {{ result.name }}
          </li>
        </ul>
      </div>
      <h2 v-if="true" class="text-center duration-200">
        暂时没有保存过城市天气信息，请查询后点击右上角"+"号保存。
      </h2>
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
              <span>{{ getLiveTemp(city.adcode) }}度</span>
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
            <span>{{ formatDate(day.date) }}</span>
            <span>{{ day.dayweather }}</span>
            <span> 风力:{{ formatWind(day.daypower) }} </span>
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

const weatherStore = useWeatherStore()

const searchQuery = ref('')
const showSearchResults = ref(false)
const searchResults = ref([])
const networkError = ref(false)

// 获取天气数据
const cities = computed(() => weatherStore.cities)
const currentWeather = computed(() => weatherStore.currentWeather)

// 使用 computed 计算当前城市的 chartData
const currentCityChartData = computed(() => {
  // 查找当前城市的天气预报数据
  const currentCity = cities.value.find((city) => city.isDefault)
  if (currentCity) {
    const forecasts = weatherStore.currentWeather
    return {
      dates: forecasts.map((item) => item.date),
      dayTemps: forecasts.map((item) => item.daytemp),
      nightTemps: forecasts.map((item) => item.nighttemp),
    }
  } else {
    // 如果没有找到当前城市，返回空数据
    return {
      dates: [],
      dayTemps: [],
      nightTemps: [],
    }
  }
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
// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${month}-${day}`
}
// 格式化风力
const formatWind = (windPower) => {
  const windPowerNumber = parseInt(windPower.replace('级', ''))
  return `${windPowerNumber}-${windPowerNumber + 2}`
}
// 获取实时温度
const getLiveTemp = (adcode) => {
  const city = cities.value.find((city) => city.adcode === adcode)
  if (city) {
    return city.temp // 返回城市的实时温度
  }
  return 'N/A' // 如果没有找到城市，返回 N/A
}

const handleSearch = async () => {
  if (searchQuery.value === '') {
    showSearchResults.value = false
    return
  }
  showSearchResults.value = true
  networkError.value = false
  try {
    const results = await weatherStore.searchCity(searchQuery.value)
    // 修改searchResults 为当前行政区数据
    searchResults.value = results
  } catch (error) {
    networkError.value = true
    console.error('搜索城市时出错:', error)
  }
}

const handleCitySelect = async (city) => {
  searchQuery.value = ''
  showSearchResults.value = false
  try {
    await weatherStore.addCity({
      name: city.name,
      adcode: city.adcode,
      temp: weatherStore.liveWeather.temperature, // 将实时温度存储在 city 对象中
    })
  } catch (error) {
    console.error('添加城市失败：', error)
  }
}

const viewCity = (cityName) => {
  // 实现查看城市的逻辑
  console.log('查看城市:', cityName)
}
const deleteCity = (adcode) => {
  weatherStore.deleteCity(adcode)
}

onMounted(async () => {
  await weatherStore.initialize()
})
</script>

<style scoped>
/* 如果需要任何特定的样式，可以在这里添加 */
</style>
修改了handlesearch的部分将获取到的数据改为当前行政区数据

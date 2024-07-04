<!-- src/views/SearchView.vue -->
<template>
  <div class="flex flex-col min-h-screen bg-weather-primary">
    <Header />

    <main class="w-3/4 mx-auto text-white flex flex-col items-center">
      <!-- Search input -->
      <div class="w-full pt-4 mb-6 relative">
        <div class="p-2 text-center bg-weather-secondary">
          您正在预览{{ cityName }}的天气信息
          <span v-if="!cityExistsInStore()" style="display: inline"
            >,可以通过右上角的"+"号按钮保存起来</span
          >
        </div>
        <div class="container flex flex-col text-center mt-6 gap-4">
          <h1>当日气温是:{{ liveWeather.temperature }}摄氏度</h1>
          <h1>当日天气是:{{ liveWeather.weather }}</h1>
          <h1>当日风向是:{{ liveWeather.winddirection }}</h1>
          <h1>当日风力是:{{ liveWeather.windpower }}</h1>
        </div>
        <hr class="border-white border-opacity-10 mt-6" />
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
            <span>{{ weatherStore.getDayOfWeek(index) }}</span>
            <span>{{ weatherStore.formatDate(day.date) }}</span>
            <span>{{ day.dayweather }}</span>
            <span> 风力:{{ weatherStore.formatWind(day.daypower) }} </span>
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import CommonEcharts from '@/components/CommonEcharts.vue'
import { useWeatherStore } from '@/stores/weatherStore'

const route = useRoute()
const weatherStore = useWeatherStore()
const cityName = ref('')

const chartData = ref({
  dates: [],
  dayTemps: [],
  nightTemps: [],
})

const currentWeather = computed(() => weatherStore.currentWeather)
const liveWeather = ref({})

// 获取天气数据
const cities = computed(() => weatherStore.cities) // 城市列表
const cityExistsInStore = () => {
  return weatherStore.cities.some((city) => city.adcode === route.params.adcode)
}
// 监听路由变化
watch(
  () => route.params.adcode,
  async (newAdcode) => {
    if (newAdcode) {
      try {
        await weatherStore.setLiveWeatherData(newAdcode)
        // 在获取实时天气数据后，再设置城市名称
        cityName.value = weatherStore.liveWeather.city

        await weatherStore.setWeatherData(newAdcode)
        chartData.value = {
          dates: weatherStore.currentWeather.map((item) => item.date),
          dayTemps: weatherStore.currentWeather.map((item) => item.daytemp),
          nightTemps: weatherStore.currentWeather.map((item) => item.nighttemp),
        }
        liveWeather.value = weatherStore.liveWeather
      } catch (error) {
        console.error('获取天气信息失败：', error)
      }
    }
  },
  { immediate: true }
)
</script>

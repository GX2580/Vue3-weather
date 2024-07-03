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
      <!-- City list -->
      <div
        class="w-full mt-4 max-h-[300px] overflow-y-scroll scrollbar-thin hover:scrollbar-thumb-blue-300"
      >
        <div class="flex flex-col gap-2">
          <div
            v-for="city in cities"
            :key="city.name"
            class="mb-4 text-xl bg-weather-secondary py-4 px-5 flex justify-between cursor-pointer w-full duration-300 relative group"
          >
            <h3
              class="transition-all duration-300 ease-in-out group-hover:mr-16"
            >
              {{ city.name }}
            </h3>
            <span
              class="transition-all duration-300 ease-in-out group-hover:mr-16"
              >{{ city.temp }}度</span
            >
            <div
              class="absolute right-0 top-0 bottom-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
            >
              <button
                class="bg-yellow-500 text-center w-[80px]"
                @click="viewCity(city.name)"
              >
                查看
              </button>
              <button
                class="bg-yellow-500 text-center w-[80px]"
                @click="deleteCity(city.name)"
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

const currentCity = ref('武汉市')
const currentWeather = ref('阴')
const currentTemp = ref(29)
const currentWind = ref('西风≤3级')

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

function showInfoModal() {
  // 实现显示信息模态框的逻辑
}

function viewCity(cityName) {
  // 实现查看城市的逻辑
}

function deleteCity(cityName) {
  // 实现删除城市的逻辑
}
</script>

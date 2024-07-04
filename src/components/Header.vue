<!-- src/components/WeatherHeader.vue -->
<template>
  <header class="bg-weather-primary shadow-lg sticky top-0 z-10">
    <nav
      class="w-3/4 mx-auto flex items-center justify-between gap-4 text-white py-8"
    >
      <div class="flex items-center gap-6">
        <router-link to="/weather" aria-current="page">
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-sun text-2xl"></i>
            <p class="text-3xl">新中地天气</p>
          </div>
        </router-link>
        <div v-if="!weatherStore.loading" class="flex gap-3 items-center">
          <h4 class="text-2xl">{{ weatherStore.city }}</h4>
          <span class="text-lg">
            实时天气: {{ weatherStore.liveWeather.weather }}
            {{ weatherStore.liveWeather.temperature }}℃
          </span>
          <span class="text-lg">
            {{ weatherStore.liveWeather.winddirection }}
            {{ weatherStore.liveWeather.windpower }}
          </span>
        </div>
        <div v-else>Loading weather data...</div>
      </div>
      <div class="flex items-center gap-4">
        <i
          class="fa-solid fa-circle-info text-xl hover:text-weather-secondary cursor-pointer duration-1000"
          @click="toggleInfo"
        ></i>
        <i
          class="fa-solid fa-plus text-xl hover:text-weather-secondary duration-150 cursor-pointer"
          style="display: none"
        ></i>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { onMounted } from 'vue'
import { useInfoStore } from '@/stores/infoStore'
import { useWeatherStore } from '@/stores/weatherStore'

const infoStore = useInfoStore()
const weatherStore = useWeatherStore()

function toggleInfo() {
  infoStore.toggleInfo()
}

onMounted(() => {
  weatherStore.initialize() // 修改为调用 initialize 方法
})
</script>

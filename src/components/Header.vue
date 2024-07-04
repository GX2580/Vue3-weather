<template>
  <header class="bg-weather-primary shadow-lg sticky top-0 z-10">
    <nav
      class="w-3/4 mx-auto flex items-center justify-between gap-4 text-white py-8"
    >
      <div class="flex items-center gap-6">
        <!-- 路由跳转 首页 -->
        <router-link to="/" aria-current="page">
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-sun text-2xl"></i>
            <p class="text-3xl">新中地天气</p>
          </div>
        </router-link>
        <!-- 展示实时天气 -->
        <div
          v-if="!weatherStore.loading"
          class="flex gap-3 items-center text-3xl"
        >
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
        <!-- 信息图标 点击事件-->
        <i
          class="fa-solid fa-circle-info text-xl hover:text-weather-secondary cursor-pointer duration-1000"
          @click="toggleInfo"
        ></i>
        <!-- 根据当前路由判断是否显示添加按钮 -->
        <i
          v-if="showAddButton"
          class="fa-solid fa-plus text-xl hover:text-weather-secondary duration-150 cursor-pointer"
          @click="addCity"
        ></i>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useInfoStore } from '@/stores/infoStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { useRoute } from 'vue-router'
import { searchCityByAdcode } from '@/api/weatherApi'

const infoStore = useInfoStore()
const weatherStore = useWeatherStore()
const route = useRoute()

// 计算属性，判断是否显示添加按钮
const showAddButton = computed(() => {
  // 只在 /weather/:adcode 路由下并且城市不存在时显示
  const routeName = route.name
  if (routeName === 'weather' && !cityExistsInStore(route.params.adcode)) {
    return true
  }
  return false
})

// 判断城市是否已经存在于 store 中
function cityExistsInStore(adcode) {
  return weatherStore.cities.some((city) => city.adcode === adcode)
}

function toggleInfo() {
  infoStore.toggleInfo()
}

// 添加城市到 store
async function addCity() {
  const adcode = route.params.adcode

  try {
    // 根据 adcode 获取城市信息
    const res = await searchCityByAdcode(adcode)
    console.log(res)
    const cityName = res.data.districts[0].name

    await weatherStore.addCity({
      name: cityName,
      adcode: adcode,
      temp: weatherStore.liveWeather.temperature,
    })
  } catch (error) {
    console.error('添加城市时出错:', error)
  }
}

onMounted(() => {
  weatherStore.initialize()
})
</script>

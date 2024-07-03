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
        <div class="flex gap-3 items-center">
          <h4 class="text-2xl">{{ city }}</h4>
          <span class="text-lg">实时天气:{{ weather }} {{ temperature }}℃</span>
          <span class="text-lg">{{ wind }}</span>
        </div>
      </div>
      <div>
        <i
          class="fa-solid fa-circle-info text-xl hover:text-weather-secondary cursor-pointer duration-1000"
          @click="toggleInfo"
        ></i>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { defineProps } from 'vue'
import { useInfoStore } from '@/stores/infoStore'

const props = defineProps({
  city: String,
  weather: String,
  temperature: Number,
  wind: String,
})

const infoStore = useInfoStore()

function toggleInfo() {
  infoStore.toggleInfo()
}
</script>

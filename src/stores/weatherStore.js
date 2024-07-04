// src/stores/weatherStore.js
import { defineStore } from 'pinia'
import { getLocationInfo, getWeather } from '@/api/weatherApi'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    city: '',
    weather: '',
    temperature: '',
    wind: '',
    loading: false,
    error: null,
  }),
  actions: {
    async fetchWeatherData() {
      this.loading = true
      this.error = null
      try {
        // 首先获取位置信息
        const locationResponse = await getLocationInfo()
        const adcode = locationResponse.data.adcode

        // 然后使用获取到的adcode获取天气信息
        const weatherResponse = await getWeather(adcode)
        const weatherData = weatherResponse.data.lives[0]

        this.city = weatherData.city
        this.weather = weatherData.weather
        this.temperature = weatherData.temperature
        this.wind = `${weatherData.winddirection}风 ${weatherData.windpower}级`
      } catch (error) {
        console.error('Error fetching weather data:', error)
        this.error = 'Failed to fetch weather data'
      } finally {
        this.loading = false
      }
    },
  },
})

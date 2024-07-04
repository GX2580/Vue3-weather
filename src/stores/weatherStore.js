// src/stores/weatherStore.js
import { defineStore } from 'pinia'
import {
  getLocationInfo,
  getWeather,
  searchCity,
  getLiveWeather, // 引入 getLiveWeather
} from '@/api/weatherApi'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    cities: [],
    currentWeather: [],
    liveWeather: {}, // 新增 liveWeather 用于存储实时天气数据
    chartData: {
      dates: [],
      dayTemps: [],
      nightTemps: [],
    },
    loading: false,
    error: null,
    city: '',
  }),
  actions: {
    // 获取并设置天气数据(预报)
    async setWeatherData(adcode) {
      this.loading = true
      this.error = null
      try {
        const weatherRes = await getWeather(adcode)
        const forecasts = weatherRes.data.forecasts[0].casts
        // 更新 currentWeather 数据
        this.currentWeather = forecasts

        // 更新 chartData 数据
        this.chartData = {
          dates: forecasts.map((item) => item.date),
          dayTemps: forecasts.map((item) => item.daytemp),
          nightTemps: forecasts.map((item) => item.nighttemp),
        }
      } catch (error) {
        console.error('获取天气信息失败：', error)
        this.error = 'Failed to fetch weather data'
      } finally {
        this.loading = false
      }
    },
    // 获取并设置实时天气
    async setLiveWeatherData(adcode) {
      try {
        const res = await getLiveWeather(adcode)
        // 处理返回的实时天气数据
        this.liveWeather = res.data.lives[0] 
      } catch (error) {
        console.error('获取实时天气信息失败：', error)
      }
    },
    // 添加城市
    async addCity(city) {
      const exists = this.cities.some((item) => item.adcode === city.adcode)
      if (exists) {
        // 如果城市已存在，不重复添加
        return
      }
      this.cities.push(city)
      // 获取并设置天气数据
      await this.setWeatherData(city.adcode)
      await this.setLiveWeatherData(city.adcode)
    },
    // 删除城市
    deleteCity(adcode) {
      // 根据 adcode 从 cities 中删除对应的城市
      this.cities = this.cities.filter((city) => city.adcode !== adcode)
    },
    // 初始化，获取默认城市天气信息
    async initialize() {
      try {
        const res = await getLocationInfo() // 获取位置信息
        const adcode = res.data.adcode
        this.city = res.data.city // 保存城市名称
        const city = {
          name: res.data.city,
          adcode: adcode,
          isDefault: true, // 标记为默认城市
        }
        await this.addCity(city)
      } catch (error) {
        console.error('获取天气信息失败：', error)
      }
    },

    // 搜索城市
    async searchCity(keywords) {
      try {
        const res = await searchCity(keywords)
        // 返回搜索结果
        return res.data.districts[0].districts
      } catch (error) {
        console.error('搜索城市失败：', error)
        throw error
      }
    },
  },
})
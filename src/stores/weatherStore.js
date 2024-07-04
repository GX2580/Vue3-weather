// src/stores/weatherStore.js
import { defineStore } from 'pinia'
import {
  getLocationInfo,
  getWeather,
  searchCity,
  getLiveWeather,
} from '@/api/weatherApi'

// 从 localStorage 中读取城市列表，如果没有则初始化为空数组
// 读取localstorage
const storedCities = localStorage.getItem('cities')
const initialCities = storedCities ? JSON.parse(storedCities) : []

// 天气状态管理
export const useWeatherStore = defineStore('weather', {
  state: () => ({
    // 使用 initialCities 初始化 cities
    cities: initialCities,
    currentWeather: [],
    liveWeather: {},
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
      // 在添加城市后更新 localStorage
      this.saveCitiesToLocalStorage()
    },
    // 删除城市
    deleteCity(adcode) {
      // 根据 adcode 从 cities 中删除对应的城市
      this.cities = this.cities.filter((city) => city.adcode !== adcode)
      // 在删除城市后更新 localStorage
      this.saveCitiesToLocalStorage()
    },
    // 初始化，获取默认城市天气信息
    async initialize() {
      try {
        const res = await getLocationInfo() // 获取位置信息
        const adcode = res.data.adcode
        this.city = res.data.city // 保存城市名称

        // 获取并设置当前位置的天气数据
        await this.setWeatherData(adcode)
        await this.setLiveWeatherData(adcode)
      } catch (error) {
        console.error('获取天气信息失败：', error)
      }
    },

    // 搜索城市
    async searchCity(keywords) {
      try {
        const res = await searchCity(keywords)
        // 返回搜索结果
        return res.data.districts
      } catch (error) {
        console.error('搜索城市失败：', error)
        throw error
      }
    },
    // 将城市列表保存到 localStorage
    saveCitiesToLocalStorage() {
      localStorage.setItem('cities', JSON.stringify(this.cities))
    },
    // 获取今天是周几
    getDayOfWeek(index) {
      const daysOfWeek = [
        '周日',
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
        '周六',
      ]
      const today = new Date().getDay()
      const calculatedIndex = (today + index) % 7
      if (index === 0) {
        return '今天'
      } else if (index === 1) {
        return '明天'
      } else {
        return daysOfWeek[calculatedIndex]
      }
    },
    // 格式化日期
    formatDate(dateString) {
      const date = new Date(dateString)
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${month}-${day}`
    },
    // 格式化风力
    formatWind(windPower) {
      if (!windPower) {
        // 处理 windPower 为 undefined 的情况
        return 'N/A'
      }
      const windPowerNumber = parseInt(windPower.replace('级', ''))
      return `${windPowerNumber}-${windPowerNumber + 2}级`
    },
  },
})

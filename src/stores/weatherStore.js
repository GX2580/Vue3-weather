// src/stores/weatherStore.js
import { defineStore } from 'pinia'
import {
  getLocationInfo,
  getWeather,
  searchCity,
  getLiveWeather,
  getGeocode, // 引入新的接口
} from '@/api/weatherApi'

// 从 localStorage 中读取城市列表，如果没有则初始化为空数组
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
    // 搜索结果
    searchResult: {
      adcode: null,
      province: null,
      city: null,
      district: null,
    },
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
        return res.data.lives[0] // 返回实时天气数据
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
      // 保存城市列表到 localStorage
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
        // 使用新的接口获取城市信息
        const res = await getGeocode(keywords)
        if (res.data.status === '1') {
          const geocode = res.data.geocodes[0]

          // 根据level确定如何设置searchResult
          switch (geocode.level) {
            case '省':
            case '市':
              this.searchResult = {
                adcode: geocode.adcode,
                province: geocode.province,
                city: geocode.city,
                district: '', // 省市级没有区县，设置为空字符串
                level: geocode.level,
              }
              break
            case '区县':
              this.searchResult = {
                adcode: geocode.adcode,
                province: geocode.province,
                city: geocode.city,
                district: geocode.district,
                level: geocode.level,
              }
              break
            case '乡镇':
              // 获取乡镇所在区县的adcode
              const districtRes = await getGeocode(geocode.district)
              const districtAdcode = districtRes.data.geocodes[0].adcode

              this.searchResult = {
                adcode: districtAdcode, // 使用区县的adcode
                province: geocode.province,
                city: geocode.city,
                district: geocode.district,
                level: geocode.level,
              }
              break
            default:
              this.searchResult = {
                adcode: null,
                province: null,
                city: null,
                district: null,
                level: null,
              }
          }
        } else {
          this.searchResult = {
            adcode: null,
            province: null,
            city: null,
            district: null,
            level: null,
          }
        }
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
        return 'N/A'
      }
      // 提取所有数字
      const windPowerNumbers = windPower.match(/\d+/g)

      if (windPowerNumbers.length === 2) {
        // 如果提取到两个数字，则返回 "x-y级" 格式
        return `${windPowerNumbers[0]}-${windPowerNumbers[1]}级`
      } else if (windPowerNumbers.length === 1) {
        // 如果提取到一个数字，则返回 "x级" 格式
        return `${windPowerNumbers[0]}级`
      } else {
        // 其他情况，返回原始值
        return windPower
      }
    },
  },
})

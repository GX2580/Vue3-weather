// src/api/weatherApi.js
import axios from 'axios'

// 获取API密钥
const API_KEY = import.meta.env.VITE_AMAP_API_KEY

// 设置基础URL
const BASE_URL = 'https://restapi.amap.com/v3'

// 创建axios实例
const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    // 设置默认参数，包含API密钥
    key: API_KEY,
  },
})

// 获取位置信息
export const getLocationInfo = () => {
  return weatherApi.get('/ip')
}

// 获取天气信息(预报)
export const getWeather = (adcode) => {
  return weatherApi.get('/weather/weatherInfo', {
    params: {
      // 城市代码
      city: adcode,
      // 请求所有天气信息
      extensions: 'all',
    },
  })
}

// 获取实时天气
export const getLiveWeather = (adcode) => {
  return weatherApi.get('/weather/weatherInfo', {
    params: {
      // 城市代码
      city: adcode,
      // 请求实时天气信息
      extensions: 'base',
    },
  })
}

// 搜索城市
export const searchCity = (keywords) => {
  return weatherApi.get('/config/district', {
    params: {
      // 搜索关键词
      keywords: keywords,
      // 获取当前行政区
      subdistrict: 0,
      extensions: 'base',
    },
  })
}

// 根据 adcode 搜索城市
export const searchCityByAdcode = (adcode) => {
  return weatherApi.get('/config/district', {
    params: {
      // 使用 adcode 进行搜索
      keywords: adcode,
      // 获取当前行政区
      subdistrict: 0,
      extensions: 'base',
    },
  })
}

// 根据地址获取城市信息
export const getGeocode = (address) => {
  return axios.get(`${BASE_URL}/geocode/geo`, {
    params: {
      key: API_KEY,
      address: address,
    },
  })
}

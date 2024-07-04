// src/api/weatherApi.js
import axios from 'axios'

const API_KEY = import.meta.env.VITE_AMAP_API_KEY // 获取API密钥
const BASE_URL = 'https://restapi.amap.com/v3' // 设置基础URL

const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY, // 设置默认参数，包含API密钥
  },
})

// 获取位置信息
export const getLocationInfo = () => {
  return weatherApi.get('/ip')
}

// 获取天气信息
export const getWeather = (adcode) => {
  return weatherApi.get('/weather/weatherInfo', {
    params: {
      city: adcode, // 城市代码
      extensions: 'all', // 请求所有天气信息
    },
  })
}

// 搜索城市
export const searchCity = (keywords) => {
  return weatherApi.get('/place/text', {
    params: {
      keywords: keywords, // 搜索关键词
      types: '190100', // 城市代码类型
    },
  })
}

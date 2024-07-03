// src/api/weatherApi.js
import axios from 'axios'
const API_KEY = import.meta.env.VITE_AMAP_API_KEY
const BASE_URL = 'https://restapi.amap.com/v3/weather/weatherInfo'

const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
    extensions: 'all',
  },
})

export const getWeather = (city) => {
  return weatherApi.get('', {
    params: {
      city: city,
    },
  })
}

export const searchCity = (keywords) => {
  return axios.get('https://restapi.amap.com/v3/place/text', {
    params: {
      key: API_KEY,
      keywords: keywords,
      types: '190100', // 城市代码
    },
  })
}

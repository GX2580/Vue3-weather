// src/api/weatherApi.js
import axios from 'axios'

const API_KEY = import.meta.env.VITE_AMAP_API_KEY
const BASE_URL = 'https://restapi.amap.com/v3'

const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
})

export const getLocationInfo = () => {
  return weatherApi.get('/ip')
}

export const getWeather = (adcode) => {
  return weatherApi.get('/weather/weatherInfo', {
    params: {
      city: adcode,
      extensions: 'base',
    },
  })
}

export const searchCity = (keywords) => {
  return weatherApi.get('/place/text', {
    params: {
      keywords: keywords,
      types: '190100', // 城市代码
    },
  })
}
<template>
  <div id="app">
    <router-view></router-view>

    <!-- 添加测试按钮 -->
    <button
      @click="testWeatherApi"
      class="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
    >
      测试天气 API
    </button>
    <!-- Info Modal -->
    <div
      v-if="infoStore.showInfo"
      class="fixed z-20 w-full bg-black bg-opacity-30 h-screen top-9 left-0 flex justify-center px-8 text-black"
    >
      <div class="p-4 bg-white self-start mt-32 max-w-screen-md">
        <h2>关于:</h2>
        <p class="text-xs mb-4">这个应用可以用来追踪你选择城市的当前天气</p>
        <h2>如何使用:</h2>
        <p class="text-xs mb-4">
          1.点击搜索框输入你希望追踪的城市
          <br />
          2.在搜索结果中选中一个城市,你将获取当地最新的天气
          <br />
          3.点击右侧的+号可以将追踪城市的天气情况保存在首页
        </p>
        <h2>移除城市</h2>
        <p class="text-xs">
          如果你不想在首页关注某个城市,可以通过底部的按钮删除它
        </p>
        <button
          @click="closeInfo"
          class="text-white mt-8 bg-weather-primary py-2 px-6 text-xs"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useInfoStore } from '@/stores/infoStore'
import { getWeather, searchCity } from '@/api/weatherApi'
const infoStore = useInfoStore()

function closeInfo() {
  infoStore.closeInfo()
}

// 添加测试方法
async function testWeatherApi() {
  try {
    // 测试获取天气数据
    const weatherResponse = await getWeather('北京')
    console.log('Weather Data:', weatherResponse.data)

    // 测试城市搜索
    const searchResponse = await searchCity('上海')
    console.log('City Search Results:', searchResponse.data)
  } catch (error) {
    console.error('API 测试失败:', error)
  }
}
</script>

import '@/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.css'
import router from './router'

// 引入 ECharts
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'

// 手动引入 ECharts 模块来减小打包体积
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'

// 使用特定的组件
use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])

const app = createApp(App)

// 全局注册 ECharts 组件
app.component('v-chart', ECharts)

app.use(createPinia())
app.use(router)

app.mount('#app')

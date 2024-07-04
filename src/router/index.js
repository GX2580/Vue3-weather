import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
// 路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      // 动态路由
      path: '/weather/:adcode',
      name: 'weather',
      component: () => import('@/views/SearchView.vue'),
    },
  ],
})

export default router

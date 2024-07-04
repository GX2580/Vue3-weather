import { defineStore } from 'pinia'
// 信息状态管理
export const useInfoStore = defineStore('info', {
  state: () => ({
    showInfo: false,
  }),
  actions: {
    toggleInfo() {
      this.showInfo = !this.showInfo
    },
    closeInfo() {
      this.showInfo = false
    },
  },
})

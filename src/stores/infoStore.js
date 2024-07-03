import { defineStore } from 'pinia'

export const useInfoStore = defineStore('info', {
  state: () => ({
    showInfo: false
  }),
  actions: {
    toggleInfo() {
      this.showInfo = !this.showInfo
    },
    closeInfo() {
      this.showInfo = false
    }
  }
})
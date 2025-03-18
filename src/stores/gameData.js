import { defineStore } from 'pinia'
import { loadAllData } from '../utils/dataLoader'

export const useGameDataStore = defineStore('gameData', {
  state: () => ({
    data: {
      chess: null,
      race: null,
      job: null
    },
    isLoading: false,
    isLoaded: false
  }),

  actions: {
    async loadData() {
      // 如果数据已经加载过，直接返回
      if (this.isLoaded) {
        return this.data
      }

      // 如果正在加载中，等待加载完成
      if (this.isLoading) {
        return new Promise((resolve) => {
          const checkData = () => {
            if (this.isLoaded) {
              resolve(this.data)
            } else {
              setTimeout(checkData, 100)
            }
          }
          checkData()
        })
      }

      // 开始加载数据
      this.isLoading = true
      try {
        this.data = await loadAllData()
        this.isLoaded = true
        return this.data
      } catch (error) {
        console.error('Failed to load game data:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
}) 
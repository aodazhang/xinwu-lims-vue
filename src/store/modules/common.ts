/**
 * @description 公共 store
 */
import { defineStore } from 'pinia'

export const commonStore = defineStore('common', {
  state: () => ({
    /** 公共资源数据 */
    resource: {
      // 是否（硬编码）
      is: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    }
  }),

  actions: {}
})

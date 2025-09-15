/**
 * @description 用户 store
 */
import { defineStore } from 'pinia'
import router from '@/router'
import { isArray, isObject, isString } from '@/utils/is'
import { storageGet, storageRemoveAll, storageSet } from '@/utils/storage'
import api from '@/api'
import { commonStore } from './common'

export const userStore = defineStore('user', {
  state: () => ({
    token: storageGet('token') || null,
    user: {} as SystemUser,
    role: {} as SystemRole
  }),

  actions: {
    async login(username: string, password: string) {
      const { token } = await api.loadLogin({ username, password })
      this.token = isString(token) ? token : null
      storageSet('token', this.token)
    },

    async info() {
      const user = await api.loadCurrentUser()
      this.user = isObject(user) ? user : ({} as SystemUser)
      this.role = isArray(this.user.roles)
        ? this.user.roles[0]
        : ({} as SystemRole)
    },

    signout() {
      storageRemoveAll([])
      commonStore().$reset()
      this.$reset()
      router.replace({ path: '/login' })
    }
  }
})

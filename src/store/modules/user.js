import { defineStore } from 'pinia'
import store from '../pinia'

import Avatar from '@/assets/img_avatar.gif'

const defaultAvatar = Avatar

const useUserStore = defineStore('user-info', {
  state: () => {
    return {
      userId: 0,
      roleId: 0,
      token: '',
      userName: '',
      nickName: '',
      avatar: defaultAvatar,
    }
  },
  actions: {
    saveUser(userInfo) {
      return new Promise((resolve) => {
        this.userId = userInfo.userId
        this.roleId = userInfo.roleId
        this.token = userInfo.token
        this.userName = userInfo.userName
        this.nickName = userInfo.nickName
        this.avatar = userInfo.avatar || defaultAvatar
        resolve(userInfo)
      })
    },
    isTokenExpire() {
      return !this.token
    },
    changeNickName(newNickName) {
      this.nickName = newNickName
    },
    logout() {
      return new Promise((resolve) => {
        this.$reset()
        localStorage.clear()
        sessionStorage.clear()
        resolve()
      })
    },
  },
  presist: {
    enable: true,
    resetToState: true,
    option: {
      exclude: ['userName'],
    },
  },
})

export default useUserStore

export function useUserStoreContext() {
  return useUserStore(store)
}

import { defineStore } from 'pinia'

import defaultSetting from '@/setting'

import { useChangeMenuWidth } from '@/hooks/useMenuWidth'
import usePrimaryColor from '@/hooks/usePrimaryColor'
import useTheme from '@/hooks/useTheme'

const useAppConfigStore = defineStore('app-config', {
  state: () => {
    return defaultSetting
  },
  getters: {
    getLayoutMode(state) {
      return state.layoutMode
    },
  },
  actions: {
    changeTheme(theme) {
      this.theme = theme
      useTheme(theme)
    },
    changeLayoutMode(mode) {
      this.layoutMode = mode
    },
    changeDevice(deviceType) {
      this.deviceType = deviceType
    },
    changeSideBarTheme(sideTheme) {
      this.sideTheme = sideTheme
    },
    changePageAnim(pageAnim) {
      this.pageAnim = pageAnim
    },
    changePrimaryColor(color) {
      this.themeColor = color
      usePrimaryColor(color)
    },
    changeSideWidth(sideWidth) {
      this.sideWidth = sideWidth
      useChangeMenuWidth(sideWidth)
    },
    toggleCollapse(isCollapse) {
      this.isCollapse = isCollapse
    },
  },
  presist: {
    enable: true,
    resetToState: true,
  },
})

export default useAppConfigStore

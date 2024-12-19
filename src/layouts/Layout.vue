<template>
  <div
    class="vaw-layout-container"
    :class="[appStore.deviceType === 'mobile' && 'is-mobile', appStore.theme]"
  >
      <SideBar />
      <MainLayout />
    <div
      v-if="appStore.deviceType === 'mobile'"
      class="mobile-shadow"
      :class="[appStore.isCollapse ? 'close-shadow' : 'show-shadow']"
      @click="closeMenu"
    ></div>
  </div>
  <SearchContent ref="searchContentRef" />
</template>

<script lang="ts" setup>
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import useEmit from '@/hooks/useEmit'
  import useAppConfigStore from '@/store/modules/app-config'
  import { useChangeMenuWidth } from '@/hooks/useMenuWidth'
  import usePrimaryColor from '@/hooks/usePrimaryColor'
  import useTheme from '@/hooks/useTheme'
  import { DeviceType } from '@/store/types'
  const searchContentRef = ref()
  const appStore = useAppConfigStore()
  useTheme(appStore.theme as 'light' | 'dark')
  useChangeMenuWidth(appStore.sideWidth)
  usePrimaryColor(appStore.themeColor)
  const emitter = useEmit()
  emitter?.on('show-search', () => {
    searchContentRef.value?.show()
  })
  onMounted(() => {
    handleScreenResize()
    window.addEventListener('resize', handleScreenResize)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleScreenResize)
  })
  function handleScreenResize() {
    const width = document.body.clientWidth
    if (width <= 768) {
      appStore.changeDevice(DeviceType.MOBILE)
      appStore.toggleCollapse(true)
    } else if (width < 992 && width > 768) {
      appStore.changeDevice(DeviceType.PAD)
      appStore.toggleCollapse(true)
    } else if (width < 1200 && width >= 992) {
      appStore.changeDevice(DeviceType.PC)
      appStore.toggleCollapse(false)
    } else {
      appStore.changeDevice(DeviceType.PC)
      appStore.toggleCollapse(false)
    }
  }
  function closeMenu() {
    appStore.toggleCollapse(true)
  }
</script>

<style lang="less">
  .vaw-layout-container {
    height: 100%;
    max-width: 100%;
    position: relative;
    overflow-x: hidden;
    .mobile-shadow {
      display: none;
    }
    .layout-mode-ttb {
      margin-top: @logoHeight;
      transition: all @transitionTime;
    }
  }
  .is-mobile {
    .mobile-shadow {
      background-color: #000000;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 997;
    }
    .close-shadow {
      display: none;
    }
    .show-shadow {
      display: block;
      opacity: 0.5;
      transition: all @transitionTime;
    }
  }
</style>

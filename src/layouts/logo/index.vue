<template>
  <div class="logo-wrapper" :style="{ 'background-color': bgColor }">
    <img v-if="showLogo" class="logo-img" src="../../assets/img_avatar.gif" />
    <div
      v-if="!appStore.isCollapse"
      :class="[!appStore.isCollapse || alwaysShow ? 'show-title' : 'close-title']"
    >
      <span class="logo-title">{{ projectName }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { projectName } from '../../setting'
  import useAppConfigStore from '@/store/modules/app-config'
  import { SideTheme, ThemeMode } from '@/store/types'
  defineProps({
    showLogo: { type: Boolean, default: true },
    alwaysShow: { type: Boolean, default: true },
  });
  const appStore = useAppConfigStore()
  const bgColor = computed(() => {
    if (appStore.layoutMode !== 'ttb') {
      if (appStore.sideTheme === SideTheme.DARK) {
        return 'var(--color-menu-dark-bg)'
      }
      if (appStore.sideTheme === SideTheme.WHITE) {
        return appStore.sideTheme === SideTheme.WHITE
          ? 'var(--color-white)'
          : appStore.sideTheme === SideTheme.DARK
          ? 'var(--color-menu-dark-bg)'
          : 'transparent'
      }
      return 'var(--color-white)'
    } else {
      return appStore.theme === ThemeMode.DARK
        ? 'var(--color-menu-dark-bg)'
        : 'var(--color-white)'
    }
  })
</script>
<style lang="less" scoped>
  .logo-wrapper {
    height: @logoHeight;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--color-text-1);
    border-bottom: 1px dashed var(--color-border);
    .logo-img {
      width: 30px;
      border-radius: 50%;
    }
    .logo-title {
      font-weight: bold;
    }
    .show-title {
      transform: scale(1);
      width: auto;
      transition: transform 0.2s ease-in;
    }
    .close-title {
      transform: scale(0);
      width: 0;
    }
  }
</style>

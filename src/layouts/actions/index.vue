<template>
  <div class="action-items-wrapper">
    <span v-if="appStore.actionBar.isShowSearch" class="action-item" @click="onShowSearch">
      <SearchIcon />
    </span>
    <a-popover position="bottom" trigger="click" :width="300">
      <a-badge v-if="appStore.actionBar.isShowMessage" :count="badgeValue" class="action-item">
        <NotificationsIcon />
      </a-badge>
      <template #content>
        adsfadsf
        <MessageContent />
      </template>
    </a-popover>
    <span
      v-if="appStore.actionBar.isShowFullScreen && appStore.deviceType !== 'mobile'"
      class="action-item"
      @click="onScreenFull"
    >
      <ExpandIcon />
    </span>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { Message } from '@arco-design/web-vue'
  import {
    IconSearch as SearchIcon,
    IconFullscreen as ExpandIcon,
    IconNotification as NotificationsIcon,
  } from '@arco-design/web-vue/es/icon'
  import { useFullscreen } from '@vueuse/core'
  import useEmit from '@/hooks/useEmit'
  import useAppConfigStore from '@/store/modules/app-config'
  const showSearchContent = ref(false)
  const searchContent = ref('')
  const badgeValue = ref(2)
  const appStore = useAppConfigStore()
  const emitter = useEmit()
  function onShowSearch() {
    emitter?.emit('show-search')
  }
  const { isSupported, enter, isFullscreen, exit } = useFullscreen(document.documentElement);

  function onScreenFull() {
    if (!isSupported) {
      Message.error('当前浏览器不支持全屏操作')
      return false
    }
    if (isFullscreen.value) {
      exit()
    } else {
      enter()
    }
  }
</script>

<style lang="less" scoped>
  .action-items-wrapper {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    z-index: 1;
    .action-item {
      min-width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      height: 100%;
      &:hover {
        cursor: pointer;
        background-color: var(--color-secondary-hover);
      }
      :deep(.arco-badge-number, .arco-badge-dot, .arco-badge-text, .arco-badge-custom-dot) {
        transform: translate(10%, 20%);
      }
    }
  }
</style>

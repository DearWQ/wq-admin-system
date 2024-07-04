<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="appStore.pageAnim + '-transform'" mode="out-in" appear>
      <keep-alive :include="cacheRoutes.cachedRoutes">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
  import useAppConfigStore from '@/store/modules/app-config'
  import useCachedRouteStore from '@/store/modules/cached-routes'
  const appStore = useAppConfigStore()
  const cacheRoutes = useCachedRouteStore()
</script>

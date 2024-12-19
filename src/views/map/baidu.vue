<template>
  <div ref="container" :style="{ height: height + 'px', width: '100%' }"></div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useScriptTag } from '@vueuse/core'

  const SCRIPT_URL =
    'https://api.map.baidu.com/api?v=1.0&ak=LPue6xfrcrqLi1z7Fpz1uFMRL0ZT2CUj&callback=initialize' +
    new Date().getTime()
    const container = ref<HTMLDivElement | null>(null)
    const height = ref(0)
    onMounted(async () => {
      const { load } = useScriptTag(SCRIPT_URL, () => {}, {
        manual: true,
      })
      await load()
      height.value = container.value?.parentElement?.getBoundingClientRect().height || 0
      const bMap = (window as any).BMap
      const map = new bMap.Map(container.value)
      const point = new bMap.Point(116.404, 39.915)
      map.centerAndZoom(point, 7)
      map.enableScrollWheelZoom()
      map.setMapStyleV2({ styleId: 'ea4652613f3629247d47666706ce7e89' })
    })
</script>

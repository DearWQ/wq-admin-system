<template>
  <a-breadcrumb>
    <a-breadcrumb-item v-for="item of breadcrumbs" :key="item.key">
      {{ item.label }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup>
  import { onMounted, reactive, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const breadcrumbs = reactive([])
  const route = useRoute()
  const router = useRouter()
  function generatorBreadcrumb() {
    breadcrumbs.length = 0
    const matchedPath = route.matched.map((it) => {
      return {
        label: (it.meta ? it.meta.title || '' : '') ,
        key: it.path,
      }
    })
    breadcrumbs.push(...matchedPath)
  }
  function handleSelect(key) {
    router.push(key)
  }
  onMounted(() => {
    generatorBreadcrumb()
  })
  watch(
    () => route.path,
    () => {
      if (
        route.path.startsWith('/redirect') ||
        ['/login', '/404', '/405', '/403'].includes(route.path)
      )
        return
      generatorBreadcrumb()
    }
  )
</script>

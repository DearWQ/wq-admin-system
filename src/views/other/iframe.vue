<template>
  <iframe
    ref="frame"
    src="https://www.yilailu.com/"
    width="100%"
    :height="height + 'px'"
    frameborder="0"
  ></iframe>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'

  const frame = ref<HTMLIFrameElement>()
  const height = ref(0)
  onMounted(() => {
    height.value = frame.value!.parentElement!.clientHeight
  })
</script>

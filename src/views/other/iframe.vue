<template>
  <iframe
    ref="frame"
    src="https://www.yilailu.com/"
    width="100%"
    :height="height + 'px'"
  ></iframe>
</template>

<script  setup>
  import { onMounted, ref } from 'vue'

  const frame = ref()
  const height = ref(0)
  onMounted(() => {
    height.value = frame.value?.parentElement?.clientHeight
  })
</script>

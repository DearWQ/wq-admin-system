<template>
  <a-card title="test">
    <a-input v-model="content" placeholder="请输入信息" />
  </a-card>
</template>

<script setup>
  import { ref } from 'vue'
  const content = ref('井底的蜗牛')
</script>

<template>
  <a-card class="footer-container card-border-radius" :bordered="false">
    Copyright © {{ projectName }} 2022
  </a-card>
</template>

<script setup>
  import { projectName } from '@/setting'
</script>

<style lang="less" scoped>
  .footer-container {
    height: @footerHeight;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border-top: 1px dashed var(--color-border);
  }
</style>

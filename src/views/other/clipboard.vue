<template>
  <a-card title="请输入" :content-style="{ padding: '10px' }">
    <a-input
      :style="{ width: '50%' }"
      v-model="content"
      placeholder="请输入"
    >
      <template #append>
        <a-button type="primary" @click="onCopy">复制</a-button>
      </template>
    </a-input>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useClipboard } from '@vueuse/core'
  import { Message } from '@arco-design/web-vue'
  const content = ref('')
  const { copy, isSupported, text } = useClipboard({ source: content })
  const onCopy = () => {
    if (!content.value) return;
    copy(content.value).then(() => {
      Message.success('复制成功，内容为：' + text.value)
    })
  }
  if (!isSupported) {
    Message.error('当前浏览器不支持此功能')
  }
</script>

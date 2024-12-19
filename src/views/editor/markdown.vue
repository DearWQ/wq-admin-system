<template>
  <div class="main-container">
    <a-card
        title="markdown编辑器"
        :content-style="{ padding: '10px' }"
        :header-style="{ padding: '5px' }"
    >
      <a-link href="https://imzbf.github.io/md-editor-v3/en-US/index" :hoverable="false">md-editor-v3markdown编辑器</a-link>
    </a-card>
    <a-card title="文章内容" :body-style="{ padding: '10px' }" class="mt-4">
      <template #extra>
        <div class="flex">
          <a-space justify="end">
            <a-button type="primary" size="small" @click="getHtmlContent">获取HTML</a-button>
          </a-space>
        </div>
      </template>
      <MarkdownEditor ref="markdownEditor" :height="400" />
    </a-card>
    <div style="background: #fff" v-if="htmlContent" class="p-4 mt-4"> {{htmlContent}}</div>
  </div>
</template>

<script lang="ts" setup>
import MarkdownEditor from "@/components/Editor/MarkdownEditor/MarkdownEditor.vue";
import { ref } from 'vue'

const title = ref('')
const htmlContent = ref('')
const markdownEditor = ref()
const  getHtmlContent=async ()=> {
  htmlContent.value = await markdownEditor.value.getMarkDownHtml()
}
</script>
<style lang="less" scoped>
.main-container {

}
</style>

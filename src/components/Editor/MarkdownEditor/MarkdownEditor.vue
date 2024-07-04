<template>
  <MdEditor ref="markdownEditorRef" v-model="content" @onSave="handleSave"/>
</template>

<script lang="ts" setup>
import {MdEditor} from "md-editor-v3";
import 'md-editor-v3/lib/style.css';
import {onMounted, ref} from "vue";

const content = ref("")
const markDownHtml = ref("")
const handleSave = (v, h) => {
  h.then((html) => {
    markDownHtml.value = html
  });
}
const markdownEditorRef = ref()
const getMarkDownHtml = async () => {
  await markdownEditorRef.value?.triggerSave()
  return markDownHtml.value
}



onMounted(async ()=>{
  const response = await fetch('./src/components/Editor/MarkdownEditor/markdown.md');
  if (response.ok) {
    content.value = await response.text();
  }
})
defineExpose({
  getMarkDownHtml
})
// 引入
</script>

<style lang="less" scoped></style>

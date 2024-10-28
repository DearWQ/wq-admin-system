<template>
  <div class="main-container">
    <a-card title="打印图片" :header-style="{ padding: '5px' }" :content-style="{ padding: '0px' }">
      <template #extra>
        <a-button type="primary" size="small" @click="printImage">打印</a-button>
      </template>
      <div class="image-wrapper">
        <img alt="" :src="imagePath" />
      </div>
    </a-card>
    <a-card
      title="打印HTML"
      :header-style="{ padding: '5px' }"
      :content-style="{ padding: '0px' }"
      class="mt-4"
    >
      <template #extra>
        <a-button type="primary" size="small" @click="printHtml">打印</a-button>
      </template>
      <div id="htmlTable">
        <a-table :data="dataList" :columns="columns" :pagination="false"> </a-table>
      </div>
    </a-card>
  </div>
</template>

<script setup>
  import printJS from 'print-js'
  import imagePath from '@/assets/img_avatar.gif'
  function printImage() {
    printJS({
      printable: imagePath,
      type: 'image',
      showModal: false,
    })
  }
  function printHtml() {
    printJS({
      printable: 'htmlTable',
      type: 'html',
      targetStyles: ['*'],
    })
  }
  const dataList = [
    {
      name: '前端',
      skill: '精通',
      employment: '5年+',
    },
    {
      name: '后端',
      skill: '精通',
      employment: '3年+',
    },
    {
      name: '跨度',
      skill: '精通',
      employment: '6年+',
    },
  ];
  const columns = [
    {
      title: '技术',
      dataIndex: 'name',
    },
    {
      title: '掌握程度',
      dataIndex: 'skill',
    },
    {
      title: '使用年限',
      dataIndex: 'employment',
    },
  ];
</script>

<style lang="less" scoped>
  .image-wrapper {
    width: 30%;
    margin: 0 auto;
    & > img {
      width: 100%;
    }
  }
  .html-wrapper {
    width: 80%;
    margin: 0 auto;
    & > h1 {
      color: red;
    }
  }
</style>

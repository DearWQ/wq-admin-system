<script setup lang="ts">

import MySign from "@/components/MySign/MySign.vue";
import {ref} from "vue";


const noCropRef=ref<HTMLElement>()
const noCropImg=ref(null)
const createNoCropImage=()=>{
  noCropRef.value.handleConfirm()
}
const clearNoCropImage=()=>{
  noCropRef.value.resetDraw()
}
const handleNoCropImg = (fileImg: any) => {
  noCropImg.value=fileImg
}

const cropRef=ref<HTMLElement>()
const cropImg=ref(null)
const createCropImage=()=>{
  cropRef.value.handleConfirm()
}
const handleCropImg = (fileImg: any) => {
  cropImg.value=fileImg
}
const clearCropImage=()=>{
  cropRef.value.resetDraw()
}

</script>

<template>
  <a-card title="canvas绘制签名">
    <a-row :gutter="[10, 10]" class="mt-4">
      <a-col :span="12">
        <a-card title="绘制签名不裁剪" :header-style="{ padding: '5px' }" :body-style="{ padding: 0 }">
          <template #extra>
            <a-space>
            <a-button type="primary" size="small" @click="createNoCropImage">生成图片</a-button>
            <a-button  size="small" @click="clearNoCropImage">清空</a-button>
            </a-space>
          </template>
          <div class="text-center flex justify-center">
            <my-sign key="noCropRef" :isCrop="false" ref="noCropRef" @handleConfirm="handleNoCropImg"></my-sign>
          </div>
        </a-card>
      </a-col>
      <a-col :span="12" >
        <a-card title="完成后图片">
          <div class="text-center">
            <img :src="noCropImg?.img" class="img" alt=""/>
          </div>
        </a-card>
      </a-col>
      <a-col :span="24" >
        <a-card title="图片路径">
          <div class="imgData">
            {{cropImg?.img}}
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="[10, 10]" class="mt-4">
      <a-col :span="12">
        <a-card title="绘制签名裁剪" :header-style="{ padding: '5px' }" :body-style="{ padding: 0 }">
          <template #extra>
            <a-space>
              <a-button type="primary" size="small" @click="createCropImage">生成图片</a-button>
              <a-button  size="small" @click="clearCropImage">清空</a-button>
            </a-space>

          </template>
          <div class="text-center flex justify-center">
            <my-sign key="cropRef" ref="cropRef" :isCrop="true" @handleConfirm="handleCropImg"></my-sign>
          </div>
        </a-card>
      </a-col>
      <a-col :span="12" >
        <a-card title="完成后图片">
          <div class="text-center">
            <img :src="cropImg?.img"  class="img"  alt=""/>
          </div>
        </a-card>
      </a-col>
      <a-col :span="24" >
        <a-card title="图片路径">
          <div class="imgData">
            {{cropImg?.img}}
          </div>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<style scoped>


.img{
  width: 100%;
  height: 360px;
}
.imgData{
  width: 100%;
  word-wrap: break-word; /* 或使用 overflow-wrap */
  overflow-wrap: break-word;
}
</style>
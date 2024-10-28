<script  setup>

import useWaterMark from "@/hooks/useWaterMark";
import {onMounted, ref} from "vue";

const loading = ref(false)
const imgSrc=ref('')
const imgSource=ref('https://www.yilailu.com/static/icon/1.gif')
const waterTitle=ref('图片水印')
const fontSizeColor=ref()
const fontSize=ref('16px')
const fontTypeList=ref([])
const fontType=ref('')
const rotateNum=ref(-25)
const fileObj=ref()
const handleAddWaterMark = async () => {
  loading.value = true
  const res = await useWaterMark(imgSource.value, {
    text: waterTitle.value,
    rotate:rotateNum.value,
    font:`${fontSize.value} ${fontType.value||'microsoft yahei'}`,
    fillStyle:fontSizeColor.value
  })
  fileObj.value=res
  imgSrc.value=res.src
  loading.value = false
}

onMounted(async ()=>{
  fontTypeList.value=await listAvailableFonts()
})
function uniqueObjectsDeep(arr) {
  const uniqueSet = new Set(arr.map(item => JSON.stringify(item)));
  return Array.from(uniqueSet).map(item => JSON.parse(item));
}
//获取系统的字体
const listAvailableFonts = async () => {
  if ("queryLocalFonts" in window) {
    try {
      const availableFonts = await (window).queryLocalFonts();
      if (!availableFonts.length) {
        return [];
      }
      const fontList = availableFonts.map((font) => {
        return {
          value: font.family,
          label: font.family,
        };
      })

      return uniqueObjectsDeep(fontList);
    } catch (err) {
      return Promise.reject(err);
    }
  } else {
    return Promise.reject("浏览器版本太低 or 网站不安全");
  }
};


</script>

<template>
  <a-card title="图片水印">
    <template #extra>
      <a-space>
        <a-button :loading="loading" type="primary" @click="handleAddWaterMark">添加</a-button>
      </a-space>
    </template>
    <div class="flex" style="height: 300px;width: 100%">
      <div class="flex justify-center" style="width: 50%"><img alt="" :src="imgSource"></div>
      <div class="flex justify-center" style="width: 50%"><img alt="" :src="imgSrc"></div>
    </div>
    <div style="margin-top: 16px">
      <div style="margin-bottom: 16px">设置配置</div>
      <div style="margin-bottom: 16px">
        <a-input v-model="imgSource" placeholder="图片源路径" />
      </div>
      <div style="margin-bottom: 16px">
        <a-input v-model="waterTitle" placeholder="图片水印" />
      </div>
      <div style="margin-bottom: 16px">
        <a-input v-model="rotateNum" placeholder="旋转角度" />
      </div>
      <div class="flex -align-center" style="margin-bottom: 16px">
        <a-color-picker v-model="fontSizeColor" defaultValue="#0000004C" showText disabledAlpha/>
        <a-select :style="{width:'320px',marginLeft:'16px'}" v-model="fontSize" placeholder="请选择字体大小">
          <template v-for="(item,index) in 30">
            <a-option v-if="item>11" :key="index" :value="item+'px'">{{item+'px'}}</a-option>
          </template>
        </a-select>
        <a-select :style="{width:'320px',marginLeft:'16px'}" v-model="fontType" :options="fontTypeList" placeholder="字体类型" :virtual-list-props="{height:200}" />
      </div>
    </div>
  </a-card>
</template>

<style lang="less" scoped>

</style>
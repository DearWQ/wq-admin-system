<template>
  <a-card title="图片裁剪" segmented>
    <div class="text-center">
      <img alt="" :src="ImagePath" class="test-img" />
      <a-button type="primary" size="small" @click="onCropper">裁剪图片</a-button>
    </div>
    <a-modal v-model:visible="showModal" title="图片裁剪" @ok="showModal = false">
      <div class="flex text-center justify-between">
        <div class="w-2/3">
          <img alt="" id="cropperImg" :src="ImagePath" class="cropper-img" />
        </div>
        <div class="w-1/3 flex flex-col justify-between items-center">
          <div> <img alt="" style="width: 100px; height: 100px" :src="cropperImagePath" /> 100 * 100 </div>
          <div> <img alt="" style="width: 50px; height: 50px" :src="cropperImagePath" /> 50 * 50 </div>
        </div>
      </div>
    </a-modal>
  </a-card>
</template>

<script  setup>
  import Cropper from 'cropperjs'
  import 'cropperjs/dist/cropper.css'
  import ImagePath from '@/assets/img_avatar.gif'
  import { nextTick, ref } from 'vue'
  const showModal = ref(false)
  const cropperImagePath = ref('')


  function onCropper() {
    showModal.value = true
    nextTick(() => {
      const image = document.getElementById('cropperImg')
      const cropper = new Cropper(image, {
        autoCrop: false,
        viewMode: 1,
        dragMode: 'none',
        initialAspectRatio: 1,
        aspectRatio: 1,
        preview: '.before',
        background: false,
        autoCropArea: 0.6,
        zoomOnWheel: false,
        ready() {
          cropper.crop()
        },
        crop() {
          cropperImagePath.value = cropper.getCroppedCanvas().toDataURL()
        },
      })
    })
  }
</script>

<style lang="less" scoped>
  .test-img {
    width: 200px;
    height: 200px;
    display: block;
    max-width: 100%;
    margin: 0 auto;
    border: 1px solid #f5f5f5;
    object-fit: cover;
    margin-bottom: 20px;
  }
  .cropper-img {
    display: block;
    max-width: 100%;
  }
</style>

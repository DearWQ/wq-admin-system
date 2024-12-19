<template>
  <div class="exception-container">
    <div class="img-wrapper">
      <img width="750" height="350" :src="statusImage" />
    </div>
    <div class="title">
      <div>{{ statusTip }}</div>
      <div class="margin-top-lg">
        <a-button type="primary" size="small" @click="backHome"> 返回首页 </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import image404 from '@/assets/img_404.png'
  import image403 from '@/assets/img_403.png'
  import image500 from '@/assets/img_500.png'
  import {useRouter} from 'vue-router';
  import {computed} from 'vue';
  const router = useRouter();
  const props = defineProps({
    status: {
      type: [Number, String],
      default: '404',
    }
  })
  function backHome () {
    router.replace({ path: '/' });
  }
   // 计算属性
  let statusImage = computed(()=>{
    if (props.status.toString() === '404') {
          return image404
        } else if (props.status.toString() === '403') {
          return image403
        } else {
          return image500
        }
  });
  let statusTip = computed(()=>{
    if (props.status.toString() === '404') {
      return '您访问的页面不存在'
    } else if (props.status.toString() === '403') {
      return '您没有权限访问该页面'
    } else {
      return '您访问的页面出错啦'
    }
    
  });
</script>

<style lang="less" scoped>
  .exception-container {
    text-align: center;
    height: 100%;
    .img-wrapper {
      margin: 0 auto;
    }
    .title {
      margin-top: 50px;
    }
  }
</style>

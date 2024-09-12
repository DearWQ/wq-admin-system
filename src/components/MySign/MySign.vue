<script setup lang="ts">
import {computed, onMounted, ref} from "vue";

const props = defineProps({
  //线宽
  lineWidth: {
    type: Number,
    default: 8
  },
  //线的颜色
  lineColor: {
    type: String,
    default: '#000000'
  },
  //背景颜色
  bgColor: {
    type: String,
    default: 'transparent'
  },
  //是否裁剪 在画布设定尺寸基础上裁掉四周空白部分
  isCrop: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['handleConfirm', 'update:bgColor'])


const isDrawing = ref(false)
const hasDrew = ref(false)


onMounted(() => {
  //初始化创建画板
  createCanvas()
})
const canvas = ref<HTMLCanvasElement>()
const myBrush = ref<HTMLElement>()
const startX = ref(0)
const startY = ref(0)
const sratio = ref(0)
const canvasTxt = ref({})
const points = ref([])


const myBgColor = computed(() => {
  return props.bgColor ? props.bgColor : 'transparent';
})
//canvas 清晰度问题：https://mp.weixin.qq.com/s/hBWSLSmJsJfE2zbtnUL_yQ
const createCanvas = () => {
  canvas.value.height = myBrush.value.offsetHeight;
  canvas.value.width = myBrush.value.offsetWidth;
  canvas.value.style.background = 'transparent'
  const realW = parseFloat(getComputedStyle(canvas.value).width)
  sratio.value = realW / myBrush.value.offsetWidth * window.devicePixelRatio
  canvasTxt.value = canvas.value.getContext('2d', {willReadFrequently: true})
  canvasTxt.value.scale(sratio.value, sratio.value)
  canvasTxt.value.scale(1 / sratio.value, 1 / sratio.value)
}


const drawStart = (position) => {
  startX.value = position.x
  startY.value = position.y
  canvasTxt.value.beginPath()
  canvasTxt.value.moveTo(startX.value, startY.value)
  canvasTxt.value.lineTo(position.x, position.y)
  canvasTxt.value.lineCap = 'round'
  canvasTxt.value.lineJoin = 'round'
  canvasTxt.value.lineWidth =isMobile()?2*sratio.value:(props.lineWidth * sratio.value)
  canvasTxt.value.stroke()
  canvasTxt.value.closePath()
  points.value.push(position)
}

const mouseDown = (e) => {
  e.preventDefault()
  isDrawing.value = true
  hasDrew.value = true
  let x=e.offsetX,y=e.offsetY;
  if(e.touches&&e.touches[0]){
    const touch = e.touches[0];
    // 获取触点相对于触发事件元素的位置
    const rect = e.target.getBoundingClientRect();
    x = touch.clientX - rect.left;
    y = touch.clientY - rect.top;
  }
  drawStart({x, y})
}
const mouseMove = (e) => {
  e.preventDefault()
  if (isDrawing.value) {
    let x=e.offsetX,y=e.offsetY;

    if(e.touches&&e.touches[0]){
      const touch = e.touches[0];
      // 获取触点相对于触发事件元素的位置
      const rect = e.target.getBoundingClientRect();
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    }
    drawMove({x, y})
  }
}

const mouseUp = (e) => {
  e.preventDefault()
  let x=e.offsetX,y=e.offsetY;
  if(e.changedTouches&&e.changedTouches[0]){
    const touch = e.changedTouches[0];
    // 获取触点相对于触发事件元素的位置
    const rect = e.target.getBoundingClientRect();
    x = touch.clientX - rect.left;
    y = touch.clientY - rect.top;
  }
  drawEnd({x, y})
  isDrawing.value = false
}
const drawMove = (position) => {
  canvasTxt.value.beginPath()
  canvasTxt.value.moveTo(startX.value, startY.value)
  canvasTxt.value.lineTo(position.x, position.y)
  canvasTxt.value.strokeStyle = props.lineColor
  canvasTxt.value.lineWidth = isMobile()?2*sratio.value:(props.lineWidth * sratio.value)
  canvasTxt.value.lineCap = 'round'
  canvasTxt.value.lineJoin = 'round'
  canvasTxt.value.stroke()
  canvasTxt.value.closePath()
  startY.value = position.y
  startX.value = position.x
  points.value.push(position)
}
const drawEnd = (position) => {
  canvasTxt.value.beginPath()
  canvasTxt.value.moveTo(startX.value, startY.value)
  canvasTxt.value.lineTo(position.x, position.y)
  canvasTxt.value.lineCap = 'round'
  canvasTxt.value.lineJoin = 'round'
  canvasTxt.value.stroke()
  canvasTxt.value.closePath()
  points.value.push(position)
  points.value.push({x: -1, y: -1})
}
const resetDraw = () => {
  canvasTxt.value.clearRect(
      0,
      0,
      canvas.value.width,
      canvas.value.height
  )
  emit('update:bgColor', 'transparent')
  canvas.value.style.background = 'transparent'
  points.value = []
  hasDrew.value = false
}


const fileInfo = ref({})
const canvasConversion = async () => {
  if (!hasDrew.value) {
    return
  }
  canvasTxt.value.globalCompositeOperation = "destination-over"
  canvasTxt.value.fillStyle = 'transparent'
  canvasTxt.value.fillRect(0, 0, canvas.value.width, canvas.value.height)
  let resImgData = canvasTxt.value.getImageData(0, 0, canvas.value.width, canvas.value.height)
  fileInfo.value.img = canvas.value.toDataURL('image/png')
  fileInfo.value.file = dataURLtoFile(canvas.value.toDataURL('image/png'), 'signature.png')
  canvasTxt.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  canvasTxt.value.putImageData(resImgData, 0, 0)
  canvasTxt.value.globalCompositeOperation = "source-over"
  //是否裁去空白部分
  if (props.isCrop) {
    const crop_area = getCropArea(resImgData.data)
    let crop_canvas = document.createElement('canvas')
    const crop_ctx = crop_canvas.getContext('2d', {willReadFrequently: true})
    crop_canvas.width = crop_area[2] - crop_area[0]
    crop_canvas.height = crop_area[3] - crop_area[1]
    const crop_imgData = canvasTxt.value.getImageData(...crop_area)
    crop_ctx.globalCompositeOperation = "destination-over"
    crop_ctx.putImageData(crop_imgData, 0, 0)
    crop_ctx.fillStyle = 'transparent'
    crop_ctx.fillRect(0, 0, crop_canvas.width, crop_canvas.height)
    fileInfo.value.img = crop_canvas.toDataURL()

    fileInfo.value.file = dataURLtoFile(crop_canvas.toDataURL('image/png'), 'signature.png')
    crop_canvas = null
    emit('handleConfirm', {...fileInfo.value})
  } else {
    emit('handleConfirm', {...fileInfo.value})
  }

}
const getCropArea = (imgData) => {
  let topX = canvas.value.width;
  let btmX = 0;
  let topY = canvas.value.height;
  let btnY = 0
  for (let i = 0; i < canvas.value.width; i++) {
    for (let j = 0; j < canvas.value.height; j++) {
      let pos = (i + canvas.value.width * j) * 4
      if (imgData[pos] > 0 || imgData[pos + 1] > 0 || imgData[pos + 2] || imgData[pos + 3] > 0) {
        btnY = Math.max(j, btnY)
        btmX = Math.max(i, btmX)
        topY = Math.min(j, topY)
        topX = Math.min(i, topX)
      }
    }
  }
  topX++
  btmX++
  topY++
  btnY++
  return [topX, topY, btmX, btnY]
}

const dataURLtoFile = (dataUrl, filename) => {//将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
  let arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type: mime});
}

const handleConfirm = async () => {
  await canvasConversion()
}
const isMobile=()=> {
  return navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
}

defineExpose({
  resetDraw,
  handleConfirm
})
</script>

<template>
  <!--签名-->
  <section ref="myBrush" class="myBrush">
    <canvas style="touch-action: none;" ref="canvas" @mousedown="mouseDown" @mousemove="mouseMove"
            @mouseup="mouseUp" @touchend="mouseUp" @touchmove="mouseMove" @touchstart="mouseDown"></canvas>
  </section>
</template>

<style scoped>
.myBrush {
  width: 100%;
  height: 400px;
}
</style>
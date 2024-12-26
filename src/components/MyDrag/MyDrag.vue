<script setup>
import {onMounted, ref} from 'vue'

const props = defineProps({
  // 侧边栏宽度
  width: {
    type: Number,
    default: 200
  },
  hasDrag: {
    type: Boolean,
    default: true
  },
})

const pageContainerRef = ref()
const dragRef = ref()
const rightRef = ref()
const leftRef = ref()
const dragControllerDiv = () => {

  // 鼠标按下事件
  dragRef.value.onmousedown = function (e) {
    //颜色改变提醒
    dragRef.value.style.background = '#c9cbcd'
    let startX = e.clientX
    dragRef.value.left = dragRef.value.offsetLeft
    // 鼠标拖动事件
    document.onmousemove = function (e) {
      const pageContainer_W = pageContainerRef.value.clientWidth
      let endX = e.clientX
      let moveLen = dragRef.value.left + (endX - startX) // （endX-startX）=移动的距离。dragRef.value.left+移动的距离=左边区域最后的宽度
      let maxT = pageContainer_W - dragRef.value.offsetWidth // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
      // 左边区域的最小宽度
      if (moveLen < props.width/5) {
        moveLen = props.width/5
      }
      //右边区域最小宽度为150px
      if (moveLen > maxT - props.width) {
        moveLen = maxT - props.width
      }

      dragRef.value.style.left = moveLen // 设置左侧区域的宽度
      leftRef.value.style.width = moveLen + 'px'
      rightRef.value.style.width = pageContainer_W - moveLen - 10 + 'px'
    }
    // 鼠标松开事件
    document.onmouseup = function (evt) {
      //颜色恢复
      dragRef.value.style.background = '#6B95AEA8'
      document.onmousemove = null
      document.onmouseup = null
      dragRef.value.releaseCapture && dragRef.value.releaseCapture() //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
    }
    dragRef.value.setCapture && dragRef.value.setCapture() //该函数在属于当前线程的指定窗口里设置鼠标捕获
  }
}

onMounted(() => {
  if (props.hasDrag) {
    dragControllerDiv()
  }

})

</script>

<template>
  <div  class="font-white flex w-100% h-100%  box-border relative z-100">
    <div  ref="pageContainerRef" class="pageContainer themeColor0 flex w-100% h-100%">
      <div ref="leftRef" :style="{'--w': props.width+'px'}" class="drag_left h-100% box-border">
        <slot name="left"></slot>
      </div>
      <div class="drag_line themeColor90 select-none">
        <div v-if="hasDrag" ref="dragRef" class="drag_resize" title="点击侧边栏拖拽">⋮</div>
        <div v-else class="w-1px"></div>
      </div>
      <div ref="rightRef" class="drag_right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>

/*左侧div样式*/
.drag_left{
  width: var(--w);
}
/*拖拽区div样式*/
.drag_resize {
  cursor: col-resize;
  float: left;
  position: relative;
  top: 45%;
  background-color: #6B95AEA8;
  border-radius: 5px;
  margin-top: -10px;
  width: 10px;
  height: 50px;
  background-size: cover;
  background-position: center;
  z-index: 9999;
  font-size: 32px;
  color: #131a20;
}

/*拖拽区鼠标悬停样式*/
.drag_resize:hover {
  color: #333333;
}

/*右侧div'样式*/
.drag_right {
  flex: 1;
}

:deep(.el-tree-node__content) {
  overflow: hidden;
}

</style>
<template>
  <!--提示-->
  <transition name="fade-in-linear">
    <div v-show="tooltipShow" :style="tooltipStyle" class="wq-tooltip"
    >
      <span class="wq-tooltip-text" v-text="text"></span>
      <div :class="[placements]" :style="arrowStyle" class="wq-tooltip-arrow"></div>
    </div>
  </transition>
</template>
<script>
import {computed, ref} from 'vue'

export default {
  setup() {

    // 显示弹框
    const tooltipShow = ref(false);

    // 提示内容
    const text = ref()

    // 方向
    const placements = ref('left')

    // 显示
    function showTip() {
      tooltipShow.value = true
    }

    //设置提示内容
    function setContent(content) {
      text.value = content
    }

    //隐藏
    function hiddenTip() {
      tooltipShow.value = false
    }

    // 位置
    const tooltipPosition = ref({
      x: 0,
      y: 0,
      width: 0,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    })
    const arrowPosition = ref({
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    })
    const tooltipStyle = computed(() => {
      return {
        transform: `translate3d(${tooltipPosition.value.x}px,${tooltipPosition.value.y}px,0)`,
        width: tooltipPosition.value.width ? `${tooltipPosition.value.width}px` : null,
        right: tooltipPosition.value.right ? `${tooltipPosition.value.right}px` : null,
        left: tooltipPosition.value.left ? `${tooltipPosition.value.left}px` : null,
        top: tooltipPosition.value.top ? `${tooltipPosition.value.top}px` : null,
      }
    })
    const arrowStyle = computed(() => {
      return {
        left: arrowPosition.value.left?`${arrowPosition.value.left}px` : null,
        top: arrowPosition.value.top?`${arrowPosition.value.top}px` : null,
        right: arrowPosition.value.right?`${arrowPosition.value.right}px` : null,
        bottom: arrowPosition.value.bottom?`${arrowPosition.value.bottom}px` : null,
      }
    })
    return {
      tooltipShow,
      showTip,
      hiddenTip,
      setContent,
      tooltipPosition,
      arrowPosition,
      tooltipStyle,
      arrowStyle,
      text,
      placements,
    }
  }
}
</script>

<style lang="less" scoped>
// tooltip
.wq-tooltip {
  padding: 10px;
  font-size: 12px;
  line-height: 1.2;
  min-width: 30px;
  max-width: fit-content;
  word-wrap: break-word;
  position: fixed;
  top: 0;
  background: #303133;
  color: #fff;
  z-index: 1000;
  display: block;
  border-radius: 8px;
  font-weight: 500;
  pointer-events: none;
}

// 小箭头
.wq-tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-width: 8px;
  border-style: solid;
}

// 如果在左侧
.wq-tooltip-arrow.left {
  border-color: transparent transparent transparent #303133;
  right: -15px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
}
.wq-tooltip-arrow.left-right {
  left: -15px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  border-color: transparent #303133 transparent transparent;
}

// 如果在下侧
.wq-tooltip-arrow.bottom {
  top: -15px;
  border-color: transparent transparent #303133 transparent;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
}

// 如果在右侧
.wq-tooltip-arrow.right {
  left: -15px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  border-color: transparent #303133 transparent transparent;
}
.wq-tooltip-arrow.right-left {
  border-color: transparent transparent transparent #303133;
  right: -15px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
}
// 如果在上侧
.wq-tooltip-arrow.top {
  bottom: -15px;
  border-color: #303133 transparent transparent transparent;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
}

/* 动画 */
.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transition: opacity .3s ease;
}

.tooltip-leave-from,
.tooltip-enter-to {
  transition: opacity .1s ease;
}
</style>

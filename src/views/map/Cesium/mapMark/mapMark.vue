<script  setup>

import {onMounted, reactive, ref} from "vue";
import {initCesium} from "@/views/map/Cesium/util/cesium";
import * as Cesium from "cesium";
import {Icon} from '@arco-design/web-vue';
import {DRAW_COLOR} from "@/utils/common";
import Draw from "@/views/map/Cesium/util/draw";

const IconFont = Icon.addFromIconFontCn({
  src: '//at.alicdn.com/t/c/font_4702050_8ze2tb2abia.js',
});

const cesiumContainer = ref(null)
let viewer;
onMounted(() => {
  viewer = initCesium(cesiumContainer.value)
  mapHandle()
})
const current = ref(1);
const scrollbar = ref(true);

const markEntityList=ref([])
const getMarkList = () => {
}

const drawInfo = ref([
  {
    iconType: 'icon-weizhi',
    drawType: 'point',
    onClick:'drawPoint',
    label: '绘制点',
    color: '#409EFF'
  },
  {
    iconType: 'icon-xian',
    drawType: 'line',
    onClick:'drawLine',
    label: '绘制线',
    color: '#409EFF'
  },
  {
    iconType: 'icon-mian',
    drawType: 'surface',
    onClick:'drawPlane',
    label: '绘制面',
    color: '#409EFF'
  },
  {
    iconType: 'icon-collection',
    drawType: 'cylinder',
    onClick:'drawRectangle',
    label: '绘制多面体',
    color: '#409EFF'
  },
  {
    iconType: 'icon-draw-circular',
    drawType: 'circle',
    onClick:'drawCircle',
    label: '绘制圆',
    color: '#409EFF'
  },
])
const curDrawType = ref()
const handleDraw = (drawType, onClick) => {
  if (curDrawType.value === drawType) {
    curDrawType.value = ''
  } else {
    curDrawType.value = drawType
  }
  startDraw(onClick)
}
let drawOperate;
const startDraw = (onClick) => {
  if (!curDrawType.value) {
    return
  }

  if(drawOperate){
    drawOperate.config={
      borderColor: chooseColor.value[curDrawType.value + 'Color'],
      borderWidth: 5,
      color: chooseColor.value[curDrawType.value + 'Color'],
      markName:"mark"+Cesium.createGuid(),
      material: chooseColor.value[curDrawType.value + 'Color'],
    }
  }else{
    drawOperate = new Draw(viewer,{
      borderColor: chooseColor.value[curDrawType.value + 'Color'],
      borderWidth: 5,
      color: chooseColor.value[curDrawType.value + 'Color'],
      markName:"mark"+Cesium.createGuid(),
      material: chooseColor.value[curDrawType.value + 'Color'],
    })
  }


  drawOperate[onClick]()
  // 设置回调函数
  drawOperate.onDrawComplete = (type, detail) => {
    console.log(`绘制完成：${type}`, detail);
    markEntityList.value.push(detail)
    curDrawType.value=''
  };
}

let handle;
const mapHandle=()=>{
  if(!handle){
    handle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  }
  handle.setInputAction((e)=> {
    removeMarkHighlight()
    const pickInfo=viewer.scene.pick(e.position)
    if(!pickInfo)return;
    if(pickInfo?.id?.markId){
      const markId=pickInfo?.id?.markId
      markEntityList.value.forEach(mark=>{
        if(mark.markId===markId){
          mark.showHighlight()
        }
      })
    }

  },Cesium.ScreenSpaceEventType.LEFT_CLICK)
  handle.setInputAction((e)=>{
    markEntityList.value.forEach(mark=>{
      mark.removeHover()
    })
    const pickInfo=viewer.scene.pick(e.startPosition)
    viewer.container.style.cursor='default';
    if(pickInfo?.id){
      viewer.container.style.cursor='pointer';
    }
    if(pickInfo?.id?.markId){
      const markId=pickInfo?.id?.markId
      markEntityList.value.forEach(mark=>{
        if(mark.markId===markId){
          mark.hover()
        }else{
          mark.removeHover()
        }
      })
    }

  },Cesium.ScreenSpaceEventType.MOUSE_MOVE)
}
const removeMarkHighlight=()=>{
  markEntityList.value.forEach(mark=>{
    mark.hasHighlight=false;
    mark.removeHighlight()
  })
}

//选择颜色
const chooseColor = ref({
  curColor: '#2D8CF0',
  pointColor: '#2D8CF0',
  lineColor: '#2D8CF0',
  surfaceColor: '#2D8CF0',
  cylinderColor: '#2D8CF0',
  circleColor: '#2D8CF0',
});
const changeCurrentColor = (color, drawType,onClick) => {
  chooseColor.value[drawType + 'Color'] = color

  if(drawOperate){
    drawOperate.config={
      borderColor: chooseColor.value[curDrawType.value + 'Color'],
      borderWidth: 5,
      color: chooseColor.value[curDrawType.value + 'Color'],
      markName:"mark"+Cesium.createGuid(),
      material: chooseColor.value[curDrawType.value + 'Color'],
    }
  }else{
    drawOperate = new Draw(viewer,{
      borderColor: chooseColor.value[curDrawType.value + 'Color'],
      borderWidth: 5,
      color: chooseColor.value[curDrawType.value + 'Color'],
      markName:"mark"+Cesium.createGuid(),
      material: chooseColor.value[curDrawType.value + 'Color'],
    })
  }

  drawOperate[onClick]()
  // 设置回调函数
  drawOperate.onDrawComplete = (type, detail) => {
    console.log(`绘制完成：${type}`, detail);
    curDrawType.value=''
  };
}
</script>

<template>
  <div class="mark-container">
    <div class="markList">
      <a-list :max-height="240" :scrollbar="scrollbar" @reach-bottom="getMarkList">
        <template #header>
          标注列表
        </template>
<!--        <template #scroll-loading>-->
<!--          <div v-if="markEntityList.length===0">暂无更多数据</div>-->
<!--          <a-spin v-else/>-->
<!--        </template>-->
        <a-list-item v-for="item in markEntityList">{{ item.markName }}</a-list-item>
      </a-list>
    </div>
    <div id="cesiumContainer" ref="cesiumContainer" class="cesiumContainer">
      <div class="draw-tool">
        <div v-for="draw in drawInfo" :key="draw.drawType" class="draw-row" @click="handleDraw(draw.drawType,draw.onClick)">
          <a-popover :title="draw.label" position="left">
            <icon-font :size="24" :style="{color:chooseColor[draw.drawType+'Color']}" :type="draw.iconType"/>
            <template #content>
              <div class="draw_color">
                <div
                    v-for="item in DRAW_COLOR"
                    :key="item.id"
                    :style="{background: item.colorString}"
                    class="color_box"
                    @click="changeCurrentColor(item.colorString, draw.drawType,draw.onClick)"
                >
                  <icon-font v-if="chooseColor[draw.drawType+'Color'] === item.colorString" :size="24"
                             type="icon-check"/>
                </div>
              </div>
            </template>
          </a-popover>
          <icon-font v-if="curDrawType === draw.drawType" :size="16" class="hasDraw" type="icon-select"/>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="less" scoped>
.mark-container {
  display: flex;
  width: 100%;
  height: calc(100vh - @logoHeight - 16px);
  background: @primaryColor;

}

.markList {
  width: 300px;
  height: 100%;
}

.cesiumContainer {
  flex: 1;
  height: 100%;
  position: relative;

  .draw-tool {
    position: absolute;
    right: 1rem;
    z-index: 1;
    top: 4rem;

    .draw-row {
      position: relative;
      margin-bottom: 1rem;
      cursor: pointer;
      width: 30px;
      height: 30px;
      background: #fff;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;

      .hasDraw {
        position: absolute;
        right: 0;
        top: 0;
        border-top-right-radius: 4px;
      }

    }
  }
}

.draw_color {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  .color_box {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    margin-right: 5px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }
}

</style>
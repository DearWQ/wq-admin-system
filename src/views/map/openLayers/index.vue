<script setup lang="ts">
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

import { fromLonLat } from 'ol/proj';
import {onMounted, ref} from "vue";


const openLayerRef=ref(null)
const initMap=()=>{
  // 创建高德地图的 XYZ 瓦片源
  const aMapSource = new XYZ({
    url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    // 高德地图的瓦片服务可能有不同的 URL 格式和参数，这里是一个示例
  });
  // 创建 OpenLayers 图层，使用上面创建的瓦片源
  const aMapLayer = new TileLayer({
    source: aMapSource,
  });
  // 创建 OpenLayers 地图实例
  const map = new Map({
    target: openLayerRef.value,
    layers: [aMapLayer],
    view: new View({
      center: fromLonLat([116.397428, 39.90923]), // 设置地图中心点坐标（例如：北京）
      zoom: 8, // 设置初始缩放级别
      // projection:"EPSG:4326"
    }),
  });
}
onMounted(()=>{
  initMap()
})

</script>

<template>
  <a-card title="Open Layer Map">
    <template #extra>
      <a-space>
        <a-button type="primary" @click="">添加</a-button>
      </a-space>
    </template>
    <div id="openLayer" ref="openLayerRef" style="width: 100%;height: 80vh"></div>
  </a-card>
</template>

<style scoped lang="less">

</style>
<script setup>
import {onMounted, ref} from 'vue'
import * as Cesium from 'cesium'
import {Ion} from 'cesium'
import 'cesium/Build/CesiumUnminified/Widgets/widgets.css'
import {initCesium} from "@/views/map/Cesium/util/cesium";


const cesiumContainer = ref(null)
window.CESIUM_BASE_URL = 'node_modules/cesium/Build/CesiumUnminified/'

let viewer, scene, controller, camera, fixedFrameTransform;
const headingSpan = ref()
const pitchSpan = ref()
const rollSpan = ref()
const speedSpan = ref()
const fromBehind = ref(false)
let speed = 10;
let r = 0;
let hpRoll, hpRange, deltaRadians;
const initCesium2= async ()=>{
  Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMDcxNmYxYi0wNmUyLTQ4MzUtYjU1MC0yZTRlYWFjNzJiOWQiLCJpZCI6MjI3MDUzLCJpYXQiOjE3MjA0Mjc4Mjd9.PpJ-T2kJv15yS3I1h6vlDEC2wDpDIskrPdGud65VxVQ';
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    shouldAnimate: true,
  });
  const tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({url: 'https://www.yilailu.com/static/tileset.json'}))
  viewer.scene.globe.depthTestAgainstTerrain = true;


  const canvas = viewer.canvas;
  canvas.setAttribute("tabindex", "0"); // needed to put focus on the canvas
  canvas.addEventListener("click", function () {
    canvas.focus();
  });
  canvas.focus();

  scene = viewer.scene;

  const pathPosition = new Cesium.SampledPositionProperty();
  createEntityPath(pathPosition)

  camera = viewer.camera;
  controller = scene.screenSpaceCameraController;

  hpRoll = new Cesium.HeadingPitchRoll();
  hpRange = new Cesium.HeadingPitchRange();
  deltaRadians = Cesium.Math.toRadians(3.0);

  let position = Cesium.Cartesian3.fromDegrees(
      -123.0744619,
      44.0503706,
      500.0
  );
  let speedVector = new Cesium.Cartesian3();
  fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator(
      "north",
      "west"
  );
  try {
    const planePrimitive = await createModel("https://www.yilailu.com/static/CesiumDrone.glb", {
      position,
      hpRoll,
      fixedFrameTransform
    })
    viewer.scene.preUpdate.addEventListener(function (scene, time) {
      speedVector = Cesium.Cartesian3.multiplyByScalar(
          Cesium.Cartesian3.UNIT_X,
          speed / 10,
          speedVector
      );
      position = Cesium.Matrix4.multiplyByPoint(
          planePrimitive.modelMatrix,
          speedVector,
          position
      );
      pathPosition.addSample(Cesium.JulianDate.now(), position);
      Cesium.Transforms.headingPitchRollToFixedFrame(
          position,
          hpRoll,
          Cesium.Ellipsoid.WGS84,
          fixedFrameTransform,
          planePrimitive.modelMatrix
      );

      if (fromBehind.value) {
        // Zoom to model
        const center = planePrimitive.boundingSphere.center;
        hpRange.heading = hpRoll.heading;
        hpRange.pitch = hpRoll.pitch;
        camera.lookAt(center, hpRange);
      }
    });
  } catch (error) {
    console.log(`Error loading model: ${error}`);
  }
  viewer.scene.preRender.addEventListener(function (scene, time) {

    headingSpan.value = Cesium.Math.toDegrees(hpRoll.heading).toFixed(
        1
    );
    pitchSpan.value = Cesium.Math.toDegrees(hpRoll.pitch).toFixed(1);
    rollSpan.value = Cesium.Math.toDegrees(hpRoll.roll).toFixed(1);
    speedSpan.value = speed.toFixed(1);
  });
}

onMounted(async () => {
  viewer= initCesium(cesiumContainer.value)


  //Primitive方式
  var pointPrimitives = viewer.scene.primitives.add(
      new Cesium.PointPrimitiveCollection()
  );
  var color = new Cesium.Color.fromCssColorString('#FED976').withAlpha(0.6);
  var numPoints = 100000;
  for (var j = 0; j < numPoints; ++j) {
    var position = randomPoint();
    var primitive = pointPrimitives.add({
      pixelSize: 3,
      color: color,
      position: position
    });
    primitive.tooltip = '第' + j + '个点';
    // primitive.popup = '第' + j + '个点';
    // primitive.click = function (primitive) {//单击
    //     //单击事件
    // }
  }



  // await initCesium()
  document.addEventListener("keydown", handleKeyDown);
})
//取区域内的随机点
function randomPoint() {
  var jd = haoutil.math.random(116.11 * 1000, 116.21 * 1000) / 1000;
  var wd = haoutil.math.random(30.88 * 1000, 30.98 * 1000) / 1000;
  var height = haoutil.math.random(700, 3000)
  return Cesium.Cartesian3.fromDegrees(jd, wd, height);
}
const handleKeyDown = (e) => {
  switch (e.code) {
    case "ArrowDown":
      if (e.shiftKey) {
        // speed down
        speed = Math.max(--speed, 1);
      } else {
        // pitch down
        hpRoll.pitch -= deltaRadians;
        if (hpRoll.pitch < -Cesium.Math.TWO_PI) {
          hpRoll.pitch += Cesium.Math.TWO_PI;
        }
      }
      break;
    case "ArrowUp":
      if (e.shiftKey) {
        // speed up
        speed = Math.min(++speed, 100);
      } else {
        // pitch up
        hpRoll.pitch += deltaRadians;
        if (hpRoll.pitch > Cesium.Math.TWO_PI) {
          hpRoll.pitch -= Cesium.Math.TWO_PI;
        }
      }
      break;
    case "ArrowRight":
      if (e.shiftKey) {
        // roll right
        hpRoll.roll += deltaRadians;
        if (hpRoll.roll > Cesium.Math.TWO_PI) {
          hpRoll.roll -= Cesium.Math.TWO_PI;
        }
      } else {
        // turn right
        hpRoll.heading += deltaRadians;
        if (hpRoll.heading > Cesium.Math.TWO_PI) {
          hpRoll.heading -= Cesium.Math.TWO_PI;
        }
      }
      break;
    case "ArrowLeft":
      if (e.shiftKey) {
        // roll left until
        hpRoll.roll -= deltaRadians;
        if (hpRoll.roll < 0.0) {
          hpRoll.roll += Cesium.Math.TWO_PI;
        }
      } else {
        // turn left
        hpRoll.heading -= deltaRadians;
        if (hpRoll.heading < 0.0) {
          hpRoll.heading += Cesium.Math.TWO_PI;
        }
      }
      break;
    default:
  }
}
//创建模型
const createModel = async (modelUrl, options) => {
  const {position, hpRoll, fixedFrameTransform} = options || {}
  const planePrimitive = scene.primitives.add(
      await Cesium.Model.fromGltfAsync({
        url: modelUrl,
        modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
            position,
            hpRoll,
            Cesium.Ellipsoid.WGS84,
            fixedFrameTransform
        ),
        minimumPixelSize: 128,
      })
  )

  planePrimitive.readyEvent.addEventListener(() => {
    // Play and loop all animations at half-speed
    planePrimitive.activeAnimations.addAll({
      multiplier: 0.5,
      loop: Cesium.ModelAnimationLoop.REPEAT,
    });

    // Zoom to model
    r = 2.0 * Math.max(
        planePrimitive.boundingSphere.radius,
        camera.frustum.near
    );
    controller.minimumZoomDistance = r * 0.5;
    const center = planePrimitive.boundingSphere.center;
    const heading = Cesium.Math.toRadians(230.0);
    const pitch = Cesium.Math.toRadians(-20.0);
    hpRange.heading = heading;
    hpRange.pitch = pitch;
    hpRange.range = r * 50.0;
    camera.lookAt(center, hpRange);
  });

  return planePrimitive

}
//创建轨迹路线
const createEntityPath = (pathPosition) => {
  return viewer.entities.add({
    position: pathPosition,
    name: "path",
    path: {
      show: true,
      leadTime: 0,
      trailTime: 600,
      width: 10,
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.3,
        taperPower: 0.3,
        color: Cesium.Color.PALEGOLDENROD,
      }),
    },
  });
}

let isLongPress = false
let intervalId = null;
const handleMouseDown = (type, e) => {
  if (e) {
    // 鼠标按下时开始计时
    clearInterval(intervalId); // 清除之前的计时器，防止重复计数
    intervalId = setInterval(() => {
      switch (type) {
        case "speed":
          speed = Math.min(++speed, 100);
          break;
        case "reduce":
          speed = Math.max(--speed, 0);
          break;
        case "middle":
          speed = 0;
          break;
        case "up":
          hpRoll.pitch += deltaRadians;
          if (hpRoll.pitch > Cesium.Math.TWO_PI) {
            hpRoll.pitch -= Cesium.Math.TWO_PI;
          }

          break;
        case "down":
          hpRoll.pitch -= deltaRadians;
          if (hpRoll.pitch < -Cesium.Math.TWO_PI) {
            hpRoll.pitch += Cesium.Math.TWO_PI;
          }

          break;
        case "left":
          hpRoll.heading -= deltaRadians;
          if (hpRoll.heading < 0.0) {
            hpRoll.heading += Cesium.Math.TWO_PI;
          }

          break;
        case "left-up":
          hpRoll.pitch += deltaRadians;
          if (hpRoll.pitch < -Cesium.Math.TWO_PI) {
            hpRoll.pitch += Cesium.Math.TWO_PI;
          }
          hpRoll.heading -= deltaRadians;
          if (hpRoll.heading < 0.0) {
            hpRoll.heading += Cesium.Math.TWO_PI;
          }

          break;
        case "left-down":
          hpRoll.heading -= deltaRadians;
          if (hpRoll.heading < 0.0) {
            hpRoll.heading += Cesium.Math.TWO_PI;
          }
          hpRoll.pitch -= deltaRadians;
          if (hpRoll.pitch < -Cesium.Math.TWO_PI) {
            hpRoll.pitch += Cesium.Math.TWO_PI;
          }

          break;
        case "right":
          hpRoll.heading += deltaRadians;
          if (hpRoll.heading > Cesium.Math.TWO_PI) {
            hpRoll.heading -= Cesium.Math.TWO_PI;
          }

          break;
        case "right-up":
          hpRoll.heading += deltaRadians;
          if (hpRoll.heading > Cesium.Math.TWO_PI) {
            hpRoll.heading -= Cesium.Math.TWO_PI;
          }
          hpRoll.pitch += deltaRadians;
          if (hpRoll.pitch > Cesium.Math.TWO_PI) {
            hpRoll.pitch -= Cesium.Math.TWO_PI;
          }

          break;
        case "right-down":
          hpRoll.heading += deltaRadians;
          if (hpRoll.heading > Cesium.Math.TWO_PI) {
            hpRoll.heading -= Cesium.Math.TWO_PI;
          }
          hpRoll.pitch -= deltaRadians;
          if (hpRoll.pitch < -Cesium.Math.TWO_PI) {
            hpRoll.pitch += Cesium.Math.TWO_PI;
          }
          break;
        default:
      }
      isLongPress = true;
    }, 50); // 每 100ms 计数加 1
  }

}
const handleMouseUp = (type, e) => {
  if (e) {
    clearInterval(intervalId); // 用户释放鼠标时清除计时器
    intervalId = null;
    isLongPress = false
  }

}
</script>

<template>
  <router-view></router-view>
  <div id="cesiumContainer" ref="cesiumContainer" class="cesiumContainer"></div>
<!--  <a-card title="Cesium三维地图绘制无人机操控">-->
<!--    <p class="desc" style="color: red">注意事项：1、如果使用Cesium需要注册自己的token；2、如果项目中使用了mock进行模拟数据，则会出现只显示地球但是无法显示模型，这个时候就需要在导入mock.js的地方重写mock的send方法，具体案例请看本项目根目录下的/mock/list/index.js文件</p>-->
<!--    <div class="flex">-->
<!--      <div class="box">-->
<!--        <div class="row">-->
<!--          <h4>操作</h4>-->
<!--        </div>-->
<!--        <div class="row">-->
<!--          <span>镜头是否跟随飞机:</span>-->
<!--          <input v-model="fromBehind" type="checkbox">-->
<!--        </div>-->
<!--        <div class="row">-->
<!--          <span>左右：{{ headingSpan }}°</span>-->
<!--          <span>上下：{{ pitchSpan }}°</span>-->
<!--          <span>速度：{{ speedSpan }}</span>-->
<!--        </div>-->
<!--        <div class="remoteControl">-->
<!--          <div class="r_row">-->
<!--          <span @mousedown="handleMouseDown('left-up',$event)"-->
<!--                @mouseup="handleMouseUp('left-up',$event)">左上</span>-->
<!--            <span @mousedown="handleMouseDown('up',$event)"-->
<!--                  @mouseup="handleMouseUp('up',$event)">上</span>-->
<!--            <span @mousedown="handleMouseDown('right-up',$event)"-->
<!--                  @mouseup="handleMouseUp('right-up',$event)">右上</span>-->
<!--          </div>-->
<!--          <div class="r_row">-->
<!--          <span @mousedown="handleMouseDown('left',$event)"-->
<!--                @mouseup="handleMouseUp('left',$event)">左</span>-->
<!--            <span @click="handleMouseDown('middle',$event)">停</span>-->
<!--            <span @mousedown="handleMouseDown('right',$event)"-->
<!--                  @mouseup="handleMouseUp('right',$event)">右</span>-->
<!--          </div>-->
<!--          <div class="r_row">-->
<!--          <span @mousedown="handleMouseDown('left-down',$event)"-->
<!--                @mouseup="handleMouseUp('left-down',$event)">左下</span>-->
<!--            <span @mousedown="handleMouseDown('down',$event)"-->
<!--                  @mouseup="handleMouseUp('down',$event)">下</span>-->
<!--            <span @mousedown="handleMouseDown('right-down',$event)"-->
<!--                  @mouseup="handleMouseUp('right-down',$event)">右下</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div style="display: flex">-->
<!--          <div class="r_row">-->
<!--            <span style="width: 40px;height: 40px" @mousedown="handleMouseDown('speed',$event)"-->
<!--                  @mouseup="handleMouseUp('speed',$event)">加速</span>-->
<!--            <span style="width: 40px;height: 40px" @mousedown="handleMouseDown('reduce',$event)"-->
<!--                  @mouseup="handleMouseUp('reduce',$event)">减速</span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div id="cesiumContainer" ref="cesiumContainer" class="cesiumContainer"></div>-->
<!--    </div>-->
<!--  </a-card>-->
</template>

<style scoped>
.cesiumContainer {
  width: 100%;
  height: 100%;
  flex: 1;
}

.box {
  background: #fff;
  padding: 8px;
  border-radius: 10px;
  box-sizing: border-box;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  white-space: nowrap;
  width: 300px;
}

.row {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
}

.btn span {
  display: flex;
  color: #fff;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 30px;
  background: #165DFF;
  margin-left: 8px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}


.remoteControl {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 160px;

  border-radius: 10px;
}

.r_row {
  width: 100%;
  height: calc(100% / 3);
  display: flex;
}

.r_row span {
  width: calc(100% / 3);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ffffff;
  border-radius: 10px;
  background: #165DFF;
  color: #fff;
  cursor: pointer;
  user-select: none;
}

.r_row span:hover {
  background: rgba(22, 93, 255, 0.61);
}
</style>
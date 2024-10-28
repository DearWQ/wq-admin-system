import {Ion} from 'cesium'
import * as Cesium from "cesium";
import 'cesium/Build/CesiumUnminified/Widgets/widgets.css'
import {getAltitudeByLevel} from "@/views/map/Cesium/util/cesiumUtils";
window.CESIUM_BASE_URL = 'node_modules/cesium/Build/CesiumUnminified/'
const options= {
    animation: false, //是否创建动画小器件，左下角仪表
    fullscreenButton: false, //是否显示全屏按钮
    vrButton: false, // 用于切换 VR 模式的单个按钮小部件。
    homeButton: false, //是否显示Home按钮
    infoBox: false, //是否显示信息框
    sceneModePicker: false, //是否显示3D/ 选择器
    selectionIndicator: false, //是否显示选取指示器组件
    timeline: false, //是否显示时间轴
    navigationHelpButton: false, //是否显示右上角的帮助按钮
    navigationInstructionsInitiallyVisible: false,
    scene3DOnly: false, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
    // shouldAnimate: true, // 初始化是否开始动画
    clockViewModel: undefined, // 一个视图模型，它为用户界面提供 Clock
    selectedImageryProviderViewModel: undefined, //当前图像图层的显示模型，仅baseLayerPicker设为true有意义
    selectedTerrainProviderViewModel: undefined, //当前地形图层的显示模型，仅baseLayerPicker设为true有意义
    // skyAtmosphere: new Cesium.SkyAtmosphere(), // 围绕提供的椭球体边缘绘制的大气
    fullscreenElement: document.body, //全屏时渲染的HTML元素,
    useDefaultRenderLoop: true, //如果需要控制渲染循环，则设为true
    // targetFrameRate: 'redner', //使用默认render loop时的帧率
    showRenderLoopErrors: false, //如果设为true，将在一个HTML面板中显示错误信息
    automaticallyTrackDataSourceClocks: false, //自动追踪最近添加的数据源的时钟设置
    // contextOptions: {}, //传递给Scene对象的上下文参数（scene.options）
    // sceneMode: Cesium.SceneMode.SCENE3D, //初始场景模式
    mapProjection: new Cesium.WebMercatorProjection(), //地图投影体系
    globe: undefined, // 在场景中渲染的地球仪，包括其地形 ( Globe#terrainProvider ) 和图像图层 ( Globe#imageryLayers )
    orderIndependentTranslucency: false,
    dataSources: new Cesium.DataSourceCollection(), //需要进行可视化的数据源的集合
    projectionPicker: undefined, //ProjectionPicker 是用于在透视和正交投影之间切换的单按钮小部件。
    contextOptions: {
        webgl: {
            alpha: true,
        },
    },
    preferLeaves: true,
    cullRequestsWhileMoving: true,
    immediatelyLoadDesiredLevelOfDetail: true,
    foveatedTimeDelay: 0,
    shouldAnimate: true,
    baseLayerPicker: false,
    // 加载地形
    terrainProvider: new Cesium.CesiumTerrainProvider({
        url: "https://117.149.29.163:8086/tilesets/terrain-all/", // 包含 杭州 宁波 高程
        requestVertexNormals: true, // 看 extension 是否支持，大疆提供的瓦片都有这个字段
    }),
}

/**
 * 初始化cesium
 * @param {HTMLElement} domRef
 */
export const initCesium= (domRef )=>{
    Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMDcxNmYxYi0wNmUyLTQ4MzUtYjU1MC0yZTRlYWFjNzJiOWQiLCJpZCI6MjI3MDUzLCJpYXQiOjE3MjA0Mjc4Mjd9.PpJ-T2kJv15yS3I1h6vlDEC2wDpDIskrPdGud65VxVQ';
    const cesiumViewer = new Cesium.Viewer(domRef,options)
    const rectangle= new Cesium.Rectangle.fromDegrees(115.91760886318447, 43.9683330036193, 116.07255681838843, 44.05579065567321)
    // 瓦片地图加载
    addImageryProvider({
        mapViewer: cesiumViewer,
        url: `https://117.149.29.163:8086/tiles/img_w/{z}/{x}/{y}.png`,
        level: 18,
        limitRectangle: null,
        limitLevel: 1
    })
    //卫星地图瓦片加载
    addImageryProvider({
        mapViewer: cesiumViewer,
        url: `https://117.149.29.163:8086/tiles/cav_w/{z}/{x}/{y}.png`,
        level: 18,
        limitRectangle: null,
        limitLevel: 1
    })
    //加载3d模型
    add3DTileSet({
        viewer: cesiumViewer,
        url: 'https://117.149.29.163:8086/models/3DModels/ed8ad6cb-d9be-4ae1-954b-228272c84d69/terra_b3dms/tileset.json'
    })
    //深度检测
    cesiumViewer.scene.globe.depthTestAgainstTerrain = false
    //去除版权信息
    cesiumViewer.cesiumWidget.creditContainer.style.display = "none";
    // cesiumViewer.scene.globe.depthTestAgainstTerrain = true; //解决垂直视角时点击报错的问题
    //初始化居中位置
    // cameraFlyToCenter(cesiumViewer, [116.03107236881323, 43.982647482302866], 14)
    // 设置相机飞往的参数
    cameraFlyToCenter(cesiumViewer, [120.1750081351517, 30.24625066562017], 16)

    return cesiumViewer
}

/**
 * 瓦片加载
 * @param {Object} options 配置项
 * @param {Cesium.Viewer} options.mapViewer 地图实例
 * @param {String} options.url 瓦片url
 * @param {Number} options.level 区域内瓦片显示的等级
 * @param {Cesium.Rectangle} options.limitRectangle 限制区域内显示
 * @param {Number} options.limitLevel 区域外显示的瓦片等级
 *
 */
export const addImageryProvider=(options)=>{
    const {mapViewer,url,level=18,limitRectangle,limitLevel=1} = options
    mapViewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
        url,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: limitRectangle?limitLevel:level,
    }))
    if(limitRectangle){
        mapViewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            url,
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
            maximumLevel: level,
            rectangle: limitRectangle
        }))
    }
}

/**
 * 相机视角居中显示
 * @param viewer 地图实例
 * @param centerPosition 居中经纬度
 * @param level 居中显示地图层级 默认12级
 */
export const cameraFlyToCenter=(viewer, centerPosition,level=12)=>{
   const [lng,lat,height]= centerPosition
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, getAltitudeByLevel(level)),
    });
}

/**
 * 3D模型加载
 * @param options
 * @param options.viewer 地图实例
 * @param options.url 模型url
 */
export const add3DTileSet=(options)=>{
    const {viewer,url}=options
    viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url,
        maximumScreenSpaceError:16,
        maximumMemoryUsage:512*1024*1024
    }))
}
import * as Cesium from "cesium";
import * as turf from "@turf/turf";
import pointer2 from "../../../../assets/pointer2.svg"
import pointer4 from "../../../../assets/point4.svg"
import CreateLineEntity from "@/views/map/Cesium/util/createLineEntity";
import CreatePointEntity from "@/views/map/Cesium/util/createPointEntity";
import CreateCircleEntity from "@/views/map/Cesium/util/createCircleEntity";
import CreatePlaneEntity from "@/views/map/Cesium/util/createPlaneEntity";

class Draw {

    constructor(viewer, config) {
        /**cesium实例对象 */
        this.viewer = viewer
        /**绘制要素的相关配置
         * 默认配置
         * {
         borderColor: Cesium.Color.BLUE,  边框颜色
         borderWidth: 2, 边框宽度
         material: Cesium.Color.GREEN.withAlpha(0.5),填充材质
         }
         */
        this.config = config || {
            borderColor: Cesium.Color.WHITE,
            borderWidth: 5,
            color: Cesium.Color.GREEN,
            markName: "mark" + Cesium.createGuid(),
            material: Cesium.Color.GREEN.withAlpha(0.5),
        }
        /**存贮绘制的数据 坐标 */
        this.infoDetail = {point: [], pointList: [], line: [], rectangle: [], circle: [], planeSelf: []}
        this.onDrawComplete = null
        this.handler = null
    }

    /*******
     * @function: function
     * @return {*}
     * @author: xk
     * @description: 绘制点数据
     */
    drawPoint() {
        if (!this.handler) {
            this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
        }
        this.handler.setInputAction(async (click) => {
            let {lng, lat, alt} = pickElevationInfo(this.viewer, click.position)
            const pointEntityInfo = new CreatePointEntity({
                viewer: this.viewer,
                pointId: Cesium.createGuid(),
                pointName: this.config.markName,
                pointImage: pointer2,
                pointTextImage: pointer4,
                pointList: [lng, lat, alt],
                display: true,
                color: this.config.color,
            });
            pointEntityInfo.createPoint();
            this.handler?.destroy();
            this.handler = null
            // 调用回调函数
            if (this.onDrawComplete) {
                this.onDrawComplete('point', pointEntityInfo);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }

    /*******
     * @function: function
     * @description: 绘制矩形区域
     * @return {*}
     * @author: xk
     */
    drawRectangle() {
        this.handler?.destroy()
        /**
         * 矩形四点坐标
         */
        let westSouthEastNorth = []
        /**实体的唯一标注 */
        let id = null
        /**地图点击对象 */
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
        this.handler.setInputAction((click) => {
            /**点击位置笛卡尔坐标 */
            let cartesian = this.viewer.camera.pickEllipsoid(click.position, this.viewer.scene.globe.ellipsoid)
            /**笛卡尔转弧度坐标 */
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian, this.viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
            /**点击位置经度 */
            let lng1 = Cesium.Math.toDegrees(cartographic.longitude)
            /**点击位置维度 */
            let lat1 = Cesium.Math.toDegrees(cartographic.latitude)
            /**边框坐标 */
            westSouthEastNorth = [lng1, lat1]

            id = new Date().getTime()
            if (westSouthEastNorth) {
                this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
            }

            console.log(Cesium.Cartesian3.fromDegreesArray(westSouthEastNorth))
            /**面实例对象 */
            let polygons = this.viewer.entities.add({
                name: 'rectangle',
                id: id,
                polygon: {
                    hierarchy: new Cesium.CallbackProperty(function () {
                        return {
                            positions: Cesium.Cartesian3.fromDegreesArray(westSouthEastNorth)
                        }
                    }, false),
                    height: 0,
                    // 填充的颜色，withAlpha透明度
                    material: this.config.material,
                    // 是否被提供的材质填充
                    fill: true,
                    // 是否显示
                    show: true,
                },
                polyline: {
                    positions: new Cesium.CallbackProperty(function () {
                        return Cesium.Cartesian3.fromDegreesArray(westSouthEastNorth)
                    }, false),
                    material: this.config.borderColor,
                    width: this.config.borderWidth,
                    zIndex: 1
                }
            })
            this.handler.setInputAction((move) => {
                let cartesian = this.viewer.camera.pickEllipsoid(move.endPosition, this.viewer.scene.globe.ellipsoid)
                let cartographic = Cesium.Cartographic.fromCartesian(cartesian, this.viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
                let lng = Cesium.Math.toDegrees(cartographic.longitude)
                let lat = Cesium.Math.toDegrees(cartographic.latitude)

                westSouthEastNorth = [lng1, lat1, lng1, lat, lng, lat, lng, lat1, lng1, lat1]


            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)


        this.handler.setInputAction(() => {
            this.handler.destroy();
            this.infoDetail.rectangle.push({id: id, position: westSouthEastNorth})
            // 调用回调函数
            if (this.onDrawComplete) {
                this.onDrawComplete('rectangle', this.infoDetail.rectangle);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    }

    /*******
     * @function: function
     * @description: 绘制圆形区域
     * @return {*}
     * @author: xk
     */
    drawCircle() {
        /**圆心 */
        let circleCenter = []
        let circleEntity;
        /**鼠标事件 */
        if (!this.handler) {
            this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
        }
        this.handler.setInputAction(async (movement) => {
            const {lng, lat, alt} = pickElevationInfo(this.viewer, movement.position);
            circleCenter = [lng, lat, alt];
            circleEntity = new CreateCircleEntity({
                viewer: this.viewer,
                circleId: Cesium.createGuid(),
                markName: '圆',
                color: this.config.color,
                transparency: 30,
            });
            circleEntity.createCircle({
                position: [lng, lat, alt],
            });
            if (circleCenter) {
                this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
            }

            this.handler.setInputAction((_movement) => {
                const elevationInfo = pickElevationInfo(this.viewer, _movement.endPosition);
                const distance = Math.round(
                    Cesium.Cartesian3.distance(
                        Cesium.Cartesian3.fromDegrees(lng, lat, alt),
                        Cesium.Cartesian3.fromDegrees(
                            elevationInfo.lng,
                            elevationInfo.lat,
                            elevationInfo.alt
                        )
                    )
                );
                circleEntity.radius = distance;
                circleEntity.circleEntity.ellipse.semiMajorAxis = new Cesium.CallbackProperty(
                    function () {
                        return distance;
                    },
                    false
                );
                circleEntity.circleEntity.ellipse.semiMinorAxis = new Cesium.CallbackProperty(
                    function () {
                        return distance;
                    },
                    false
                );
                circleEntity.savePointList([
                    circleCenter,
                    [elevationInfo.lng, elevationInfo.lat, elevationInfo.alt],
                ]);
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        this.handler.setInputAction(() => {
            circleEntity.addTextLabel();
            circleEntity.setDistance();
            circleEntity.drawArc();
            this.viewer.scene.screenSpaceCameraController.enableRotate = true;
            this.viewer.scene.screenSpaceCameraController.enableTranslate = true;
            this.viewer.scene.screenSpaceCameraController.enableZoom = true;
            // 调用回调函数
            if (this.onDrawComplete) {
                this.onDrawComplete('circle', circleEntity);
            }
            this.handler?.destroy();
            this.handler = null
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    }

    /*******
     * @function: function
     * @description: 自定义区域绘制
     * @return {*}
     * @author: xk
     */
    drawPlane(){
        let planeInfo = null;
        let hierarchy=new Cesium.PolygonHierarchy()
        if (!this.handler) {
            this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        }
        // left
        this.handler.setInputAction(async (movement) => {
            const entity = this.viewer.scene.pick(movement.position);
            if (!entity?.id?.pointId) {
                const {lng, lat, alt} = pickElevationInfo(this.viewer, movement.position)

                let cartesian = Cesium.Cartesian3.fromDegrees(lng, lat, alt)
                hierarchy.positions.push(cartesian.clone())
                if (!planeInfo) {
                    planeInfo = new CreatePlaneEntity({
                        viewer: this.viewer,
                        markId: Cesium.createGuid(),
                        markName: "面",
                        color: this.config.color,
                        display: true,
                        transparency: this.config.transparency || 30,
                    });
                    planeInfo.pointList = [
                        [lng, lat, alt],
                        [lng, lat, alt],
                        [lng, lat, alt],
                    ];
                    hierarchy.positions.push(cartesian.clone())
                    planeInfo.createPlane({
                        polygon: {
                            // 获取指定属性（positions，holes（图形内需要挖空的区域））
                            hierarchy: new Cesium.CallbackProperty(function () {
                                return hierarchy
                            }, false),
                            // 边框
                            outline: false,
                            // 边框颜色
                            outlineColor: Cesium.Color.fromCssColorString(this.config.color),
                            // 边框尺寸
                            outlineWidth: 1,
                            // 填充的颜色，withAlpha透明度
                            material: Cesium.Color.fromCssColorString(this.config.color).withAlpha((this.config.transparency || 30) / 100),

                            // 是否被提供的材质填充
                            fill: true,
                            clampToGround: true,
                            show: true,
                            zIndex: 100,
                        },
                        polyline: {
                            positions: new Cesium.CallbackProperty(function () {
                                return planeInfo.pointList.map((item) => {
                                    return Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2]);
                                });
                            }, false),
                            // 宽度
                            width: 2,
                            // 线的颜色
                            material: Cesium.Color.fromCssColorString(this.config.color),
                            // 线的顺序,仅当`clampToGround`为true并且支持地形上的折线时才有效。
                            zIndex: 999,
                            // 显示在距相机的距离处的属性，多少区间内是可以显示的
                            clampToGround: true,
                            // 是否显示
                            show: true,
                        },
                        show: true,
                    });
                } else {
                    planeInfo.pointList.splice(planeInfo.pointList.length - 2, 0, [lng, lat, alt]);
                }
                planeInfo.addPoint([lng, lat, alt]);
            }

            //判断当前点击的点是否是保存的点
            if (entity?.id?.pointId && entity?.id?.hasCheck && planeInfo) {
                planeInfo.pointList.splice(planeInfo.pointList.length - 3, 1);
                let polygon = turf.polygon([planeInfo.pointList]);
                let center = turf.centroid(polygon).geometry.coordinates;
                let updatedPositions = await Cesium.sampleTerrainMostDetailed(
                    this.viewer.terrainProvider,
                    [Cesium.Cartographic.fromDegrees(center[0], center[1])]
                );
                planeInfo.addTextLabel({
                    position: Cesium.Cartesian3.fromDegrees(
                        center[0],
                        center[1],
                        updatedPositions[0].height
                    ),
                });
                //更新图标点
                planeInfo.updatePoint();
                this.viewer.container.style.cursor = "default";
                this.handler.destroy()
                this.handler=null
                // 调用回调函数
                if (this.onDrawComplete) {
                    this.onDrawComplete('Plane', planeInfo);
                }

            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        // mouse
        this.handler.setInputAction(async (movement) => {
            const entity = this.viewer.scene.pick(movement.startPosition);
            if (entity?.id?.pointId && entity?.id?.hasCheck && planeInfo) {
                this.viewer.container.style.cursor = "pointer";
            } else {
                this.viewer.container.style.cursor = "default";
            }
            if (planeInfo && planeInfo.pointList.length > 0) {
                const { lng, lat, alt } = pickElevationInfo(this.viewer, movement.endPosition);
                let cartesian = Cesium.Cartesian3.fromDegrees(lng, lat, alt)
                hierarchy.positions[hierarchy.positions.length-1]=cartesian.clone()
                planeInfo.pointList[planeInfo.pointList.length - 2] = [lng, lat, alt];
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    }

    /*******
     * @function: function
     * @return {*}
     * @author: xk
     * @description: 绘制线段
     */
    drawLine() {
        this.handler?.destroy();
        /**面对象配置 */
        let lineInfo = null
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        // left
        this.handler.setInputAction(async (movement) => {
            const entity = this.viewer.scene.pick(movement.position);
            if (!entity?.id?.pointId) {
                const {lng, lat, alt} = pickElevationInfo(this.viewer, movement.position)
                if (!lineInfo) {
                    lineInfo = new CreateLineEntity({
                        viewer: this.viewer,
                        mrkId: Cesium.createGuid(),
                        markName: this.config.markName,
                        display: true,
                        lineColor: this.config.color,
                    });
                    lineInfo.pointList = [
                        [lng, lat, alt],
                        [lng, lat, alt],
                    ];
                    lineInfo.createLine({
                        positions: new Cesium.CallbackProperty(function () {
                            return lineInfo.pointList.map((item) => {
                                return Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2]);
                            });
                        }, false),
                        // 宽度
                        width: 2,
                        // 线的颜色
                        material: Cesium.Color.fromCssColorString(this.config.color),
                        // 线的顺序,仅当`clampToGround`为true并且支持地形上的折线时才有效。
                        zIndex: 999,
                        // 显示在距相机的距离处的属性，多少区间内是可以显示的
                        clampToGround: true,
                        // 是否显示
                        show: true,
                    });
                } else {
                    lineInfo.pointList.push([lng, lat, alt]);
                }
                lineInfo.addPoint([lng, lat, alt]);
            }

            if (entity?.id?.pointId && entity?.id?.hasCheck && lineInfo) {
                lineInfo.pointList.pop();
                lineInfo.createTextLabel();
                lineInfo.updatePoint();
                if (this.onDrawComplete) {
                    this.onDrawComplete('line', lineInfo);
                }
                this.handler?.destroy();
                this.handler = null;
                this.viewer.container.style.cursor = "default";
            }


        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        // mouse
        this.handler.setInputAction((movement) => {
            const entity = this.viewer.scene.pick(movement.startPosition);
            if (entity?.id?.pointId && entity?.id?.hasCheck && lineInfo) {
                this.viewer.container.style.cursor = "pointer";
            } else {
                this.viewer.container.style.cursor = "default";
            }
            const {lng, lat, alt} = pickElevationInfo(this.viewer, movement.endPosition)

            if (lineInfo && lineInfo.pointList.length) {
                lineInfo.pointList[lineInfo.pointList.length - 1] = [lng, lat, alt];
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    }

    /*******
     * @function: function
     * @description: 移除实体对象
     * @return {*}
     * @author: xk
     */
    removeEntity() {
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
        this.handler.setInputAction((move) => {
            /**实体对象信息  {id：entities，primitive：。。} */
            let pick = this.viewer.scene.pick(move.endPosition);

            if (pick && pick.id && pick.id.id) {
                document.body.style.cursor = "pointer";
                this.handler.setInputAction((click) => {
                    let newPoint
                    switch (pick.id.name) {

                        case 'point':
                            /**删除某一条数据 */
                            newPoint = this.infoDetail.point.filter(item => item.id !== pick.id._id)
                            this.infoDetail.point = newPoint
                            break
                        case 'line':
                            /**删除某一条数据 */
                            newPoint = this.infoDetail.line.filter(item => item.id !== pick.id._id)
                            this.infoDetail.line = newPoint
                            break
                        case 'rectangle':
                            /**删除某一条数据 */
                            newPoint = this.infoDetail.rectangle.filter(item => item.id !== pick.id._id)
                            this.infoDetail.rectangle = newPoint
                            break

                        case 'planeSelf':
                            /**删除某一条数据 */
                            newPoint = this.infoDetail.planeSelf.filter(item => item.id !== pick.id._id)
                            this.infoDetail.planeSelf = newPoint
                            break
                        case 'circle':
                            /**删除某一条数据 */
                            newPoint = this.infoDetail.circle.filter(item => item.id !== pick.id._id)
                            this.infoDetail.circle = newPoint
                            break
                        default:
                            break
                    }
                    this.viewer.entities.remove(pick.id)
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

            } else {
                document.body.style = "cursor: default;";
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }

    /*******
     * @function: function
     * @return {*}
     * @author: xk
     * @description: 返回绘制数据
     */
    backInfoDetail() {
        return this.infoDetail
    }

    editEntity(){

    }
}

//该方法用于判断点击获取的是地形的经纬度高度还是模型的经纬度高度
const getPositionInfo = async (clickPosition, viewer) => {
    let lng,
        lat,
        alt,
        actualHeight,
        terrainHeight,
        pickedFeature = viewer.scene.pick(clickPosition);
    const _getPositionInfo = async () => {
        let ray = viewer.camera.getPickRay(clickPosition);
        let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
        lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
        alt = cartographic.height; // 高度
        actualHeight = cartographic.height; //适用于模型表面位置的选取，通俗的说就是camera看过去第一个被挡住的模型（如entity）上的坐标，通常结合其他的选取方式一块用于选取模型和球上的点。
        let updatedPositions = await Cesium.sampleTerrainMostDetailed(
            viewer.terrainProvider,
            [Cesium.Cartographic.fromDegrees(lng, lat)]
        );
        terrainHeight = updatedPositions[0].height; //地形高度，适用于地形的选取
    }


    if (Cesium.defined(pickedFeature)) {
        // 获取点击位置的三维坐标
        let pickedPosition = viewer.scene.pickPosition(clickPosition);
        if (Cesium.defined(pickedPosition)) {
            // 将三维坐标转换为地理坐标（经纬度和高度）
            let cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
            alt = cartographic.height; // 高度绘制标注时的高度
            lat = Cesium.Math.toDegrees(cartographic.latitude);
            lng = Cesium.Math.toDegrees(cartographic.longitude);
            actualHeight = cartographic.height; //适用于模型表面位置的选取，通俗的说就是camera看过去第一个被挡住的模型（如entity）上的坐标，通常结合其他的选取方式一块用于选取模型和球上的点。
            let updatedPositions = await Cesium.sampleTerrainMostDetailed(
                viewer.terrainProvider,
                [Cesium.Cartographic.fromDegrees(lng, lat)]
            );
            terrainHeight = updatedPositions[0].height; //地形高度，适用于地形的选取
        } else {
            await _getPositionInfo()
        }
    } else {
        await _getPositionInfo()
    }


    return {
        lat,
        lng,
        alt,
        hasExitModel: parseInt(terrainHeight) === parseInt(actualHeight),
        actualHeight,
        terrainHeight,
    };
};


const pickHeight = (_viewer_, clickPosition) => {
    let lng, lat, height, terrainHeight, pickedFeature = _viewer_.scene.pick(clickPosition);

    if (_viewer_.scene.globe.depthTestAgainstTerrain) {
        if (Cesium.defined(pickedFeature)) {
            // 获取点击位置的三维坐标
            let pickedPosition = _viewer_.scene.pickPosition(clickPosition);
            if (Cesium.defined(pickedPosition)) {
                // 将三维坐标转换为地理坐标（经纬度和高度）
                let cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
                height = cartographic.height; // 高度绘制标注时的高度
                lat = Cesium.Math.toDegrees(cartographic.latitude);
                lng = Cesium.Math.toDegrees(cartographic.longitude);
                terrainHeight = getTerrainHeight(_viewer_, clickPosition).height
            } else {
                const terrainInfo = getTerrainHeight(_viewer_, clickPosition)
                lng = terrainInfo.lng
                lat = terrainInfo.lat
                height = terrainInfo.height
                terrainHeight = terrainInfo.height
            }
        } else {
            const terrainInfo = getTerrainHeight(_viewer_, clickPosition)
            lng = terrainInfo.lng
            lat = terrainInfo.lat
            height = terrainInfo.height
            terrainHeight = terrainInfo.height
        }
    } else {
        // 获取点击位置的屏幕坐标
        let screenPosition = new Cesium.Cartesian2(clickPosition.x, clickPosition.y);
        let pickedPosition = _viewer_.scene.pickPosition(screenPosition);

        if (Cesium.defined(pickedPosition) && Cesium.Cartographic.fromCartesian(pickedPosition).height > 0) {
            let cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
            height = cartographic.height; // 高度绘制标注时的高度
            lat = Cesium.Math.toDegrees(cartographic.latitude);
            lng = Cesium.Math.toDegrees(cartographic.longitude);
            terrainHeight = getTerrainHeight(_viewer_, clickPosition).terrainHeight
        } else {
            const terrainInfo = getTerrainHeight(_viewer_, clickPosition)
            lng = terrainInfo.lng
            lat = terrainInfo.lat
            height = terrainInfo.height
            terrainHeight = terrainInfo.height
        }
    }
    return {
        lat,
        lng,
        alt: height,
        terrainHeight,
    };
}
/**
 * 拾取点击位置的经纬度、高度
 * @param _viewer_ 当前视图实例
 * @param clickPosition 当前点击位置x,y坐标
 * @return {{hasExitModel: boolean, lng, alt, terrainHeight, lat}}
 */
export const pickElevationInfo = (_viewer_, clickPosition) => {
    let lng, lat, height, terrainHeight, hasExitModel = false, cartographic,
        pickedFeature = _viewer_.scene.pick(clickPosition);
    //是否开启深度检测
    if (_viewer_.scene.globe.depthTestAgainstTerrain) {
        if (Cesium.defined(pickedFeature)) {
            // 获取点击位置的三维坐标
            let pickedPosition = _viewer_.scene.pickPosition(clickPosition);
            if (Cesium.defined(pickedPosition)) {
                // 将三维坐标转换为地理坐标（经纬度和高度）
                let cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
                height = cartographic.height; // 高度绘制标注时的高度
                lat = Cesium.Math.toDegrees(cartographic.latitude);
                lng = Cesium.Math.toDegrees(cartographic.longitude);
                hasExitModel = true
                terrainHeight = getTerrainHeight(_viewer_, clickPosition).height
            } else {
                const terrainInfo = getTerrainHeight(_viewer_, clickPosition)
                lng = terrainInfo.lng
                lat = terrainInfo.lat
                height = terrainInfo.height
                terrainHeight = terrainInfo.height
            }
        } else {
            const terrainInfo = getTerrainHeight(_viewer_, clickPosition)
            lng = terrainInfo.lng
            lat = terrainInfo.lat
            height = terrainInfo.height
            terrainHeight = terrainInfo.height
        }
    } else {
        // 获取点击位置的屏幕坐标
        let screenPosition = new Cesium.Cartesian2(clickPosition.x, clickPosition.y);
        let pickedPosition = _viewer_.scene.pickPosition(screenPosition);
        if (Cesium.defined(pickedPosition) && Cesium.Cartographic.fromCartesian(pickedPosition).height > 0) {
            cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
            lat = Cesium.Math.toDegrees(cartographic.latitude);
            lng = Cesium.Math.toDegrees(cartographic.longitude);
            height = cartographic.height; // 高度绘制标注时的高度
            hasExitModel = true
            terrainHeight = getTerrainHeight(_viewer_, clickPosition).terrainHeight
        } else {
            const terrainInfo = getTerrainHeight(_viewer_, clickPosition)
            lng = terrainInfo.lng
            lat = terrainInfo.lat
            height = terrainInfo.height
            terrainHeight = terrainInfo.height
            cartographic = terrainInfo.cartographic
        }
    }
    return {
        lat,
        lng,
        alt: height,
        terrainHeight,
        hasExitModel,
        cartographic,
    };
}


const getTerrainHeight = (viewer, clickPosition) => {
    let ray = viewer.camera.getPickRay(clickPosition);
    let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    if (!cartesian) {
        return {
            lng: 0, // 经度,
            lat: 0, // 纬度,
            height: 0
        }
    }
    let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    return {
        lng: Cesium.Math.toDegrees(cartographic.longitude), // 经度,
        lat: Cesium.Math.toDegrees(cartographic.latitude), // 纬度,
        height: cartographic.height,
        cartographic,
    }
}
export default Draw;
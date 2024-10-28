import * as Cesium from "cesium";
import {calcAngle, get_another_point} from "@/views/map/Cesium/util/cesiumUtils";


class CreateCircleEntity {
    //类型
    static MARKTYPE='circle'
    constructor(options) {
        this.MapViewer = options.viewer;
        this.circleEntity = null;
        this.radius = options.radius || 1;
        this.pointList = options.position;
        this.circleId = options.circleId;
        this.markName = options.markName || '区域';
        //绘制半径距离线
        this.radiusLineEntity = null;
        //绘制距离标签
        this.radiusDistanceLabelEntity = null;
        //圆弧
        this.circleArcEntity = null;
        //点集合
        this.areaPointLineList = [];
        //绘制圆心
        this.circleCenterPointEntity = null;
        //绘制结束点
        this.endPointEntity = null;
        //文本
        this.circleTextLabelEntity = null;
        //面积
        this.areaArea = 0
        //周长
        this.circumference = 0
        //透明度
        this.transparency = options.transparency || 30
        //是否启用
        this.status = options.status || 1
        //是否高亮
        this.hasHighlight = false
        //颜色
        this.color = options.color || 'rgba(49, 223, 96, 1)'
        //是否编辑
        this.hasEdit = false
        //是否在绘制
        this.hasDraw = options.hasDraw || false
    }

    createCircle(options) {
        this.pointList = options.position;
        this.areaPointLineList = [options.position]
        this.circleEntity = this.MapViewer.entities.add({
            markName: this.markName,
            circleId: this.circleId,
            position: Cesium.Cartesian3.fromDegrees(options.position[0], options.position[1]),
            ellipse: {
                // height:options.position[2]+5,
                semiMinorAxis: 0,
                semiMajorAxis: 0,
                material: Cesium.Color.fromCssColorString(this.color).withAlpha(this.transparency / 100),
                outline: true, // 是否绘制外框
                outlineColor: Cesium.Color.WHITE, // 外框颜色
                outlineWidth: 2, // 外框宽度
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                perPositionHeight: true, // 开启高程功能
                clampToGround: true,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        })
        this.circleEntity.ellipse.semiMajorAxis = new Cesium.CallbackProperty(function () {
            return this.radius
        }, false)
        this.circleEntity.ellipse.semiMinorAxis = new Cesium.CallbackProperty(function () {
            return this.radius
        }, false)
        this.circleCenterPointEntity = this.MapViewer.entities.add({
            circleId: this.circleId,
            markName: this.markName,
            position: new Cesium.CallbackProperty(function () {
                return Cesium.Cartesian3.fromDegrees(options.position[0], options.position[1], options.position[2] )
            }, false),
            point: {
                color: new Cesium.Color.fromCssColorString("#fff"),
                pixelSize: 8,
                outlineColor: Cesium.Color.WHITE,
                // outlineWidth: 1,
                // 相对于坐标的水平位置
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                // 相对于坐标的水平位置
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
                pixelOffset: new Cesium.Cartesian2(0, -10),
                eyeOffset: new Cesium.Cartesian3(0, 0, -10),
                // 显示在距相机的距离处的属性，多少区间内是可以显示的
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            pointId:'point_'+ Cesium.createGuid()
        })
    }

    savePointList(pointList) {
        this.areaPointLineList = pointList;
    }

    setDistance() {
        this.areaArea = Math.round(3.14 * Math.pow(this.radius, 2))
        this.circumference = Math.round(2 * 3.14 * this.radius)
    }

    //获取东西南北四个方位的顶点
    getPoint() {
        return this.calculatePoint(this.pointList, this.radius)
    }

    //绘制半径线
   async drawRadiusLine(pointList, radius) {
        const [lng, lat] = get_another_point(pointList[0][0], pointList[0][1], 0, radius)
        const left = Cesium.Cartesian3.fromDegrees(pointList[0][0], pointList[0][1],);
        const right = Cesium.Cartesian3.fromDegrees(lng, lat);
        //绘制半径线
        this.radiusLineEntity = this.MapViewer.entities.add({
            circleId: this.circleId,
            markName: this.markName,
            polyline: new Cesium.PolylineGraphics({
                positions: Cesium.Cartesian3.fromDegreesArray([pointList[0][0], pointList[0][1], lng, lat]),
                width: 5,
                material: new Cesium.PolylineDashMaterialProperty({ // 定义虚线材质
                    color: Cesium.Color.fromCssColorString('#fff'), // 线的颜色
                    gapColor: Cesium.Color.TRANSPARENT, // 虚线之间的颜色
                    dashLength: 20.0, // 虚线的长度
                    phase: 0.0 // 从哪个点开始绘制虚线
                }),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                show: true,
                zIndex: 1000,
                clampToGround: true,
            }),
            show: false
        });
        //绘制距离标签
        this.radiusDistanceLabelEntity = this.MapViewer.entities.add({
            position: new Cesium.CallbackProperty(function () {
                return Cesium.Cartesian3.midpoint(left, right, new Cesium.Cartesian3());
            }, false),
            label: {
                text: `R：${radius}m`,
                font: "12pt Source Han Sans CN",
                fillColor: Cesium.Color.WHITE,
                scale: 1,
                showBackground: true,
                backgroundColor: new Cesium.Color(0, 0, 0, 0.8),
                backgroundPadding: new Cesium.Cartesian2(10, 10),
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                pixelOffset: new Cesium.Cartesian2(0, 0),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                show: true,
                eyeOffset: new Cesium.Cartesian3(0, 0, -100),
            },
            markName: this.markName,
            circleId: this.circleId,
            show: false,
        });

        let updatedPositions = await Cesium.sampleTerrainMostDetailed(
            this.MapViewer.terrainProvider,
            [Cesium.Cartographic.fromDegrees(lng, lat)]
        );
        //绘制圆心到半径终点
        this.endPointEntity = this.MapViewer.entities.add({
            pointId:'point_'+ Cesium.createGuid(),
            circleId: this.circleId,
            markName: this.markName,
            position: new Cesium.CallbackProperty(function () {
                return Cesium.Cartesian3.fromDegrees(lng, lat, updatedPositions[0].height)
            }, false),
            point: {
                color: new Cesium.Color.fromCssColorString("#fff"),
                pixelSize: 20,
                outlineColor: Cesium.Color.WHITE,
                // outlineWidth: 1,
                // 相对于坐标的水平位置
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                // 相对于坐标的水平位置
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
                pixelOffset: new Cesium.Cartesian2(0, -10),
                eyeOffset: new Cesium.Cartesian3(0, 0, -10),
                // 显示在距相机的距离处的属性，多少区间内是可以显示的
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            show: false,
        })
    }

    calculatePoint(point, radius = 1000) {
        const [lng, lat] = point
        //四个方位与半径相交的点坐标
        //东
        const east = get_another_point(lng, lat, 90, radius)
        //南
        const south = get_another_point(lng, lat, 180, radius)
        //西
        const west = get_another_point(lng, lat, 270, radius)
        //北
        const north = get_another_point(lng, lat, 0, radius)
        return [east, north, west, south]
    }

    //绘制圆弧
    drawArc() {
        const [lng, lat] = this.pointList, radius = this.radius, pointList = []
        for (let i = 0; i < 361; i += 10) {
            const point = get_another_point(lng, lat, i, radius)
            pointList.push(point)
        }
        this.circleArcEntity = this.MapViewer.entities.add({
            circleId: this.circleId,
            markName: this.markName,
            polyline: new Cesium.PolylineGraphics({
                positions: new Cesium.CallbackProperty(function () {
                    return pointList.map((item) => {
                        return Cesium.Cartesian3.fromDegrees(item[0], item[1]);
                    });
                }, false),
                width: 10,
                material: Cesium.Color.fromCssColorString(this.color).withAlpha(this.transparency / 100),
                // 显示在距相机的距离处的属性，多少区间内是可以显示的
                clampToGround: true,
                // 是否显示
                show: true,
            })
        })
        this.drawRadiusLine([this.pointList], this.radius)
    }
    //修改更新半径
  async  updatePosition() {

        if (this.circleArcEntity) {
            const [lng, lat] = this.pointList, radius = this.radius, pointList = []
            for (let i = 0; i < 361; i += 10) {
                const point = get_another_point(lng, lat, i, radius)
                pointList.push(point)
            }
            this.circleArcEntity.polyline.positions=new Cesium.CallbackProperty(function () {
                return pointList.map((item) => {
                    return Cesium.Cartesian3.fromDegrees(item[0], item[1]);
                });
            }, false)
        }
        if(this.radiusLineEntity){
            const angle=  calcAngle(this.areaPointLineList)
            const [lng, lat] = get_another_point(this.areaPointLineList[0][0], this.areaPointLineList[0][1], angle[0]||0, this.radius)

            if(this.endPointEntity){
                this.areaPointLineList[1][0]=lng;
                this.areaPointLineList[1][1]=lat;
                this.endPointEntity.position = Cesium.Cartesian3.fromDegrees(lng, lat,this.areaPointLineList[1][2])
            }
            const left = Cesium.Cartesian3.fromDegrees(this.areaPointLineList[0][0], this.areaPointLineList[0][1],);
            const right = Cesium.Cartesian3.fromDegrees(lng, lat);
            this.radiusLineEntity.polyline.positions=Cesium.Cartesian3.fromDegreesArray([this.areaPointLineList[0][0], this.areaPointLineList[0][1], lng, lat])
            if(this.radiusDistanceLabelEntity){
                this.radiusDistanceLabelEntity.position=new Cesium.CallbackProperty(function () {
                    return Cesium.Cartesian3.midpoint(left, right, new Cesium.Cartesian3());
                }, false)
                this.radiusDistanceLabelEntity.label.text=`${this.radius}m`
            }
        }
    }
    //修改区域透明度
    updateTransparency(transparency) {
        this.transparency = transparency;
        this.circleEntity.ellipse.material = Cesium.Color.fromCssColorString(this.color).withAlpha(transparency / 100);
    }
    //修改半径
    updateEntity(radius) {
        this.radius = radius;
        this.circleEntity.ellipse.semiMajorAxis = new Cesium.CallbackProperty(function () {
            return radius
        }, false)
        this.circleEntity.ellipse.semiMinorAxis = new Cesium.CallbackProperty(function () {
            return radius
        }, false)
        if (this.radiusLineEntity) {
            this.MapViewer.entities.remove(this.radiusLineEntity);
            this.radiusLineEntity = null;
        }
        if (this.radiusDistanceLabelEntity) {
            this.MapViewer.entities.remove(this.radiusDistanceLabelEntity);
            this.radiusDistanceLabelEntity = null;
        }
        if (this.circleArcEntity) {
            this.MapViewer.entities.remove(this.circleArcEntity);
            this.circleArcEntity = null;
        }
        if(this.endPointEntity){
            this.MapViewer.entities.remove(this.endPointEntity);
            this.endPointEntity = null;
        }
        this.setDistance();
        this.drawArc();
    }

    addTextLabel() {
        this.circleTextLabelEntity = this.MapViewer.entities.add({
            circleId: this.circleId,
            markName: this.markName,
            label: {
                // 文本。支持显式换行符“ \ n”
                text: this.markName || '',
                // 字体样式，以CSS语法指定字体
                font: "12pt Source Han Sans CN",
                // 字体颜色
                fillColor: Cesium.Color.fromCssColorString('#2D8CF0'),
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 6,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                scale: 1.0,
                // 设置样式：FILL：填写标签的文本，但不要勾勒轮廓；OUTLINE：概述标签的文本，但不要填写；FILL_AND_OUTLINE：填写并概述标签文本。
                // style: Cesium.LabelStyle.FILL,
                // 相对于坐标的水平位置
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                // 相对于坐标的水平位置
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
                pixelOffset: new Cesium.Cartesian2(0, 0),
                eyeOffset: new Cesium.Cartesian3(0, 0, -100),
                // 显示在距相机的距离处的属性，多少区间内是可以显示的
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                // 是否显示
                show: true,
            },
            position: new Cesium.CallbackProperty(() => {
                return Cesium.Cartesian3.fromDegrees(this.pointList[0], this.pointList[1], this.pointList[2])
            }, false)
        })
    }

    editTextLabel(markName) {
        this.markName = markName || '';
        this.circleTextLabelEntity.label.text = markName;
        this.circleEntity.markName = markName;
        this.circleCenterPointEntity.markName = markName;
    }

    showAreaHighlight() {
        if (this.hasHighlight || this.hasDraw || this.hasEdit) {
            return
        }
        this.hasHighlight = true

        if (this.circleEntity) {
            this.circleEntity.ellipse.material = Cesium.Color.fromCssColorString(this.color).withAlpha(0.4)
        }
        if (this.radiusLineEntity) {
            this.radiusLineEntity.show = true
            this.radiusLineEntity.polyline.material.color = Cesium.Color.fromCssColorString('#fff')
        }
        if (this.circleArcEntity) {
            this.circleArcEntity.polyline.width = 12
        }
        if (this.radiusDistanceLabelEntity) {
            this.radiusDistanceLabelEntity.show = true
        }
    }

    removeAreaHighlight() {
        if (!this.hasHighlight || this.hasDraw || this.hasEdit) {
            return
        }
        this.hasHighlight = false
        if (this.radiusLineEntity) {
            this.radiusLineEntity.show = false
        }
        if (this.circleArcEntity) {
            this.circleArcEntity.polyline.width = 10
        }
        if (this.radiusDistanceLabelEntity) {
            this.radiusDistanceLabelEntity.show = false
        }
    }

    showHighlightOfEdit() {
        if(this.status){
            if (this.radiusDistanceLabelEntity) {
                this.radiusDistanceLabelEntity.show = this.hasEdit
            }
            if (this.radiusLineEntity) {
                this.radiusLineEntity.show = this.hasEdit
            }
            if(this.endPointEntity){
                this.endPointEntity.show=this.hasEdit
            }
            if(this.circleCenterPointEntity){
                this.circleCenterPointEntity.point.pixelSize=this.hasEdit?20:8
            }
            if (this.circleArcEntity) {
                let image
                if(this.hasEdit){
                    image= this.type===AREATYPE.DAFENCE_CIRCLE?focusPolygonLineImage:focusNoFlyPolygonLineImage
                }else{
                    image= this.type===AREATYPE.DAFENCE_CIRCLE?dafencePolygonLineImage:noFlyPolygonLineImage
                }
                this.circleArcEntity.polyline.material = Cesium.Color.fromCssColorString(this.color).withAlpha(this.transparency / 100)
                this.circleArcEntity.polyline.width = 10
            }
        }

    }

    update(options) {
        this.circleEntity.position = Cesium.Cartesian3.fromDegrees(options.longitude, options.latitude, options.height);
        this.circleEntity.ellipse.semiMajorAxis = options.semiMajorAxis;
        this.circleEntity.ellipse.semiMinorAxis = options.semiMinorAxis;
    }

    clear() {
        if (this.circleEntity) {
            this.MapViewer.entities.remove(this.circleEntity);
            this.circleEntity = null;
        }

        if (this.circleCenterPointEntity) {
            this.MapViewer.entities.remove(this.circleCenterPointEntity);
            this.circleCenterPointEntity = null;
        }

        if (this.circleTextLabelEntity) {
            this.MapViewer.entities.remove(this.circleTextLabelEntity);
            this.circleTextLabelEntity = null;
        }
        if (this.radiusLineEntity) {
            this.MapViewer.entities.remove(this.radiusLineEntity);
            this.radiusLineEntity = null;
        }
        if (this.radiusDistanceLabelEntity) {
            this.MapViewer.entities.remove(this.radiusDistanceLabelEntity);
            this.radiusDistanceLabelEntity = null;
        }
        if (this.circleArcEntity) {
            this.MapViewer.entities.remove(this.circleArcEntity);
            this.circleArcEntity = null;
        }
        if(this.endPointEntity){
            this.MapViewer.entities.remove(this.endPointEntity);
            this.endPointEntity = null;
        }
    }

    show() {
        if (this.circleEntity) {
            this.circleEntity.show = true;
        }

        if (this.circleCenterPointEntity) {
            this.circleCenterPointEntity.show = true;
        }
        if (this.circleTextLabelEntity) {
            this.circleTextLabelEntity.show = true;
        }
        if (this.circleArcEntity) {
            this.circleArcEntity.show = true
        }
    }

    hidden() {

        if (this.circleEntity) {
            this.circleEntity.show = false;
        }

        if (this.circleCenterPointEntity) {
            this.circleCenterPointEntity.show = false;
        }
        if (this.circleTextLabelEntity) {
            this.circleTextLabelEntity.show = false;
        }
        if (this.circleArcEntity) {
            this.circleArcEntity.show = false
        }
    }
    hasPointInArea(point) {
        const centerCartographic = Cesium.Cartographic.fromDegrees(this.pointList[0], this.pointList[1]);
        const centerCartesian = Cesium.Ellipsoid.WGS84.cartographicToCartesian(centerCartographic);
        const pointCartographic = Cesium.Cartographic.fromDegrees(point[0], point[1]);
        const pointCartesian = Cesium.Ellipsoid.WGS84.cartographicToCartesian(pointCartographic);
        // 计算点到圆心的距离
        const distance = Cesium.Cartesian3.distance(pointCartesian, centerCartesian);
        // 检查点是否在圆内
        return distance <= this.radius;
    }
    calculate(){
        this.areaArea = Math.round(3.14 * Math.pow(this.radius, 2))
        this.circumference = Math.round(2 * 3.14 * this.radius)
    }
}


export default CreateCircleEntity;
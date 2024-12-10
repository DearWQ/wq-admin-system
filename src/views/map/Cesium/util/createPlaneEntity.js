import checkPoint from "@/assets/pointCheck.svg";
import * as turf from "@turf/turf";
import * as Cesium from "cesium";
class CreatePlaneEntity {
//类型
    static MARKTYPE='surface'
    constructor(options) {
        //cesium实例
        this.MapViewer = options.viewer
        //多边形
        this.polygon = options.polygon;
        //线段
        this.polyline = options.polyline;
        //实例ID
        this.markId = options.markId;
        this.display = options.display;
        //当前实例
        this.planeEntity = null
        //区域名字
        this.markName = (options.markName || '区域');
        //区域点集合
        this.pointList = []
        //端点集合
        this.pointEntityList = [];
        //显示当前区域名字
        this.textLabelEntity = null;
        this.pointArea = 0
        this.circumference = 0
        //透明度
        this.transparency = options.transparency || 30
        this.color = options.color
        //是否选中编辑高亮
        this.hasHighlight=false
    }

    createPlane(options) {
        options = clearEmptyParam({polygon: this.polygon, polyline: this.polyline, markId: "plane_"+this.markId, ...options})
        this.planeEntity = this.MapViewer.entities.add(options);
    }

    // 添加端点
    addPoint(position) {
        if (this.pointEntityList.length > 0) {
            this.pointEntityList.forEach(intersection => {
                intersection.billboard = null
                intersection.hasCheck = false
                intersection.point = {
                    color: new Cesium.Color.fromCssColorString("#fff"),
                    pixelSize: 14,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    clampToGround: true,
                }
            })
        }
        if (this.pointEntityList.length < 2) {
            this.pointEntityList.push(this.MapViewer.entities.add({
                point: {
                    color: new Cesium.Color.fromCssColorString("#fff"),
                    pixelSize: 14,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    clampToGround: true,
                },
                show: true,
                pointId: 'point_' + new Date().getTime(),
                markId: 'point_'+this.markId,
                position: new Cesium.CallbackProperty(function () {
                    return Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2])
                }, false),
            }))
        } else {
            this.pointEntityList.push(this.MapViewer.entities.add({
                billboard: {
                    width: 18,
                    height: 18,
                    image: checkPoint, // 图片路径
                    scale: 1, // 缩放比例
                    // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
                    // 显示在距相机的距离处的属性，多少区间内是可以显示的
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    clampToGround: true,
                },
                show: true,
                hasCheck: true,//是否是确认点
                pointId: 'point_' + new Date().getTime(),
                position: new Cesium.CallbackProperty(function () {
                    return Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2])
                }, false),
                markId: 'point_'+ this.markId,

            }))
        }
    }

    updatePoint() {
        if (this.pointEntityList.length > 0) {
            this.pointEntityList.forEach(intersection => {
                intersection.billboard = null
                intersection.hasCheck = false
                intersection.point = {
                    color: new Cesium.Color.fromCssColorString("#fff"),
                    pixelSize: 14,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                }
            })
        }
    }

    addTextLabel(options) {
        this.textLabelEntity = this.MapViewer.entities.add({
            markId: 'text_'+this.markId,
            label: {
                // 文本。支持显式换行符“ \ n”
                text: this.markName || '',
                // 字体样式，以CSS语法指定字体
                font: "12pt Source Han Sans CN",
                // 字体颜色
                fillColor: Cesium.Color.fromCssColorString(this.color),
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
                // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                // 是否显示
                show: true,
            },
            show: true,
            ...options,
        })
        this.circumference = calculateCircumference(this.pointList);
        this.pointArea = calculateArea([this.pointList]);

    }

    calculate() {
        this.pointArea = calculateArea([this.pointList]);
        this.circumference = calculateCircumference(this.pointList);
    }

    //修改名字
    editTextName(labelName) {
        this.markName = labelName || '';
        this.textLabelEntity.label.text = labelName || '';
    }

    editColor(color, opacity = 0.5) {
        this.color = color;
        if (this.planeEntity.polygon) {
            this.planeEntity.polygon.material = Cesium.Color.fromCssColorString(color).withAlpha(opacity);
        }
        if (this.planeEntity.polyline) {
            this.planeEntity.polyline.material = Cesium.Color.fromCssColorString(color).withAlpha(opacity);
        }
        if(this.textLabelEntity){
            this.textLabelEntity.label.fillColor = Cesium.Color.fromCssColorString(color).withAlpha(opacity);
        }
    }

    //更新区域位置
    async updateEntity(pointList) {
        this.planeEntity.polygon.hierarchy = new Cesium.CallbackProperty(function () {
            return new Cesium.PolygonHierarchy(
                pointList.map((item) => {
                    return Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2]);
                })
            );
        }, false)
        this.planeEntity.polyline.positions = new Cesium.CallbackProperty(function () {
            return pointList.map((item) => {
                return Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2]);
            });
        }, false)

        pointList.forEach((item, i) => {
            this.pointEntityList[i].position = new Cesium.CallbackProperty(function () {
                return Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2])
            }, false)
        })

        let polygon = turf.polygon([pointList]);
        let center = turf.centroid(polygon).geometry.coordinates;
        let updatedPositions = await Cesium.sampleTerrainMostDetailed(
            this.MapViewer.terrainProvider,
            [Cesium.Cartographic.fromDegrees(center[0], center[1])]
        );

        this.textLabelEntity.position = Cesium.Cartesian3.fromDegrees(
            center[0],
            center[1],
            updatedPositions[0].height
        )

    }

    updateHeight(height){
        if (this.planeEntity.polygon) {
            this.planeEntity.polygon.extrudedHeight=height
        }
        if(this.textLabelEntity){
            let minHeight=this.pointList[0][2]
            this.pointList.forEach(item=>Math.min(minHeight,item[2]))
            let polygon = turf.polygon([this.pointList]);
            let center = turf.centroid(polygon).geometry.coordinates;
            this.textLabelEntity.position= Cesium.Cartesian3.fromDegrees(center[0], center[1], (minHeight + (height || 0))/2)
        }
    }

    showHighlight() {
        if(!this.display)return;
        if(this.hasHighlight)return
        if (this.planeEntity&&this.planeEntity.polyline) {
            this.planeEntity.polyline.width = 4
            if (this.pointEntityList.length > 0) {
                this.pointEntityList.forEach(intersection => {
                    intersection.billboard = null
                    intersection.hasCheck = false
                    intersection.show=true
                    intersection.point = {
                        color: new Cesium.Color.fromCssColorString("#fff"),
                        pixelSize: 14,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    }
                })
            }else{
                this.pointEntityList = []
                this.pointList.forEach(item=>{
                    this.pointEntityList.push(this.MapViewer.entities.add({
                        markId: 'point_'+this.markId,
                        point: {
                            color: new Cesium.Color.fromCssColorString("#fff"),
                            pixelSize: 12,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY,
                        },
                        show: true,
                        hasCheck: false,//是否是确认点
                        pointId: 'point_'+ new Date().getTime(),
                        position: new Cesium.CallbackProperty(function () {
                            return Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2])
                        }, false),
                    }))
                })
            }
        }

    }

    removeHighlight() {
        if (this.planeEntity&&this.planeEntity.polyline) {
            this.planeEntity.polyline.width = 4
        }
        if (this.pointEntityList.length > 0) {
            this.pointEntityList.forEach(intersection => {
                intersection.billboard = null
                intersection.hasCheck = false
                intersection.show=false
            })
        }
        // this.editColor(this.color)
    }
    //修改区域透明度
    updateTransparency(transparency) {
        this.transparency = transparency;
        this.planeEntity.polygon.material = Cesium.Color.fromCssColorString(this.color).withAlpha(transparency / 100);
    }
    show(){
        if (this.planeEntity) {
            this.planeEntity.show = true
        }
        if(this.textLabelEntity){
            this.textLabelEntity.show = true
        }
        if (this.pointEntityList.length > 0) {
            this.pointEntityList.forEach(intersection => {
                intersection.show=true
            })
        }
    }
    hidden(){
        if (this.planeEntity) {
            this.planeEntity.show = false
        }
        if(this.textLabelEntity){
            this.textLabelEntity.show = false
        }
        if (this.pointEntityList.length > 0) {
            this.pointEntityList.forEach(intersection => {
                intersection.show=false
            })
        }
    }

    setAreaPointLine(pointList) {
        this.pointList = pointList
    }

    hasPointInArea(point) {
        return turf.booleanPointInPolygon(turf.point(point), turf.polygon([this.pointList]));
    }
    hover(){
        if (this.planeEntity&&this.planeEntity.polyline) {
            this.planeEntity.polyline.width = 6
        }
    }
    removeHover(){
        if (this.planeEntity&&this.planeEntity.polyline) {
            this.planeEntity.polyline.width = 4
        }
    }
    // 清除
    clear() {
        if (this.planeEntity) {
            this.MapViewer.entities.remove(this.planeEntity);
            this.planeEntity = null;
        }
        if (this.pointEntityList.length > 0) {
            this.pointEntityList.forEach(item => {
                this.MapViewer.entities.remove(item);
            })
        }
        if (this.textLabelEntity) {
            this.MapViewer.entities.remove(this.textLabelEntity);
            this.textLabelEntity = null;
        }
    }
}

const clearEmptyParam = (options) => {
    return Object.entries(options).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            acc[key] = value;
        }
        return acc;
    }, {});
}
const calculateArea = (data) => {
    let a = turf.area(turf.polygon(data));
    return Math.round(a);
};
const calculateCircumference = (data) => {
    let a = [];
    let d = 0;
    data.forEach((item, i) => {
        if (i > 0) {
            d += Cesium.Cartesian3.distance(
                Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2]),
                Cesium.Cartesian3.fromDegrees(a[0], a[1], a[2])
            );
        }
        a = item;
    });
    return Math.round(d);
};
export default CreatePlaneEntity
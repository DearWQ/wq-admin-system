
import checkPoint from "@/assets/pointCheck.svg";
import * as Cesium from "cesium";
class CreateLineEntity {
    //类型
    static MARKTYPE='line'
    constructor(options) {
        //cesium实例
        this.MapViewer = options.viewer
        //线的实例ID
        this.markId = options.markId;
        //线的名字
        this.markName = options.markName;
        //线的交点
        this.pointList = []
        this.display = options.display||true;
        //
        this.lineEntity = null;
        //
        this.lineTextLabelEntity = null;
        this.pointEntityList=[]
        //
        this.lineColor = options.lineColor;
        //是否选中编辑高亮
        this.hasHighlight=false
    }

    createLine(polyline) {
        this.lineEntity = this.MapViewer.entities.add({
            polyline,
            markId: "line_" + this.markId,
            show:this.display
        });
    }

    //保存点列表
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
        if (this.pointEntityList.length < 1) {
            this.pointEntityList.push(this.MapViewer.entities.add({
                point: {
                    color: new Cesium.Color.fromCssColorString("#fff"),
                    pixelSize: 14,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    clampToGround: true,
                },
                show: true,
                markId: "point_" + this.markId,
                pointId: 'point_' + new Date().getTime(),
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
                markId: "point_" + this.markId,
                pointId: 'point_' + new Date().getTime(),
                position: new Cesium.CallbackProperty(function () {
                    return Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2])
                }, false),
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


    createTextLabel() {
        const [lng, lat,height] = this.pointList[Math.ceil(this.pointList.length / 2)];
        this.lineTextLabelEntity = this.MapViewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(lng, lat,height),
            label: {
                // 文本。支持显式换行符“ \ n”
                text: this.markName,
                // 字体样式，以CSS语法指定字体
                font: "12pt Source Han Sans CN",
                // 字体颜色
                fillColor: Cesium.Color.fromCssColorString(this.lineColor),
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
                // 显示在距相机的距离处的属性，多少区间内是可以显示的
                // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500),
                // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                // 是否显示
                show: true,
            },
            markId: "lineText_"+this.markId,
            show:this.display
        });
    }

    editTextName(markName) {
        this.markName = markName;
        this.lineTextLabelEntity.label.text = markName;
    }

    editColor(color) {
        this.lineColor = color;
        this.lineEntity.polyline.material = Cesium.Color.fromCssColorString(color)
        this.lineTextLabelEntity.label.fillColor = Cesium.Color.fromCssColorString(color);
    }
    showHighlight(){
        if(!this.display)return;
        if(this.hasHighlight)return
        this.lineEntity.polyline.width=4;
        if(this.pointEntityList.length>0){
            this.pointEntityList.forEach(item=>{
                item.show=true
                item.billboard = null
                item.point = {
                    color: new Cesium.Color.fromCssColorString("#fff"),
                    pixelSize: 14,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    clampToGround: true,
                }
            })
        }else{
            if(this.pointList.length>0){
                this.pointList.forEach(item=>{
                    this.pointEntityList.push(this.MapViewer.entities.add({
                        point: {
                            color: new Cesium.Color.fromCssColorString("#fff"),
                            pixelSize: 14,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY,
                            clampToGround: true,
                        },
                        show: true,
                        markId: "point_" + this.markId,
                        pointId: 'point_' + new Date().getTime(),
                        position: new Cesium.CallbackProperty(function () {
                            return Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2])
                        }, false),
                    }))
                })
            }
        }
        this.hasHighlight=true
    }
    removeHighlight(){
        this.lineEntity.polyline.width=4;
        if(this.pointEntityList.length>0){
            this.pointEntityList.forEach(item=>{
                item.show=false
                if(item.point){
                    item.point.pixelSize=10
                }
            })
        }
    }
    hover(){
        this.lineEntity.polyline.width=6;
    }
    removeHover(){
        this.lineEntity.polyline.width=4;
    }
    show(){
        if(this.lineEntity){
            this.lineEntity.show=true
        }
        if(this.lineTextLabelEntity){
            this.lineTextLabelEntity.show=true
        }
        if(this.pointEntityList.length>0){
            this.pointEntityList.forEach(item=>{
                item.show=true
                item.point.pixelSize=14
            })
        }
    }
    hidden(){
        if(this.lineEntity){
            this.lineEntity.show=false
        }
        if(this.lineTextLabelEntity){
            this.lineTextLabelEntity.show=false
        }
        if(this.pointEntityList.length>0){
            this.pointEntityList.forEach(item=>{
                item.show=false
                item.point.pixelSize=10
            })
        }
    }
    clear(){
        if(this.lineEntity){
            this.MapViewer.entities.remove(this.lineEntity);
        }
        if(this.lineTextLabelEntity){
            this.MapViewer.entities.remove(this.lineTextLabelEntity);
        }
        if(this.pointEntityList.length>0){
            this.pointEntityList.forEach(item=>{
                this.MapViewer.entities.remove(item)
            })
        }
    }
}

export default CreateLineEntity
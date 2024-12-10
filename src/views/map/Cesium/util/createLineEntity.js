
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
            markId: this.markId,
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
                markId: this.markId,
                pointId: 'point_' + Cesium.createGuid(),
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
                markId: this.markId,
                pointId: 'point_' + Cesium.createGuid(),
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
        const [lng, lat,height] = this.pointList[Math.floor(this.pointList.length / 2)];
        let  position=new Cesium.CallbackProperty(function () {
            return Cesium.Cartesian3.fromDegrees(lng, lat,height)
        }, false)
        if(this.pointList.length%2===0){
            const index=Math.floor(this.pointList.length / 2);
            const left=Cesium.Cartesian3.fromDegrees(this.pointList[index-1][0], this.pointList[index-1][1],this.pointList[index-1][2]);
            const right=Cesium.Cartesian3.fromDegrees(this.pointList[index][0], this.pointList[index][1],this.pointList[index][2]);
            position=new Cesium.CallbackProperty(function () {
                return Cesium.Cartesian3.midpoint(left, right, new Cesium.Cartesian3());
            }, false)
        }
        this.lineTextLabelEntity = this.MapViewer.entities.add({
            position,
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
            markId: this.markId,
            show:this.display
        });
    }
    //更新区域位置
    async updateEntity(pointList) {
        this.lineEntity.polyline.positions = new Cesium.CallbackProperty(function () {
            return pointList.map((item) => {
                return Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2]);
            });
        }, false)
        const [lng, lat,height] = this.pointList[Math.floor(this.pointList.length / 2)];
        let position=new Cesium.CallbackProperty(function () {
            return Cesium.Cartesian3.fromDegrees(lng, lat,height)
        }, false)
        if(this.pointList.length%2===0){
            const index=Math.floor(this.pointList.length / 2);
            const left=Cesium.Cartesian3.fromDegrees(this.pointList[index-1][0], this.pointList[index-1][1],this.pointList[index-1][2]);
            const right=Cesium.Cartesian3.fromDegrees(this.pointList[index][0], this.pointList[index][1],this.pointList[index][2]);
            position=new Cesium.CallbackProperty(function () {
                return Cesium.Cartesian3.midpoint(left, right, new Cesium.Cartesian3());
            }, false)
        }

        this.lineTextLabelEntity.position=position
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
                        markId:this.markId,
                        pointId: 'point_' + Cesium.createGuid(),
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
    editHandle() {
        if(!this.handle){
            this.handle=new Cesium.ScreenSpaceEventHandler(this.MapViewer.scene.canvas);
        }

        let clickPoint,
            cartographic,
            pointMoveIndex,
            hasAreaPointMove=false,
            clickPosition = {lng: "", lat: "", height: ""};
        this.handle.setInputAction((e) => {
            clickPoint = this.MapViewer.scene.pick(e.position);
            if (!clickPoint || !clickPoint?.id?.pointId) return;
            hasAreaPointMove=true
            //获取当前移动点的索引
            pointMoveIndex = this.pointEntityList.findIndex(
                (item) => item.pointId === clickPoint.id.pointId
            );
            this.MapViewer.scene.screenSpaceCameraController.enableRotate = false;
            const markPotions = clickPoint.id.position;
            let originalPosition = markPotions.getValue(Cesium.JulianDate.now());
            // 转换笛卡尔坐标为地理坐标
            cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(originalPosition);
            //获取标注点的经纬度
            clickPosition.lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
            clickPosition.lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
            clickPosition.height = cartographic.height;
            //修改鼠标样式
            this.MapViewer.container.style.cursor = "grabbing";
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        this.handle.setInputAction(async (movement) => {
            const position = movement.endPosition; // arg有startPosition与endPosition两个属性，即移动前后的位置信息：Cartesian2对象
            if (!position||!hasAreaPointMove) return;
            let ray = this.MapViewer.camera.getPickRay(position); //获取一条射线
            let movePosition = this.MapViewer.scene.globe.pick(ray, this.MapViewer.scene);
            let movePositionInfo = Cesium.Cartographic.fromCartesian(movePosition);
            clickPosition.lng = Cesium.Math.toDegrees(movePositionInfo.longitude);
            clickPosition.lat = Cesium.Math.toDegrees(movePositionInfo.latitude);
            clickPosition.height = movePositionInfo.height;

            console.log(clickPoint?.id?.pointId)
            //鼠标移动的是否是点
            if (clickPoint?.id&&clickPoint?.id?.pointId) {

                //更新当前点Entity的位置
                clickPoint.id.position = Cesium.Cartesian3.fromDegrees(
                    clickPosition.lng,
                    clickPosition.lat,
                    clickPosition.height
                );
                //更改当前选中区域Entity的集合点中所选择点的坐标
                this.pointList[pointMoveIndex] = [
                    clickPosition.lng,
                    clickPosition.lat,
                    clickPosition.height,
                ];
                //当前移动的是第一个点，则更新最后一个点的位置也要更新形成闭环
                if (pointMoveIndex === 0) {
                    this.pointList[
                    this.pointList.length - 1
                        ] = [clickPosition.lng, clickPosition.lat, clickPosition.height];
                }
                //当前移动的是最后一个点，则更新第一个点的位置也要更新形成闭环
                if (pointMoveIndex === this.pointList.length - 1) {
                    this.pointList[0] = [
                        clickPosition.lng,
                        clickPosition.lat,
                        clickPosition.height,
                    ];
                }
                //最后整体更新区域的坐标
                await this.updateEntity(this.pointList);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handle.setInputAction((movement) => {
            this.MapViewer.scene.screenSpaceCameraController.enableRotate = true;
            hasAreaPointMove=false
            this.MapViewer.container.style.cursor = "default";
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
    }
    removeHandle(){
        if(this.handle){
            this.handle.destroy()
            this.handle=null
        }
    }
}

export default CreateLineEntity
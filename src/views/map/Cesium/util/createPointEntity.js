import * as Cesium from "cesium";
class CreatePointEntity {
    //类型
    static MARKTYPE='point'
    constructor(options) {
        //cesium实例
        this.MapViewer = options.viewer
        //点的实例ID
        this.markId=options.markId;
        //markName
        this.markName=options.markName;
        //点配置
        this.pointConfig=options.pointConfig;
        //
        this.pointList=options.pointList;
        //点实例
        this.poinEntity=null;
        //文本
        this.pointTextEntity=null;
        this.display=options.display;
        //
        this.color=options.color;
        //点图片
        this.pointImage=options.pointImage;
        //文本图片
        this.pointTextImage=options.pointTextImage;
    }
    createPoint(){
        this.poinEntity= this.MapViewer.entities.add({
            ...this.pointConfig,
            position:  Cesium.Cartesian3.fromDegrees(this.pointList[0], this.pointList[1], this.pointList[2]),
            label: {
                // 文本。支持显式换行符“ \ n”
                text: this.markName,
                // 字体样式，以CSS语法指定字体
                font: "12px",
                // 字体颜色
                fillColor: Cesium.Color.fromCssColorString(this.color),
                outlineColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 6,
                scale: 1.0,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                // 相对于坐标的水平位置
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
                pixelOffset: new Cesium.Cartesian2(0, -30),
                // 显示在距相机的距离处的属性，多少区间内是可以显示的
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500),
                // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                // 是否显示
                show: true,
            },
            billboard: {
                // 图像地址，URI或Canvas的属性
                image: this.pointImage,
                // 设置颜色和透明度
                color: Cesium.Color.fromCssColorString(this.color),
                // 高度（以像素为单位）
                height: 30,
                // 宽度（以像素为单位）
                width: 30,
                // 逆时针旋转
                rotation: 0,
                // 大小是否以米为单位
                sizeInMeters: false,
                // 相对于坐标的垂直位置
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                // 相对于坐标的水平位置
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
                pixelOffset: new Cesium.Cartesian2(0, 0),
                // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
                scale: 1.0,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                show: true,
            },
            markId: "point_"+this.markId,
            show:this.display
        });
        this.pointTextEntity = this.MapViewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(this.pointList[0], this.pointList[1], this.pointList[2]),
            billboard: {
                // 图像地址，URI或Canvas的属性
                image: this.pointTextImage,
                // 设置颜色和透明度
                color: Cesium.Color.fromCssColorString(this.color),
                // 高度（以像素为单位）
                height: 30,
                // 宽度（以像素为单位）
                width: 30,
                // 逆时针旋转
                rotation: 0,
                // 大小是否以米为单位
                sizeInMeters: false,
                // 相对于坐标的垂直位置
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                // 相对于坐标的水平位置
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
                pixelOffset: new Cesium.Cartesian2(0, 0),
                // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
                scale: 1.0,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                show: true,
            },
            markId: "text_"+this.markId,
            show:this.display
        });
    }
    editTextName(markName) {
        this.markName=markName;
        this.poinEntity.label.text = markName;
    }
    editColor(color) {
        this.color=color;
        this.poinEntity.label.fillColor=Cesium.Color.fromCssColorString(color);
        this.poinEntity.billboard.color=Cesium.Color.fromCssColorString(color);
        this.pointTextEntity.billboard.color=Cesium.Color.fromCssColorString(color);
    }
    updatePosition(position){
        this.poinEntity.position= Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]);
        this.pointTextEntity.position= Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]);
    }
    showHighlight(){
    }
    removeHighlight(){

    }
    hover(){
        this.poinEntity.billboard.scale=1.2
    }
    removeHover(){
        this.poinEntity.billboard.scale=1
    }
    show(){
        if(this.poinEntity){
            this.poinEntity.show=true
        }
        if(this.pointTextEntity){
            this.pointTextEntity.show=true
        }
    }
    hidden(){
        if(this.poinEntity){
            this.poinEntity.show=false
        }
        if(this.pointTextEntity){
            this.pointTextEntity.show=false
        }
    }
    clear(){
        if(this.poinEntity){
            this.MapViewer.entities.remove(this.poinEntity);
        }
        if(this.pointTextEntity){
            this.MapViewer.entities.remove(this.pointTextEntity);
        }
    }
    editHandle() {
        if(!this.handle){
            this.handle=new Cesium.ScreenSpaceEventHandler(this.MapViewer.scene.canvas);
        }

        let clickPoint,
            hasAreaPointMove=false,
            clickPosition = {lng: "", lat: "", height: ""};
        this.handle.setInputAction((e) => {
            clickPoint = this.MapViewer.scene.pick(e.position);
            if (!clickPoint || !clickPoint?.id?.pointId) return;
            hasAreaPointMove=true
            this.MapViewer.scene.screenSpaceCameraController.enableRotate = false;
            let { lng, lat, alt } =  pickElevationInfo(this.MapViewer, e.position);
            //获取标注点的经纬度
            clickPosition.lng = lng; // 经度
            clickPosition.lat = lat; // 纬度
            clickPosition.height = alt;
            //修改鼠标样式
            this.MapViewer.container.style.cursor = "grabbing";
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        this.handle.setInputAction(async (movement) => {
            const position = movement.endPosition; // arg有startPosition与endPosition两个属性，即移动前后的位置信息：Cartesian2对象
            if (!position||!hasAreaPointMove) return;
            let { lng, lat, alt } =  pickElevationInfo(this.MapViewer, movement.endPosition);
            console.log(alt)
            //获取标注点的经纬度
            clickPosition.lng = lng; // 经度
            clickPosition.lat = lat; // 纬度
            clickPosition.height = alt;
            //鼠标移动的是否是点
            if (clickPoint?.id&&clickPoint?.id?.pointId) {

                //更新当前点Entity的位置
                clickPoint.id.position = Cesium.Cartesian3.fromDegrees(
                    clickPosition.lng,
                    clickPosition.lat,
                    clickPosition.height
                );
                //更改当前选中区域Entity的集合点中所选择点的坐标
                this.pointPosition = [
                    clickPosition.lng,
                    clickPosition.lat,
                    clickPosition.height,
                ];
                //最后整体更新区域的坐标
                await this.updatePosition(this.pointPosition);
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

export default CreatePointEntity
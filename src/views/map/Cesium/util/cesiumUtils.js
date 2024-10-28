import * as Cesium from "cesium";

/**
 * 设置显示图层等级
 * @param level
 */
export function getAltitudeByLevel(level) {
    const A = 40487.57;
    const B = 0.00007096758;
    const C = 91610.74;
    const D = -40467.74;
    const E = A - D;
    // 计算 altitude
    const altitude = C * Math.pow(E / (level - D) - 1, 1 / B);
    return Math.round(altitude);
}

/**
 * 拾取点击位置的经纬度、高度
 * @param _viewer_ 当前视图实例
 * @param clickPosition 当前点击位置x,y坐标
 * @return {{hasExitModel: boolean, lng, alt, terrainHeight, lat}}
 */
export const pickElevationInfo = (_viewer_, clickPosition) => {
    let lng, lat, height, terrainHeight, hasExitModel = false, pickedFeature = _viewer_.scene.pick(clickPosition);
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
            let cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
            height = cartographic.height; // 高度绘制标注时的高度
            lat = Cesium.Math.toDegrees(cartographic.latitude);
            lng = Cesium.Math.toDegrees(cartographic.longitude);
            hasExitModel = true
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
        hasExitModel,
    };
}


/**
 * 获取高程高度
 * @param viewer
 * @param clickPosition
 */
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
        height: cartographic.height
    }
}

/**
 * 根据两个点计算角度和距离
 * @param p 经纬度坐标数组
 * @return {[number,number]}
 */
export const calcAngle = (p) => {
    const left = p[0], right = p[1]
    let A = Cesium.Cartesian3.fromDegrees(left[0], left[1]);
    let B = Cesium.Cartesian3.fromDegrees(right[0], right[1]);
    let ab = Cesium.Cartesian3.distance(A, B);

    //以a点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
    const localToWorld = Cesium.Transforms.eastNorthUpToFixedFrame(
        new Cesium.Cartesian3.fromDegrees(left[0], left[1])
    );
    //求世界坐标到局部坐标的变换矩阵
    const worldToLocal = Cesium.Matrix4.inverse(
        localToWorld,
        new Cesium.Matrix4()
    );
    //A点在局部坐标的位置，其实就是局部坐标原点
    const localPosition_A = Cesium.Matrix4.multiplyByPoint(
        worldToLocal,
        new Cesium.Cartesian3.fromDegrees(left[0], left[1]),
        new Cesium.Cartesian3()
    );
    //B点在以A点为原点的局部的坐标位置
    const localPosition_B = Cesium.Matrix4.multiplyByPoint(
        worldToLocal,
        new Cesium.Cartesian3.fromDegrees(right[0], right[1]),
        new Cesium.Cartesian3()
    );
    //弧度
    const angle = Math.atan2(
        localPosition_B.x - localPosition_A.x,
        localPosition_B.y - localPosition_A.y
    );
    //角度
    let theta = Math.round(angle * (180 / Math.PI));
    if (theta < 0) {
        theta = theta + 360;
    }
    return [Math.abs(theta), ab];
}

/**
 * 根据经纬度角度和半径计算不同方位的半径与弧边相交的点
 * @param lon
 * @param lat
 * @param angle
 * @param distance
 * @return {number[]}
 */
export function get_another_point(lon, lat, angle, distance) {
    // WGS84坐标系
    let a = 6378137;	// 赤道半径
    let b = 6356752.3142;	// 短半径
    let f = 1 / 298.257223563;	// 扁率

    let alpha1 = angle * (Math.PI / 180)
    let sinAlpha1 = Math.sin(alpha1);
    let cosAlpha1 = Math.cos(alpha1);
    let tanU1 = (1 - f) * Math.tan(lat * (Math.PI / 180));
    let cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1;
    let sigma1 = Math.atan2(tanU1, cosAlpha1);
    let sinAlpha = cosU1 * sinAlpha1;
    let cosSqAlpha = 1 - sinAlpha * sinAlpha;
    let uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    let A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    let B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    let sigma = distance / (b * A), sigmaP = 2 * Math.PI;
    let sinSigma, cosSigma, deltaSigma, cos2SigmaM
    while (Math.abs(sigma - sigmaP) > 1e-12) {
        cos2SigmaM = Math.cos(2 * sigma1 + sigma);
        sinSigma = Math.sin(sigma);
        cosSigma = Math.cos(sigma);
        deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
            B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
        sigmaP = sigma;
        sigma = distance / (b * A) + deltaSigma;
    }

    let tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
    let lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
        (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp));
    let lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1);
    let C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
    let L = lambda - (1 - C) * f * sinAlpha *
        (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));

    // let revAz = Math.atan2(sinAlpha, -tmp); // final bearing

    return [Number(lon) + L * (180 / Math.PI), lat2 * (180 / Math.PI)];
}
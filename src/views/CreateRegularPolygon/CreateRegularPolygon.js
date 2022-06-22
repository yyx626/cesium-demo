/*
 * @Author: yyx
 * 创建正多边形
 * 可拆卸
 * @Date: 2022-06-22 
 */
import CreateRemindertip from "./ReminderTip";
const Cesium = window.Cesium;
const CreateRegularPolygon = function (viewer, resultList, options, callback) {
  if (!viewer) throw new Error("no viewer object!");
  options = options || {};
  let id = options.id || setSessionid();
  if (viewer.entities.getById(id))
    throw new Error("the id parameter is an unique value");
  let num = options.num && options.num > 2 ? options.num : 5; //默认绘制正五边形
  let color = options.color || Cesium.Color.RED;
  let outlineColor = color.withAlpha(1);
  let toolTip = "左键点击开始绘制";
  let anchorpoints = [];
  let centerPoint, centerP, pentagon;
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  handler.setInputAction(function (event) {
    toolTip = "右键结束绘制";
    if (Cesium.defined(pentagon)) {
      return;
    }
    let pixPos = event.position;
    centerPoint = getCatesian3FromPX(viewer, pixPos);
    centerP = transformCartesianToWGS84(viewer, centerPoint);
 
    let pointlist = calculatePoints(centerPoint, 1, num);
    anchorpoints = pointlist;
    let dynamicPositions = new Cesium.CallbackProperty(function () {
      return new Cesium.PolygonHierarchy(anchorpoints);
    }, false);
    pentagon = viewer.entities.add({
      name: "RegularPolygon",
      id: id,
      polygon: {
        hierarchy: dynamicPositions,
        material: color,
        outline: true,
        outlineColor: outlineColor,
        height: 0,
      },
    });
    pentagon.GeoType = "RegularPolygon";
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction(function (movement) {
    let endPos = movement.endPosition;
    CreateRemindertip(toolTip, endPos, true);
 
    if (Cesium.defined(pentagon)) {
      const endCartesian = getCatesian3FromPX(viewer, endPos);
      const endDegree = transformCartesianToWGS84(viewer, endCartesian);
      let distance = Cesium.Cartesian3.distance(
        new Cesium.Cartesian3.fromDegrees(centerP.lng, centerP.lat, 0),
        new Cesium.Cartesian3.fromDegrees(endDegree.lng, endDegree.lat, 0)
      );
      let pointlist = calculatePoints(centerPoint, distance, num);
      anchorpoints = pointlist;
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.setInputAction(function (event) {
    pentagon.pottingPoint = anchorpoints;
    resultList.push(pentagon);
    handler.destroy();
    CreateRemindertip(toolTip, event.position, false);
    if (typeof callback == "function") callback(pentagon);
  }, Cesium.ScreenSpaceEventType.RIGHT_DOWN);
};
function calculatePoints(centerPoint, distance, num) {
  let ellipse = new Cesium.EllipseOutlineGeometry({
    center: centerPoint,
    semiMajorAxis: distance,
    semiMinorAxis: distance,
    granularity: 0.0001, //0~1 圆的弧度角,该值非常重要,默认值0.02,如果绘制性能下降，适当调高该值可以提高性能
  });
  let geometry = new Cesium.EllipseOutlineGeometry.createGeometry(ellipse);
  let circlePoints = [];
  let values = geometry.attributes.position.values;
  if (!values) return;
  let posNum = values.length / 3; //数组中以笛卡尔坐标进行存储(每3个值一个坐标)
  for (let i = 0; i < posNum; i++) {
    let curPos = new Cesium.Cartesian3(
      values[i * 3],
      values[i * 3 + 1],
      values[i * 3 + 2]
    );
    circlePoints.push(curPos);
  }
  let resultPoints = [];
  let pointsapart = Math.floor(circlePoints.length / num);
  for (let j = 0; j < num; j++) {
    resultPoints.push(circlePoints[j * pointsapart]);
  }
  return resultPoints;
}
function getCatesian3FromPX(viewer, px) {
  let picks = viewer.scene.drillPick(px);
  let cartesian = null;
  let isOn3dtiles = false,
    isOnTerrain = false;
  // drillPick
  for (let i in picks) {
    let pick = picks[i];
    if (
      (pick && pick.primitive instanceof Cesium.Cesium3DTileFeature) ||
      (pick && pick.primitive instanceof Cesium.Cesium3DTileset) ||
      (pick && pick.primitive instanceof Cesium.Model)
    ) {
      //模型上拾取
      isOn3dtiles = true;
    }
    // 3dtilset
    if (isOn3dtiles) {
      viewer.scene.pick(px);
      cartesian = viewer.scene.pickPosition(px);
      if (cartesian) {
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        if (cartographic.height < 0) cartographic.height = 0;
        let lon = Cesium.Math.toDegrees(cartographic.longitude),
          lat = Cesium.Math.toDegrees(cartographic.latitude),
          height = cartographic.height;
        cartesian = transformWGS84ToCartesian(viewer, {
          lng: lon,
          lat: lat,
          alt: height,
        });
      }
    }
  }
  // 地形
  let boolTerrain =
    viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider;
  // Terrain
  if (!isOn3dtiles && !boolTerrain) {
    let ray = viewer.scene.camera.getPickRay(px);
    if (!ray) return null;
    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    isOnTerrain = true;
  }
  // 地球
  if (!isOn3dtiles && !isOnTerrain && boolTerrain) {
    cartesian = viewer.scene.camera.pickEllipsoid(
      px,
      viewer.scene.globe.ellipsoid
    );
  }
  if (cartesian) {
    let position = transformCartesianToWGS84(viewer, cartesian);
    if (position.alt < 0) {
      cartesian = transformWGS84ToCartesian(viewer, position, 0.1);
    }
    return cartesian;
  }
  return false;
}
 
/***
 * 坐标转换 84转笛卡尔
 * @param {Object} {lng,lat,alt} 地理坐标
 * @return {Object} Cartesian3 三维位置坐标
 */
function transformWGS84ToCartesian(viewer, position, alt) {
  return position
    ? Cesium.Cartesian3.fromDegrees(
        position.lng || position.lon,
        position.lat,
        (position.alt = alt || position.alt),
        Cesium.Ellipsoid.WGS84
      )
    : Cesium.Cartesian3.ZERO;
}
 
/***
 * 坐标转换 笛卡尔转84
 * @param {Object} Cartesian3 三维位置坐标
 * @return {Object} {lng,lat,alt} 地理坐标
 */
function transformCartesianToWGS84(viewer, cartesian) {
  let ellipsoid = Cesium.Ellipsoid.WGS84;
  let cartographic = ellipsoid.cartesianToCartographic(cartesian);
  return {
    lng: Cesium.Math.toDegrees(cartographic.longitude),
    lat: Cesium.Math.toDegrees(cartographic.latitude),
    alt: cartographic.height,
  };
}
function setSessionid(num) {
  let len = num || 32;
  let chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  let maxPos = chars.length;
  let pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
export default CreateRegularPolygon;
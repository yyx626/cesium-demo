/*
 * 剖面分析
 * 可拆卸
 * @Author: yyx
 * @Date: 2022-06-23
 */
import CreatePolyline from "./CreatePolyline";
const Cesium = window.Cesium;
const ProfileAnalysis = function (viewer, callback) {
  if (!viewer) throw new Error("no viewer object!");
  if (window.profileEntities && window.profileEntities.length > 0) {
    window.profileEntities.forEach((element) => {
      window.viewer.entities.remove(element);
    });
  }
  window.profileEntities = [];
  CreatePolyline(
    viewer,
    window.profileEntities,
    { color: Cesium.Color.RED, width: 2 },
    function (e) {
      e.polyline.clampToGround = true;
      console.log(e.pottingPoint);
      let points = interPoints(viewer, e.pottingPoint, [e]);
      console.log(points);
      if (typeof callback == "function") callback(points);
    }
  );
};
/**
 * 线段插值点
 * @param {*} viewer
 * @param {*} positions 线段节点集合
 * @param {*} objectsToExclude 高度采集时排除的对象集合
 * @returns 经纬度点集合，包含距离值
 */
function interPoints(viewer, positions, objectsToExclude) {
  let positionsCartographic = [];
  let terrainSamplePositions = [];
  for (let index = 0; index < positions.length; index++) {
    const element = positions[index];
    let ellipsoid = viewer.scene.globe.ellipsoid;
    let cartographic = ellipsoid.cartesianToCartographic(element);
    positionsCartographic.push(cartographic);
  }
  for (let i = 0; i < positionsCartographic.length; i++) {
    const m_Cartographic0 = positionsCartographic[i];
    const m_Cartographic1 = positionsCartographic[i + 1];
    if (m_Cartographic1) {
      let a =
        Math.abs(m_Cartographic0.longitude - m_Cartographic1.longitude) *
        10000000;
      let b =
        Math.abs(m_Cartographic0.latitude - m_Cartographic1.latitude) *
        10000000;
      //等距采样
      if (a > b) b = a;
      let length = parseInt(b / 2);
      if (length > 1000) length = 1000;
      if (length < 2) length = 2;
      for (let j = 0; j < length; j++) {
        terrainSamplePositions.push(
          new Cesium.Cartographic(
            Cesium.Math.lerp(
              m_Cartographic0.longitude,
              m_Cartographic1.longitude,
              j / (length - 1)
            ),
            Cesium.Math.lerp(
              m_Cartographic0.latitude,
              m_Cartographic1.latitude,
              j / (length - 1)
            )
          )
        );
      }
      terrainSamplePositions.pop();
    } else {
      terrainSamplePositions.push(m_Cartographic0);
    }
  }
  let positions_Inter = [];
  let distance = 0;
  for (let n = 0; n < terrainSamplePositions.length; n++) {
    //地理坐标（弧度）转经纬度坐标
    let curCartographic = terrainSamplePositions[n];
    let height = viewer.scene.sampleHeight(curCartographic, objectsToExclude);
    const lon = (curCartographic.longitude / Math.PI) * 180;
    const lat = (curCartographic.latitude / Math.PI) * 180;
    let point = Cesium.Cartesian3.fromDegrees(lon, lat, height);
    let preCartographic = terrainSamplePositions[n - 1];
    if (preCartographic) {
      const lon1 = (preCartographic.longitude / Math.PI) * 180;
      const lat1 = (preCartographic.latitude / Math.PI) * 180;
      let point1 = Cesium.Cartesian3.fromDegrees(lon1, lat1, height);
      let curDis = Cesium.Cartesian3.distance(point1, point);
      distance += curDis;
    }
    positions_Inter.push({
      position: { lon: lon, lat: lat, height: height },
      distance: distance,
    });
  }
  return positions_Inter;
}
export default ProfileAnalysis;
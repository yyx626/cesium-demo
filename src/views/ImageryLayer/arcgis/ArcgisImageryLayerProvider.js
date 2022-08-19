/*
 * 加载智图Arcgis服务
 * 支持服务：
 *     https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity_Mobile/MapServer
 *     https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunityENG/MapServer
 *     https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer
 *     https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer
 *     https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer
 *     https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer
 * @Author: yyx
 * @Date: 2022-08-19
 */
import CoordTransform from "../CoordTransform";
const Cesium = window.Cesium;
/**
 * 加载智图Arcgis服务，并纠偏
 * @param {*} options
 * @param {*} crs 坐标系，纠偏-“WGS84”
 * @returns
 */
function ArcgisImageryLayerProvider(options, crs = "") {
  const url = options.url;
  if (!url) throw new Error("Map service url is required!");
  options.tilingScheme = new Cesium.WebMercatorTilingScheme();
  let provider = new Cesium.ArcGisMapServerImageryProvider(options);
  if (crs.toUpperCase() === "WGS84") {
    provider.readyPromise.then(() => {
      transformProjection(provider);
    });
  }
  return provider;
}
function transformProjection(provider) {
  let webMercatorTilingScheme = provider.tilingScheme;
  let projection = webMercatorTilingScheme._projection;
  projection.x_project = projection.project;
  projection.project = function (cartographic) {
    let point;
    return (
      (point = CoordTransform.WGS84ToGCJ02(
        Cesium.Math.toDegrees(cartographic.longitude),
        Cesium.Math.toDegrees(cartographic.latitude)
      )),
      projection.x_project(
        new Cesium.Cartographic(
          Cesium.Math.toRadians(point[0]),
          Cesium.Math.toRadians(point[1])
        )
      )
    );
  };
  projection.x_unproject = projection.unproject;
  projection.unproject = function (cartesian) {
    let point,
      cartographic = projection.x_unproject(cartesian);
    return (
      (point = CoordTransform.GCJ02ToWGS84(
        Cesium.Math.toDegrees(cartographic.longitude),
        Cesium.Math.toDegrees(cartographic.latitude)
      )),
      new Cesium.Cartographic(
        Cesium.Math.toRadians(point[0]),
        Cesium.Math.toRadians(point[1])
      )
    );
  };
  return provider;
}
export default ArcgisImageryLayerProvider;
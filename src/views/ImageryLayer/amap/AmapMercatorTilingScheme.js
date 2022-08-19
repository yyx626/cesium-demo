/*
 * 高德地图椭球体设定，参考dvgis
 * @Author: yyx
 * @Date: 2022-08-19
 */
 
import CoordTransform from "../CoordTransform";
const Cesium = window.Cesium;
class AmapMercatorTilingScheme extends Cesium.WebMercatorTilingScheme {
  constructor(options) {
    super(options);
    let projection = new Cesium.WebMercatorProjection();
    this._projection.project = function (cartographic, result) {
      result = CoordTransform.WGS84ToGCJ02(
        Cesium.Math.toDegrees(cartographic.longitude),
        Cesium.Math.toDegrees(cartographic.latitude)
      );
      result = projection.project(
        new Cesium.Cartographic(
          Cesium.Math.toRadians(result[0]),
          Cesium.Math.toRadians(result[1])
        )
      );
      return new Cesium.Cartesian2(result.x, result.y);
    };
    this._projection.unproject = function (cartesian, result) {
      let cartographic = projection.unproject(cartesian);
      result = CoordTransform.GCJ02ToWGS84(
        Cesium.Math.toDegrees(cartographic.longitude),
        Cesium.Math.toDegrees(cartographic.latitude)
      );
      return new Cesium.Cartographic(
        Cesium.Math.toRadians(result[0]),
        Cesium.Math.toRadians(result[1])
      );
    };
  }
}
 
export default AmapMercatorTilingScheme;
/*
 * 缓冲区分析类
 * @Author: yyx
 * @Date: 2022-10-17
 */
import * as turf from "@turf/turf";
const Cesium = window.Cesium;
class BufferAnalysis {
  constructor(viewer) {
    if (!viewer) throw new Error("no viewer object!");
    this.viewer = viewer;
    this.bufferCollection = [];
  }
  /**
   * 点缓冲区
   * @param {*} position 例：[-75.343, 39.984]
   * @param {*} radius 半径km
   * @param {*} callback 回调
   */
  buffer4Point(position, radius, callback) {
    const point = turf.point(position);
    this.calculateBuffer(point, radius, callback);
  }
  /**
   * 线缓冲区
   * @param {*} positions 例：[[-24, 63], [-23, 60], [-25, 65], [-20, 69]]
   * @param {*} radius 半径km
   * @param {*} callback 回调
   */
  buffer4Polyline(positions, radius, callback) {
    const lineString = turf.lineString(positions);
    this.calculateBuffer(lineString, radius, callback);
  }
  /**
   * 面缓冲区
   * @param {*} positions 例：[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]
   * @param {*} radius 半径km
   * @param {*} callback 回调
   */
  buffer4Polygon(positions, radius, callback) {
    positions = [positions];
    const polygon = turf.polygon(positions);
    this.calculateBuffer(polygon, radius, callback);
  }
  /**
   * 执行buffer计算
   * @param {*} data geojson数据
   * @param {*} radius 半径
   * @param {*} callback 回调
   */
  calculateBuffer(data, radius, callback) {
    const buffer = turf.buffer(data, radius);
    const coordinates = buffer ? buffer.geometry.coordinates[0] : [];
    const degreesArray = this.translateDegreesArray(coordinates);
    const bufferEntity = this.viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(degreesArray),
        width: 2,
        material: Cesium.Color.ORANGE,
      },
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray(degreesArray)
        ),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        material: Cesium.Color.ORANGE.withAlpha(0.4),
      },
    });
    const bufferItem = {
      type: "PolylineBuffer",
      geojson: buffer,
      degreesArray: degreesArray,
      entity: bufferEntity,
    };
    this.bufferCollection.push(bufferItem);
    if (callback && typeof callback === "function") {
      callback(bufferItem);
    }
  }
  translateDegreesArray(arr) {
    const result = [];
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      result.push(element[0], element[1]);
    }
    return result;
  }
  /**
   * 移除所有缓冲区结果
   */
  removeAll() {
    this.bufferCollection.forEach((element) => {
      this.viewer.entities.remove(element.entity);
    });
    this.bufferCollection = [];
  }
}
export default BufferAnalysis;
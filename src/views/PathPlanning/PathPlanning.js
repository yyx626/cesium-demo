/*
 * 路径规划分析功能
 * @Author: yyx
 * @Date: 2022-09-22
 */
import { getPOI, getPath4Drive } from "./api/request";
const Cesium = window.Cesium;
class PathPlanning {
  constructor(viewer) {
    if (!viewer) throw new Error("no viewer object!");
    this.viewer = viewer;
  }
  getPOIList(text, callback) {
    getPOI(text)
      .then((response) => {
        console.log(response);
        const data = response.data.pois;
        let result = [];
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          const coord = element.location.split(",");
          let location = gcj02towgs84(Number(coord[0]), Number(coord[1]));
          element.location = location;
          result.push(element);
        }
        if (typeof callback == "function") callback(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getPathList(origin, destination, type, callback) {
    const $this = this;
    const coordStart = origin.split(",");
    let startPos = gcj02towgs84(Number(coordStart[0]), Number(coordStart[1]));
    const coordEnd = destination.split(",");
    let endPos = gcj02towgs84(Number(coordEnd[0]), Number(coordEnd[1]));
    getPath4Drive(origin, destination, type)
      .then((response) => {
        console.log("高德API返回：", response);
        const paths = response.data.route.paths;
        const drivePathResult = {
          start: startPos,
          end: endPos,
          paths: [],
        };
        paths.forEach((path) => {
          const distance = path.distance / 1000;
          const time = $this.formatSeconds(path.duration);
          const steps = path.steps;
          let fullPath = [];
          for (let index = 0; index < steps.length; index++) {
            const element = steps[index];
            let sourcePolyline = element.polyline.split(";");
            let polylinePoints = $this.resetPolylinePoints(sourcePolyline);
            fullPath = fullPath.concat(polylinePoints);
          }
          drivePathResult.paths.push({
            distance: distance,
            time: time,
            fullPath: fullPath,
          });
        });
        if (typeof callback == "function") callback(drivePathResult);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  resetPolylinePoints(polylinePoints) {
    let result = [];
    for (let index = 0; index < polylinePoints.length; index++) {
      const point = polylinePoints[index];
      let coord = point.split(",");
      let location = gcj02towgs84(Number(coord[0]), Number(coord[1]));
      result.push(location[0], location[1]);
    }
    return result;
  }
  formatSeconds(value) {
    const h = Math.floor(value / 3600);
    let m = value % 3600;
    m = Math.floor(m / 60);
    let val1 = h > 0 ? h + "小时" : "";
    let val2 = m > 0 ? m + "分钟" : "";
    return val1 + val2;
  }
}

let PI = 3.1415926535897932384626;
let a = 6378245.0;
let ee = 0.00669342162296594323;
/**
 * 高德坐标转WGS84
 * @param {Number} lng
 * @param {Number} lat
 * @returns WGS84坐标 [ lng, lat ]
 */
function gcj02towgs84(lng, lat) {
  if (out_of_china(lng, lat)) {
    return [lng, lat];
  } else {
    let dlat = transformlat(lng - 105.0, lat - 35.0);
    let dlng = transformlng(lng - 105.0, lat - 35.0);
    let radlat = (lat / 180.0) * PI;
    let magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    let sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
    let mglat = lat + dlat;
    let mglng = lng + dlng;
    return [lng * 2 - mglng, lat * 2 - mglat];
  }
}
function out_of_china(lng, lat) {
  // 纬度3.86~53.55,经度73.66~135.05
  return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
}
function transformlat(lng, lat) {
  let ret =
    -100.0 +
    2.0 * lng +
    3.0 * lat +
    0.2 * lat * lat +
    0.1 * lng * lat +
    0.2 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
    3.0;
  ret +=
    ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) *
      2.0) /
    3.0;
  return ret;
}
function transformlng(lng, lat) {
  let ret =
    300.0 +
    lng +
    2.0 * lat +
    0.1 * lng * lng +
    0.1 * lng * lat +
    0.1 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
    3.0;
  ret +=
    ((150.0 * Math.sin((lng / 12.0) * PI) +
      300.0 * Math.sin((lng / 30.0) * PI)) *
      2.0) /
    3.0;
  return ret;
}

export default PathPlanning;
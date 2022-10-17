<template>
  <div id="cesiumContainer">
    <div class="buffer-tools">
      <el-button size="mini" @click="startBuffer(0)">点缓冲区</el-button>
      <el-button size="mini" @click="startBuffer(1)">线缓冲区</el-button>
      <el-button size="mini" @click="startBuffer(2)">面缓冲区</el-button>
    </div>
  </div>
</template>
<script>
const Cesium = window.Cesium;
let viewer = undefined;
let point, polyline, polygon, bufferObj;
import BufferAnalysis from "./BufferAnalysis";
export default {
  data() {
    return {};
  },
  mounted() {
    let key =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDhhOThhNy0zMzUzLTRiZDktYWM3Ni00NGI5MGY2N2UwZDUiLCJpZCI6MjQzMjYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODUwMzUwNDh9.DYuDF_RPKe5_8w849_y-sutM68LM51O9o3bTt_3rF1w";
    Cesium.Ion.defaultAccessToken = key;
    window.viewer = viewer = new Cesium.Viewer("cesiumContainer", {
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      }),
      // terrainProvider: Cesium.createWorldTerrain(),
      geocoder: true,
      homeButton: true,
      sceneModePicker: true,
      baseLayerPicker: true,
      navigationHelpButton: true,
      animation: true,
      timeline: true,
      fullscreenButton: true,
      vrButton: true,
      //关闭点选出现的提示框
      selectionIndicator: false,
      infoBox: false,
    });
    viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权
    this.initData();
  },
  methods: {
    initData() {
      point = [126.2, 37.22];
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(point[0], point[1]),
        point: {
          show: true,
          pixelSize: 10,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          color: Cesium.Color.GREEN,
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 5,
        },
      });
      polyline = [125.3, 36.4, 125.9, 36.5, 125.5, 36.75];
      viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(polyline),
          width: 8,
          material: Cesium.Color.RED,
        },
      });
      polygon = [126.3, 36.4, 126.9, 36.5, 126.5, 36.75];
      viewer.entities.add({
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArray(polygon)
          ),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          material: Cesium.Color.RED,
        },
      });
      viewer.flyTo(viewer.entities._entities);
      bufferObj = new BufferAnalysis(viewer);
    },
    startBuffer(type) {
      bufferObj.removeAll();
      switch (type) {
        case 0:
          this.pointBuffer();
          break;
        case 1:
          this.polylineBuffer();
          break;
        case 2:
          this.polygonBuffer();
          break;
        default:
          break;
      }
    },
    pointBuffer() {
      bufferObj.buffer4Point(point, 10, function (result) {
        console.log("执行回调：", result);
      });
    },
    polylineBuffer() {
      const positions = this.getPositions(polyline);
      bufferObj.buffer4Polyline(positions, 5, function (result) {
        console.log("执行回调：", result);
      });
    },
    polygonBuffer() {
      polygon.push(polygon[0], polygon[1]);
      const positions = this.getPositions(polygon);
      bufferObj.buffer4Polygon(positions, 10, function (result) {
        console.log("执行回调：", result);
      });
    },
    getPositions(positions) {
      const result = [];
      for (let index = 0; index < positions.length; index += 2) {
        const lng = positions[index];
        const lat = positions[index + 1];
        result.push([lng, lat]);
      }
      return result;
    },
    getLocation() {
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      handler.setInputAction(function (event) {
        let earthPosition = viewer.scene.pickPosition(event.position);
        if (Cesium.defined(earthPosition)) {
          let cartographic = Cesium.Cartographic.fromCartesian(earthPosition);
          let lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
          let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);
          let height = cartographic.height.toFixed(2);
          console.log(earthPosition, {
            lon: lon,
            lat: lat,
            height: height,
          });
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
  },
};
</script>
<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
  .buffer-tools {
    position: absolute;
    margin: 10px;
    padding: 10px;
    z-index: 10;
    border: 1px solid #313131;
    border-radius: 4px;
    background: rgba(70, 69, 69, 0.8);
  }
}
</style>
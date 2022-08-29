<template>
  <div id="cesiumContainer">
    <div class="realtime-path-tool">
      <el-button size="mini" @click="start">开始</el-button>
      <el-button size="mini" @click="end">移除</el-button>
    </div>
  </div>
</template>
<script>
import RealTimeObject from "./RealtimeObject";
const Cesium = window.Cesium;
let viewer = undefined;
let realTimeObj = undefined;
let realTimer = undefined;
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
      selectionIndicator: true,
      infoBox: true,
    });
    viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权
  },
  methods: {
    start() {
      if (!realTimeObj) {
        realTimeObj = new RealTimeObject(window.viewer, {
          image: require("./uav.png"),
          scale: 0.2,
          width: 3,
        });
        let i = 0;
        realTimer = setInterval(() => {
          i += 0.1;
          realTimeObj.updateData({
            x: -106 + i,
            y: 40,
            z: 20000 + Math.random() * 2000,
          });
        }, 1000);
      }
    },
    end() {
      if (realTimeObj) {
        realTimeObj.destroy();
        clearInterval(realTimer);
        realTimeObj = undefined;
      }
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
  .realtime-path-tool {
    position: absolute;
    padding: 10px;
    margin: 10px;
    z-index: 10;
    background: rgba(90, 89, 89, 0.8);
    border: 1px solid rgb(22, 22, 22);
    border-radius: 4px;
  }
}
</style>
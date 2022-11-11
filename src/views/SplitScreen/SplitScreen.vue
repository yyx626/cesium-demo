<template>
  <div id="main-screen">
    <div id="cesiumContainer"></div>
    <div id="cesiumContainer1"></div>
    <div class="tools">
      <el-button size="mini" @click="open">开启</el-button>
      <el-button size="mini" @click="close">关闭</el-button>
    </div>
  </div>
</template>
<script>
const Cesium = window.Cesium;
let viewer1 = undefined;
let viewer2 = undefined;
let syncObj = undefined;
import SyncViewer from "./ViewerSync";
export default {
  data() {
    return {};
  },
  mounted() {
    let key =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDhhOThhNy0zMzUzLTRiZDktYWM3Ni00NGI5MGY2N2UwZDUiLCJpZCI6MjQzMjYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODUwMzUwNDh9.DYuDF_RPKe5_8w849_y-sutM68LM51O9o3bTt_3rF1w";
    Cesium.Ion.defaultAccessToken = key;
    window.viewer1 = viewer1 = new Cesium.Viewer("cesiumContainer", {
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      }),
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
      //关闭点选出现的提示框
      selectionIndicator: false,
      infoBox: false,
    });
    viewer1._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权
    window.viewer2 = viewer2 = new Cesium.Viewer("cesiumContainer1", {
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
      }),
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
      //关闭点选出现的提示框
      selectionIndicator: false,
      infoBox: false,
    });
    viewer2._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权
    syncObj = new SyncViewer(viewer1, viewer2);
  },
  methods: {
    open() {
      syncObj.sync(true);
    },
    close() {
      syncObj.sync(false);
    },
    initCamera() {
      viewer1.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(110, 40, 10000.0),
        orientation: {
          heading: 0.09085393067733083,
          pitch: -1.5329743385768886,
          roll: 0.0,
        },
        duration: 3,
      });
    },
    getLocation() {
      let handler = new Cesium.ScreenSpaceEventHandler(viewer1.canvas);
      handler.setInputAction(function (event) {
        let earthPosition = viewer1.scene.pickPosition(event.position);
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
#main-screen {
  width: 100%;
  height: 100%;
  position: relative;
  #cesiumContainer {
    display: inline-block;
    width: 50%;
    height: 100%;
  }
  #cesiumContainer1 {
    display: inline-block;
    width: 50%;
    height: 100%;
  }
  .tools {
    top: 0;
    position: absolute;
    margin: 10px;
    padding: 10px;
    z-index: 10;
    background: rgba(80, 79, 79, 0.7);
    border: 1px solid rgb(51, 51, 51);
    border-radius: 4px;
  }
}
</style>
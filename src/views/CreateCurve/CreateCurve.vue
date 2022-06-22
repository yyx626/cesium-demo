<template>
  <div id="cesiumContainer">
    <div class="plotting-tool">
      <el-button size="mini" @click="startDraw">开始创建</el-button>
    </div>
  </div>
</template>
<script>
import CreateCurve from "./CreateCurve";
const Cesium = window.Cesium;
let viewer = undefined;
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
    this.initCamera();
  },
  methods: {
    startDraw() {
      CreateCurve(
        window.viewer,
        [],
        {
          color: Cesium.Color.GREEN,
          width: 10,
        },
        function (e) {
          console.log(e);
        }
      );
    },
    initCamera() {
      viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(
          110.62898254394531,
          40.02804946899414,
          10000.0
        ), //相机飞入点
      });
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
  .plotting-tool {
    position: absolute;
    margin: 10px;
    padding: 10px;
    border: 1px solid rgb(39, 38, 38);
    border-radius: 5px;
    background-color: rgba(97, 95, 95, 0.8);
    z-index: 10;
  }
}
</style>
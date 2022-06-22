<template>
  <div id="cesiumContainer">
    <div class="slope-aspect">
      <el-button size="mini" @click="analysisByNum"
        >绘制区域-等分处理</el-button
      >
      <el-button size="mini" @click="analysisByDistance"
        >绘制区域-等距处理</el-button
      >
      <el-button size="mini" @click="clearAll">清除所有</el-button>
      <el-switch
        v-model="showTip"
        active-text="开启Tip"
        inactive-text="关闭Tip"
      >
      </el-switch>
    </div>
  </div>
</template>
<script>
import SlopeAspect from "./SlopeAspect";
const Cesium = window.Cesium;
let viewer = undefined;
export default {
  data() {
    return {
      showTip: false,
    };
  },
  watch: {
    showTip(bool) {
      bool ? window.saObj.openTip() : window.saObj.closeTip();
    },
  },
  mounted() {
    let key =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDhhOThhNy0zMzUzLTRiZDktYWM3Ni00NGI5MGY2N2UwZDUiLCJpZCI6MjQzMjYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODUwMzUwNDh9.DYuDF_RPKe5_8w849_y-sutM68LM51O9o3bTt_3rF1w";
    Cesium.Ion.defaultAccessToken = key;
    window.viewer = viewer = new Cesium.Viewer("cesiumContainer", {
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      }),
      terrainProvider: Cesium.createWorldTerrain(),
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
    window.saObj = new SlopeAspect(viewer);
  },
  methods: {
    analysisByNum() {
      window.saObj.createNew4Num(20);
    },
    analysisByDistance() {
      window.saObj.createNew4Distance(0.05);
    },
    clearAll() {
      window.saObj.clearAll();
    },
    initCamera() {
      viewer.camera.setView({
        destination: new Cesium.Cartesian3(
          -1210490.5711433399,
          5370444.243625174,
          3216385.6230325554
        ),
        orientation: {
          heading: 0.43782636467719804,
          pitch: -0.9314452708778465,
          roll: 6.281245881898588,
        },
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
  .slope-aspect {
    position: absolute;
    margin: 10px;
    padding: 10px;
    z-index: 10;
    border: 1px solid rgb(26, 25, 25);
    background-color: rgba(97, 96, 96, 0.8);
    border-radius: 5px;
  }
}
</style>
<template>
  <div id="cesiumContainer">
    <div class="terrain-excavation-tools">
      <el-button size="mini" @click="terrainClip(true)">开始创建</el-button>
      <div style="margin-top: 5px">
        开挖高度：
        <el-input-number
          size="mini"
          controls-position="right"
          v-model="height"
          :step="100"
          :min="100"
          :max="3000"
          @change="heightChange"
        ></el-input-number>
      </div>
    </div>
  </div>
</template>
<script>
const Cesium = window.Cesium;
let viewer = undefined;
let terrainClipPlanObj = undefined;
import TerrainExcavation from "./TerrainExcavation";
export default {
  data() {
    return {
      height: 200,
    };
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
    // viewer.scene.globe.depthTestAgainstTerrain = true;
    this.initCamera();
  },
  methods: {
    heightChange(val) {
      if (terrainClipPlanObj) {
        terrainClipPlanObj.height = val;
      }
    },
    terrainClip(bool) {
      if (!terrainClipPlanObj) {
        terrainClipPlanObj = new TerrainExcavation(window.viewer, {
          height: this.height,
          splitNum: 1000,
          bottomImg: require("./images/terrain-clip-bottom.jpeg"),
          wallImg: require("./images/terrain-clip-aside.jpeg"),
        });
      }
      if (bool) {
        console.log("开始地形开挖");
        terrainClipPlanObj.startCreate();
      } else {
        console.log("结束地形开挖");
        terrainClipPlanObj.clear();
      }
    },
    initCamera() {
      viewer.camera.flyTo({
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
  .terrain-excavation-tools {
    position: absolute;
    margin: 10px;
    padding: 10px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    border: 1px solid rgb(24, 24, 24);
    background-color: rgba(67, 68, 68, 0.7);
    border-radius: 5px;
    color: white;
  }
}
</style>
<template>
  <div id="cesiumContainer">
    <div class="profile-analysis-tools">
      <el-button size="mini" @click="startAnalysis">开始分析</el-button>
    </div>
    <profile-echarts v-if="show" :profileData="profileData"></profile-echarts>
  </div>
</template>
<script>
import ProfileAnalysis from "./ProfileAnalysis";
import ProfileEcharts from "./ProfileEcharts.vue";
const Cesium = window.Cesium;
let viewer = undefined;
export default {
  components: { ProfileEcharts },
  data() {
    return {
      show: false,
      profileData: [],
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
    this.initModel();
    // this.initCamera();
  },
  methods: {
    startAnalysis() {
      const $this = this;
      ProfileAnalysis(viewer, function (result) {
        console.log(result);
        $this.profileData = result;
        $this.show = true;
      });
    },
    initCamera() {
      viewer.camera.setView({
        destination: new Cesium.Cartesian3(
          -2347452.1518602716,
          4577899.210631776,
          3760265.522246262
        ),
        orientation: {
          heading: 1.1114027809437168,
          pitch: -0.9233840184410718,
          roll: 6.2831333602678345,
        },
      });
    },
    initModel() {
      let tilesetModel = new Cesium.Cesium3DTileset({
        url: `data/dayanta/tileset.json`
      });
      viewer.scene.primitives.add(tilesetModel);
      viewer.zoomTo(tilesetModel);
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
  .profile-analysis-tools {
    position: absolute;
    margin: 10px;
    z-index: 10;
    padding: 10px;
    border: 1px solid rgb(51, 50, 50);
    border-radius: 5px;
    background-color: rgba(109, 106, 106, 0.8);
    color: white;
  }
}
</style>
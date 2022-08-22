<template>
  <div id="cesiumContainer">
    <div class="history-path-tool">
      <el-button size="mini" @click="start">开始</el-button>
      <el-button size="mini" @click="end">移除</el-button>
    </div>
    <history-tool
      :historyObj="historyObj"
      v-if="historyObj != null"
    ></history-tool>
  </div>
</template>
<script>
import HistoryTool from "./HistoryTool.vue";
import HistoryObject from "./HistoryObject.js";
 
const Cesium = window.Cesium;
let viewer = undefined;
 
export default {
  components: { HistoryTool },
  data() {
    return {
      historyObj: null,
      historyData: {
        startTime: "2021-12-20 15:40:00",
        endTime: "2021-12-20 15:40:25",
        model: {
          uri: `data/models/Cesium_Air.glb`,
          minimumPixelSize: 100,
        },
        values: [
          {
            time: "2021-12-20 15:40:00",
            position: [115.81965138, 40.54232127, 2000],
          },
          {
            time: "2021-12-20 15:40:05",
            position: [115.81318949, 40.53710265, 2100],
          },
          {
            time: "2021-12-20 15:40:10",
            position: [115.80317297, 40.53346348, 2000],
          },
          {
            time: "2021-12-20 15:40:15",
            position: [115.8038737, 40.52619352, 2000],
          },
          {
            time: "2021-12-20 15:40:20",
            position: [115.79466716, 40.51626819, 2100],
          },
          {
            time: "2021-12-20 15:40:25",
            position: [115.79383513, 40.50618171, 1900],
          },
        ],
      },
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
    this.initCamera();
  },
  methods: {
    start() {
      if (!this.historyObj) {
        this.historyObj = new HistoryObject(viewer);
        this.historyObj.createWithAllPath(this.historyData);
      }
    },
    end() {
      this.historyObj.destroy();
      this.historyObj = null;
    },
    initCamera() {
      viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(
          115.8038737,
          40.52619352,
          10000.0
        ),
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
  .history-path-tool {
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
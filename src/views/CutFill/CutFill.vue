<template>
  <div id="cesiumContainer">
    <div class="fut-fill-tools">
      <div class="tools-param">
        <span>
          高度值：
          <el-input size="mini" type="number" v-model="height"></el-input>
        </span>
        <span>
          精度：
          <el-input size="mini" type="number" v-model="precision"></el-input>
        </span>
      </div>
      <el-button size="mini" @click="drawBoundary">绘制区域</el-button>
      <div class="tool-result">
        <span>
          总分析面积(㎡)
          <el-input size="mini" v-model="result.allArea"></el-input>
        </span>
        <span>
          填方面积(㎡)
          <el-input size="mini" v-model="result.fillArea"></el-input>
        </span>
        <span>
          填方体积(m³)
          <el-input size="mini" v-model="result.fillVolume"></el-input>
        </span>
        <span>
          挖方面积(㎡)
          <el-input size="mini" v-model="result.cutArea"></el-input>
        </span>
        <span>
          挖方体积(m³)
          <el-input size="mini" v-model="result.cutVolume"></el-input>
        </span>
        <span>
          无须填挖面积(㎡)
          <el-input size="mini" v-model="result.noArea"></el-input>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import CreatePolygon from "./CreatePolygon";
import CutFillAnalysis from "./CutFillAnalysis";
const Cesium = window.Cesium;
let viewer = undefined;
export default {
  data() {
    return {
      height: 700,
      precision: 256,
      result: {
        allArea: "",
        cutArea: "",
        cutVolume: "",
        fillArea: "",
        fillVolume: "",
        noArea: "",
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
    this.getLocation();
  },
  methods: {
    initModel() {
      const tilesetModel = new Cesium.Cesium3DTileset({
        // url: `${window.location.origin}/data/model/bim/tileset.json`,
        url: `data/dayanta/tileset.json`
      });
      tilesetModel.readyPromise
        .then(function (tileset) {
          viewer.scene.primitives.add(tileset);
          viewer.flyTo(tileset);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    drawBoundary() {
      const $this = this;
      let cp = new CreatePolygon(window.viewer);
      cp.start(function () {
        $this.startAnalysis(cp);
      });
    },
    startAnalysis(boundary) {
      const analysisObj = new CutFillAnalysis(
        window.viewer,
        boundary.activeShapePoints,
        this.height,
        this.precision
      );
      this.result = analysisObj.VolumeAnalysis();
      viewer.entities.remove(boundary.polygon);
      viewer.scene.screenSpaceCameraController.enableCollisionDetection = false; //允许相机进入地下
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
  .fut-fill-tools {
    position: absolute;
    margin: 10px;
    padding: 10px;
    z-index: 10;
    color: white;
    border: 1px solid rgb(36, 35, 35);
    border-radius: 5px;
    background-color: rgba(75, 74, 74, 0.8);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .tools-param {
      display: flex;
      margin-bottom: 10px;
      .el-input {
        width: 80px;
        display: inline-block;
        margin-right: 10px;
      }
    }
    button {
      width: 97%;
    }
    .tool-result {
      color: white;
      span {
        display: flex;
        width: 290px;
        margin: 5px 0;
        justify-content: flex-end;
        .el-input {
          width: 155px;
          display: inline-block;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
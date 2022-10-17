<template>
  <div id="cesiumContainer">
    <div class="pop-tools">
      <el-button size="mini" @click="show">显示弹窗</el-button>
      <el-button size="mini" @click="hide">隐藏弹窗</el-button>
    </div>
    <div class="popupDiv" id="popupDiv">我是自定义弹窗部分</div>
  </div>
</template>
<script>
import popWindow from "./popWindow";
const Cesium = window.Cesium;
let viewer = undefined;
let popObj = undefined;
export default {
  mounted() {
    let key =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDhhOThhNy0zMzUzLTRiZDktYWM3Ni00NGI5MGY2N2UwZDUiLCJpZCI6MjQzMjYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODUwMzUwNDh9.DYuDF_RPKe5_8w849_y-sutM68LM51O9o3bTt_3rF1w";
    Cesium.Ion.defaultAccessToken = key;
    viewer = new Cesium.Viewer("cesiumContainer", {
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      }),
      // terrainProvider: this.Cesium.createWorldTerrain(),
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
    popObj = new popWindow(
      viewer,
      "cesiumContainer",
      "popupDiv",
      this.popObjList
    );
  },
  data() {
    return {
      popPositionsList: [
        { x: -2439782.0594847123, y: 4502607.651882711, z: 3789064.520538157 },
        { x: -1817139.989356726, y: 4707097.014467277, z: 3888157.435155972 },
        { x: -2162054.029276902, y: 5083153.954925626, z: 3177728.2840770087 },
      ],
      popObjList: [],
    };
  },
  methods: {
    show() {
      this.popPositionsList.forEach((element, index) => {
        popObj.newPopup({
          position: element,
          offset_x: 0,
          offset_y: 0,
          name: "新弹窗" + index,
        });
      });
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(114.5, 32, 4000000),
        duration: 3,
      });
    },
    hide() {
      popObj.removeAll();
    },
  },
};
</script>
<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
  .pop-tools {
    position: absolute;
    margin: 10px;
    padding: 10px;
    background: rgba(83, 83, 83, 0.7);
    border: 1px solid rgb(20, 20, 20);
    border-radius: 4px;
    z-index: 10;
  }
  .popupDiv {
    position: absolute;
    z-index: 99;
    width: 200px;
    height: 100px;
    background-color: rgb(88, 94, 92);
    color: white;
  }
  #popupDiv {
    display: none;
  }
}
</style>
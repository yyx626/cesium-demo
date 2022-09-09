<template>
  <div id="cesiumContainer">
    <div class="edit-tools">
      <el-button size="mini" @click="start">开始编辑</el-button>
      <el-button size="mini" @click="translation">平移</el-button>
      <el-button size="mini" @click="rotation">旋转</el-button>
      <el-button size="mini" @click="close">关闭编辑</el-button>
    </div>
  </div>
</template>
<script>
import Edit3DM from './Edit3DM.js'
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
  },
  methods: {
    initModel() {
      this.tilesetModel = new Cesium.Cesium3DTileset({
        url: `data/dayanta/tileset.json`
      });
      this.tilesetModel.readyPromise
        .then(function (tileset) {
          viewer.scene.primitives.add(tileset);
          viewer.flyTo(tileset);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    start(){
      this.editObj = new Edit3DM(viewer, this.tilesetModel, 1, 1)
    },
    translation(){
      this.editObj.editTranslation()
    },
    rotation(){
      this.editObj.editRtation()
    },
    close(){
      this.editObj.destroy()
    }
  },
};
</script>
<style lang="scss" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;
  .edit-tools {
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
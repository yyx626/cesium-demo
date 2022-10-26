<template>
  <div id="cesiumContainer">
    <div class="canvas-main">
      <el-button size="mini" @click="startDraw" :disabled="bool"
        >开始绘制</el-button
      >
      <el-button size="mini" @click="autoUpdate" :disabled="!bool"
        >自动更新</el-button
      >
    </div>
  </div>
</template>
<script>
import HeatmapIntensity from "./HeatmapIntensity";
const Cesium = window.Cesium;
let viewer = undefined;
export default {
  data() {
    return {
      mapData: [],
      bool: false,
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
      selectionIndicator: true,
      infoBox: true,
    });
    viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权
    this.initData();
  },
  methods: {
    startDraw() {
      const option = {
        min: 0,
        max: 100,
        size: 20,
      };
      window.heatmapObj = new HeatmapIntensity(viewer, option);
      const box = {
        west: 110,
        south: 40.5,
        east: 110.5,
        north: 41,
      };
      window.heatmapObj.createHeatmap(box, this.mapData);
      this.bool = true;
    },
    autoUpdate() {
      setInterval(() => {
        let data = [];
        for (let i = 0; i < 100; i++) {
          let obj = {};
          obj.x = this.randomNum(110, 110.5, 5);
          obj.y = this.randomNum(40.5, 41, 5);
          obj.value = this.randomNum(0, 100, 2);
          data.push(obj);
        }
        window.heatmapObj.setData(data);
      }, 1000);
    },
    initData() {
      this.mapData = [];
      for (let i = 0; i < 100; i++) {
        let obj = {};
        obj.x = this.randomNum(110, 110.5, 5);
        obj.y = this.randomNum(40.5, 41, 5);
        obj.value = this.randomNum(0, 100, 2);
        this.mapData.push(obj);
      }
      this.mapData.forEach((element) => {
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(
            Number(element.x),
            Number(element.y)
          ),
          point: {
            pixelSize: 5,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          },
        });
      });
      viewer.flyTo(viewer.entities);
    },
    randomNum(maxNum, minNum, decimalNum) {
      // 获取指定范围内的随机数, decimalNum指小数保留多少位
      let max = 0,
        min = 0;
      minNum <= maxNum
        ? ((min = minNum), (max = maxNum))
        : ((min = maxNum), (max = minNum));
      let result = undefined;
      switch (arguments.length) {
        case 1:
          result = Math.floor(Math.random() * (max + 1));
          break;
        case 2:
          result = Math.floor(Math.random() * (max - min + 1) + min);
          break;
        case 3:
          result = (Math.random() * (max - min) + min).toFixed(decimalNum);
          break;
        default:
          result = Math.random();
          break;
      }
      return result;
    },
  },
};
</script>
<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
  background: rgba(255, 0, 0, 0.322);
  .canvas-main {
    position: absolute;
    margin: 10px;
    padding: 10px;
    z-index: 10;
    background: rgba(255, 255, 0, 0.329);
  }
}
</style>
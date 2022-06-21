<template>
  <div id="cesiumContainer">
    <div id="myCanvas"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import options from "./data";
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
      selectionIndicator: true,
      infoBox: true,
    });
    viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权
    this.initCamera();
    this.initData();
  },
  methods: {
    initData() {
      this.drawEcharts(options, 0);
    },
    drawEcharts(options, index) {
      let $this = this;
      const element = options[index];
      let chartDom = document.getElementById("myCanvas");
      let myChart;
      let promise = new Promise((resolve) => {
        myChart = echarts.init(chartDom);
        myChart.setOption(element.option);
        // 绑定渲染停止时触发promise完成状态
        myChart.on("finished", () => {
          resolve();
        });
      });
      // 确保绘制完成后再创建billboard
      promise.then(() => {
        const mc = chartDom.querySelector("canvas");
        let img = mc.toDataURL("image/png");
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(
            element.coord[0],
            element.coord[1]
          ),
          billboard: {
            image: img,
            show: true,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            alignedAxis: Cesium.Cartesian3.ZERO,
            width: element.size[0],
            height: element.size[1],
          },
        });
        if (index + 1 < options.length) {
          myChart.clear();
          myChart.dispose();
          index++;
          $this.drawEcharts(options, index);
        }
      });
    },
    initCamera() {
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3(
          -2744676.6256837887,
          5118433.105031765,
          2843129.6830630316
        ), //相机飞入点
      });
    },
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
};
</script>
<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
  #myCanvas {
    position: absolute;
    left: 20px;
    top: 20px;
    width: 200px;
    height: 350px;
    display: none;
  }
}
</style>

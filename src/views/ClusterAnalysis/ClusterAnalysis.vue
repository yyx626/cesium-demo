<template>
  <div id="cesiumContainer"></div>
</template>
<script>
const Cesium = window.Cesium;
let viewer = undefined;
import pointJson from "./data/points.json";
import ClusterAnalysis from "./ClusterAnalysis";
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
    this.initCluster(viewer);
  },
  methods: {
    initCluster(viewer) {
      new Cesium.GeoJsonDataSource().load(pointJson).then((dataSource) => {
        dataSource.entities.values.forEach((entity, index) => {
          entity.billboard = {
            image: require("./image/point.png"),
            width: 32,
            height: 32,
          };
          entity.label = {
            text: "点" + index,
            font: "bolder 16px Microsoft YaHei",
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            pixelOffset: new Cesium.Cartesian2(0, -30),
          };
        });
        viewer.dataSources.add(dataSource);
        viewer.flyTo(dataSource);
        const clusterImage = require("./image/back.png");
        ClusterAnalysis(viewer, dataSource, {
          pixelRange: 70,
          minimumClusterSize: 3,
          clusterRules: {
            ranges: [1, 10, 100, 1000],
            images: [clusterImage, clusterImage, clusterImage, clusterImage],
            width: [36, 48, 64, 96],
          },
        });
      });
    },

  },
};
</script>
<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
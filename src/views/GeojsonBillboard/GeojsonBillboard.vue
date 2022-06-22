<template>
  <div id="cesiumContainer"></div>
</template>
<script>
import point0 from "./geojson/point0.json";
import point1 from "./geojson/point1.json";
const Cesium = window.Cesium;
let viewer = undefined;
let moveSelectID = "";
let clickSelectID = "";
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
      selectionIndicator: false,
      infoBox: false,
    });
    viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权
    this.initData();
    this.initHandler();
  },
  methods: {
    initHandler() {
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      handler.setInputAction(function (event) {
        let pick = viewer.scene.pick(event.endPosition);
        if (Cesium.defined(pick) && pick.id) {
          moveSelectID = pick.id.id;
        } else {
          moveSelectID = "";
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.setInputAction(function (event) {
        let pick = viewer.scene.pick(event.position);
        if (Cesium.defined(pick) && pick.id) {
          clickSelectID = pick.id.id;
        } else {
          clickSelectID = "";
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    initData() {
      viewer.dataSources.removeAll();
      // 加载数据1
      let promise0 = Cesium.GeoJsonDataSource.load(point0);
      promise0.then((ds) => {
        let entitys = ds.entities.values;
        entitys.forEach((entity) => {
          entity.billboard = new Cesium.BillboardGraphics({
            image: new Cesium.CallbackProperty(function () {
              return entity.id === moveSelectID || entity.id === clickSelectID
                ? require("./images/a0.png")
                : require("./images/a.png");
            }, false),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            scale: new Cesium.CallbackProperty(function () {
              return entity.id === moveSelectID || entity.id === clickSelectID
                ? 0.4
                : 0.3;
            }, false),
          });
        });
      });
      let data = viewer.dataSources.add(promise0);
      viewer.flyTo(data);
 
      //加载数据2
      let promise1 = Cesium.GeoJsonDataSource.load(point1);
      promise1.then((ds) => {
        let entitys = ds.entities.values;
        entitys.forEach((entity) => {
          entity.billboard = new Cesium.BillboardGraphics({
            image: new Cesium.CallbackProperty(function () {
              return entity.id === moveSelectID || entity.id === clickSelectID
                ? require("./images/b0.png")
                : require("./images/b.png");
            }, false),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            scale: new Cesium.CallbackProperty(function () {
              return entity.id === moveSelectID || entity.id === clickSelectID
                ? 0.4
                : 0.3;
            }, false),
          });
        });
      });
      viewer.dataSources.add(promise1);
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
}
</style>
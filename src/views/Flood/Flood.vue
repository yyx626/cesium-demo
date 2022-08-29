<template>
  <div id="cesiumContainer">
    <div class="flood-tools">
      <el-button size="mini" @click="start">开始淹没分析</el-button>
      <el-button size="mini" @click="stop">结束淹没分析</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    positions() {
      const Cesium = window.Cesium;
      let p0 = new Cesium.Cartesian3(
        62194.45373265314,
        5669267.88190016,
        2918648.9515907196
      );
      let p1 = new Cesium.Cartesian3(
        56303.87004217449,
        5673698.381300747,
        2910246.3633272164
      );
      let p2 = new Cesium.Cartesian3(
        47580.70560061326,
        5671620.854723226,
        2914442.961863161
      );
      let p3 = new Cesium.Cartesian3(
        53458.6273335863,
        5666830.965259356,
        2922892.454129204
      );
      return [p0, p1, p2, p3];
    },
  },
  mounted() {
    const Cesium = window.Cesium;
    let key =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDhhOThhNy0zMzUzLTRiZDktYWM3Ni00NGI5MGY2N2UwZDUiLCJpZCI6MjQzMjYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODUwMzUwNDh9.DYuDF_RPKe5_8w849_y-sutM68LM51O9o3bTt_3rF1w";
    Cesium.Ion.defaultAccessToken = key;
    window.viewer = new Cesium.Viewer("cesiumContainer", {
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
    window.viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权
    window.viewer.camera.flyTo({
      destination: new Cesium.Cartesian3(
        52066.05151397444,
        5684548.956018807,
        2920846.197147853
      ),
    });
    this.initRiver(this.positions);
  },
  methods: {
    getClickPos() {
      let $this = this;
      let handler = new window.Cesium.ScreenSpaceEventHandler(
        window.viewer.canvas
      );
      handler.setInputAction((event) => {
        let cartesian = $this.returnCartesian(window.viewer, event.position);
        console.log(cartesian);
      }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    returnCartesian(viewer, position) {
      let cartesian = viewer.scene.pick(position);
      if (!cartesian) {
        let ray = viewer.camera.getPickRay(position);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      }
      return cartesian;
    },
    stop() {
      window.viewer.entities.removeAll();
    },
    start() {
      const Cesium = window.Cesium;
      const viewer = window.viewer;
      var waterHeight = 2200;
      viewer.entities.add({
        polygon: {
          hierarchy: this.positions,
          material: Cesium.Color.LIGHTBLUE.withAlpha(0.5),
          extrudedHeight: new Cesium.CallbackProperty(function () {
            return waterHeight;
          }, false),
        },
      });
      viewer.clock.onTick.addEventListener(function () {
        if (waterHeight > 2500) {
          waterHeight = 2200;
        }
        waterHeight += 0.3;
      });
    },
    initRiver(points) {
      const Cesium = window.Cesium;
      const viewer = window.viewer;
      let waterPrimitive = new Cesium.Primitive({
        allowPicking: false,
        asynchronous: false,
        geometryInstances: new Cesium.GeometryInstance({
          id: "initRiver",
          geometry: new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(points),
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
            extrudedHeight: 2200,
            height: 0,
          }),
        }),
        appearance: new Cesium.EllipsoidSurfaceAppearance({
          aboveGroud: true,
          material: new Cesium.Material({
            fabric: {
              type: "Water",
              uniforms: {
                blendColor: new Cesium.Color(0, 0, 1, 0.3),
                normalMap: require("./water.jpg"),
                //频率速度设置
                frequency: 200,
                animationSpeed: 0.01,
                amplitude: 10,
              },
            },
          }),
        }),
      });
      viewer.scene.primitives.add(waterPrimitive);
    },
  },
};
</script>
<style lang="scss" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;
  .flood-tools {
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
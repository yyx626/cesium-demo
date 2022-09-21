<template>
  <div id="cesiumContainer">
    <div class="dynamic-trail-tools">
      <el-switch
        v-model="openRandom"
        active-text="已开启动态色"
        inactive-text="已关闭动态色"
      >
      </el-switch>
    </div>
  </div>
</template>
<script>
import "./DynamicTrailMaterialProperty4Ellipsoid";
const Cesium = window.Cesium;
let viewer = undefined;
export default {
  data() {
    return {
      color: undefined,
      openRandom: false,
      timer: undefined,
    };
  },
  watch: {
    openRandom(val) {
      if (val) {
        this.timer = setInterval(() => {
          const newColor = Cesium.Color.fromRandom();
          this.color = newColor.withAlpha(1);
        }, 1000);
      } else {
        clearInterval(this.timer);
      }
    },
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
    this.initEntity();
  },
  methods: {
    initEntity() {
      const $this = this;
      $this.color = Cesium.Color.PURPLE;
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(119.5, 35.5),
        ellipsoid: {
          radii: new Cesium.Cartesian3(1000.0, 1000.0, 1000.0),
          material: new Cesium.DynamicTrailMaterialProperty4Ellipsoid({
            color: new Cesium.CallbackProperty(function () {
              return $this.color;
            }, false),
            speed: 5.0,
          }),
        },
      });
      viewer.flyTo(viewer.entities);
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
  .dynamic-trail-tools {
    position: absolute;
    border: 1px solid rgb(31, 30, 30);
    border-radius: 5px;
    background-color: rgba(66, 65, 65, 0.8);
    z-index: 10;
    margin: 10px;
    padding: 10px;
  }
}
</style>
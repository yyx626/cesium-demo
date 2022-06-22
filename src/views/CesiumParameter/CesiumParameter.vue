<template>
  <div id="cesiumContainer">
    <div class="parameter-tools">
      <div class="globe-parameter">
        <el-checkbox v-model="globe">地球</el-checkbox>
        <el-checkbox v-model="globeHalo">地球光晕</el-checkbox>
        <el-checkbox v-model="light">光照（阴影）</el-checkbox>
        <el-checkbox v-model="sun">太阳</el-checkbox>
        <el-checkbox v-model="moon">月亮</el-checkbox>
        <el-checkbox v-model="skyBox">天空盒</el-checkbox>
        <el-checkbox v-model="backgroundColor">背景色(红)</el-checkbox>
      </div>
      <div>
        <div class="imagelayer-parameter">
          <span class="demonstration">亮度：</span>
          <el-slider
            class="p-slider"
            v-model="Brightness"
            :min="0"
            :max="3"
            :step="0.01"
          ></el-slider>
          <el-input v-model="Brightness" size="mini"></el-input>
        </div>
        <div class="imagelayer-parameter">
          <span class="demonstration">对比度：</span>
          <el-slider
            class="p-slider"
            v-model="Contrast"
            :min="0"
            :max="3"
            :step="0.01"
          ></el-slider>
          <el-input v-model="Contrast" size="mini"></el-input>
        </div>
        <div class="imagelayer-parameter">
          <span class="demonstration">色调：</span>
          <el-slider
            class="p-slider"
            v-model="Hue"
            :min="0"
            :max="3"
            :step="0.01"
          ></el-slider>
          <el-input v-model="Hue" size="mini"></el-input>
        </div>
        <div class="imagelayer-parameter">
          <span class="demonstration">饱和度：</span>
          <el-slider
            class="p-slider"
            v-model="Saturation"
            :min="0"
            :max="3"
            :step="0.01"
          ></el-slider>
          <el-input v-model="Saturation" size="mini"></el-input>
        </div>
        <div class="imagelayer-parameter">
          <span class="demonstration">伽马校正：</span>
          <el-slider
            class="p-slider"
            v-model="Gamma"
            :min="0"
            :max="3"
            :step="0.01"
          ></el-slider>
          <el-input v-model="Gamma" size="mini"></el-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const Cesium = window.Cesium;
let viewer = undefined;
let imageLayer;
export default {
  data() {
    return {
      globe: true,
      globeHalo: true,
      sun: true,
      light: false,
      moon: true,
      skyBox: true,
      backgroundColor: false,
      Brightness: 1.0, //图层的亮度。1.0 使用未修改的图像颜色。小于 1.0 会使图像更暗，而大于 1.0 会使图像更亮
      Contrast: 1.0, //图层的对比度。1.0 使用未修改的图像颜色。小于 1.0 会降低对比度，而大于 1.0 会增加对比度
      Hue: 0.0, //图层的色调。0.0 使用未修改的图像颜色
      Saturation: 1.0, //图层的饱和度。1.0 使用未修改的图像颜色。小于 1.0 会降低饱和度，而大于 1.0 会增加饱和度
      Gamma: 1.0, //应用于此图层的伽马校正。1.0 使用未修改的图像颜色
    };
  },
  watch: {
    Gamma(val) {
      imageLayer.gamma = val;
    },
    Saturation(val) {
      imageLayer.saturation = val;
    },
    Hue(val) {
      imageLayer.hue = val;
    },
    Contrast(val) {
      imageLayer.contrast = val;
    },
    Brightness(val) {
      imageLayer.brightness = val;
    },
    backgroundColor(val) {
      this.skyBox = !val;
      viewer.scene.backgroundColor = Cesium.Color.RED;
    },
    globe(val) {
      viewer.scene.globe.show = val;
    },
    skyBox(val) {
      viewer.scene.skyBox.show = val;
    },
    moon(val) {
      viewer.scene.moon.show = val;
    },
    light(val) {
      viewer.scene.globe.enableLighting = val;
    },
    sun(val) {
      viewer.scene.sun.show = val;
    },
    globeHalo(val) {
      viewer.scene.skyAtmosphere.show = val;
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
    imageLayer = viewer.imageryLayers.get(0);
    this.initCamera();
  },
  methods: {
    initCamera() {
      viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(110, 40, 9000000.0),
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
  .parameter-tools {
    position: absolute;
    display: flex;
    margin: 10px;
    padding: 10px;
    z-index: 10;
    background-color: rgba(70, 68, 68, 0.8);
    border: 1px solid rgb(37, 37, 37);
    border-radius: 5px;
    flex-direction: column;
    max-width: 400px;
    .globe-parameter {
      display: flex;
      flex-wrap: wrap;
    }
    .imagelayer-parameter {
      display: flex;
      color: white;
      align-items: center;
      .demonstration {
        display: inline-block;
        width: 70px;
        font-size: 14px;
        text-align: right;
      }
      .p-slider {
        width: 200px;
        margin: 0 10px;
      }
      .el-input {
        width: 65px;
      }
    }
  }
}
</style>
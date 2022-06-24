<template>
  <div id="cesiumContainer">
    <div class="radar-effect-tools">
      <span class="tool-item">
        <el-switch
          v-model="loop"
          active-text="重复模式"
          inactive-text="回摆模式"
        >
        </el-switch>
      </span>
      <span class="tool-item">
        <label>最大角度：</label>
        <el-input-number
          v-model="maxAngle"
          :min="0"
          :max="360"
          size="mini"
        ></el-input-number>
      </span>
      <span class="tool-item">
        <label>扫描速度：</label>
        <el-input-number
          v-model="speed"
          :min="0.1"
          :max="1"
          size="mini"
          :step="0.1"
        ></el-input-number>
      </span>
      <span class="tool-item">
        <label>外径大小：</label>
        <el-input-number
          v-model="radii"
          :min="1000"
          :max="10000"
          size="mini"
          :step="200"
        ></el-input-number>
      </span>
      <span class="tool-item">
        <label>内径大小：</label>
        <el-input-number
          v-model="innerRadii"
          :min="1"
          :max="1000"
          size="mini"
          :step="10"
        ></el-input-number>
      </span>
      <span class="tool-item">
        <label>左偏角值：</label>
        <el-input-number
          v-model="minimumClock"
          :min="0"
          :max="60"
          size="mini"
        ></el-input-number>
      </span>
      <span class="tool-item">
        <label>右偏角值：</label>
        <el-input-number
          v-model="maximumClock"
          :min="60"
          :max="360"
          size="mini"
        ></el-input-number>
      </span>
      <span class="tool-item">
        <label>填充色：</label>
        <el-color-picker v-model="fillColor" show-alpha size="mini">
        </el-color-picker>
        <label>边框色：</label>
        <el-color-picker v-model="outlineColor" show-alpha size="mini">
        </el-color-picker>
      </span>
    </div>
  </div>
</template>
<script>
const Cesium = window.Cesium
let viewer = undefined
let radar = undefined
export default {
  data() {
    return {
      loop: false,
      maxAngle: 180,
      speed: 0.2,
      up: true, //回摆模式方向
      radii: 5000,
      innerRadii: 10,
      minimumClock: 0,
      maximumClock: 60,
      fillColor: 'rgba(255, 69, 0,  0.2)',
      outlineColor: 'rgba(255, 69, 0, 1)',
    }
  },
  watch: {
    minimumClock(val) {
      radar.ellipsoid.minimumClock._value = Cesium.Math.toRadians(val)
    },
    maximumClock(val) {
      radar.ellipsoid.maximumClock._value = Cesium.Math.toRadians(val)
    },
    radii(val) {
      radar.ellipsoid.radii._value = new Cesium.Cartesian3(val, val, 1)
    },
    innerRadii(val) {
      radar.ellipsoid.innerRadii._value = new Cesium.Cartesian3(val, val, 1)
    },
    fillColor(val) {
      radar.ellipsoid.material = Cesium.Color.fromCssColorString(val)
    },
    outlineColor(val) {
      radar.ellipsoid.outlineColor = Cesium.Color.fromCssColorString(val)
    },
  },
  mounted() {
    let key =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDhhOThhNy0zMzUzLTRiZDktYWM3Ni00NGI5MGY2N2UwZDUiLCJpZCI6MjQzMjYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODUwMzUwNDh9.DYuDF_RPKe5_8w849_y-sutM68LM51O9o3bTt_3rF1w'
    Cesium.Ion.defaultAccessToken = key
    window.viewer = viewer = new Cesium.Viewer('cesiumContainer', {
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
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
      selectionIndicator: false,
      infoBox: false,
    })
    viewer._cesiumWidget._creditContainer.style.display = 'none' // 隐藏版权
    this.initRadar()
  },
  methods: {
    initRadar() {
      let num = 0
      const position = new Cesium.Cartesian3.fromDegrees(110, 40, 1)
      radar = viewer.entities.add({
        position: position,
        orientation: new Cesium.CallbackProperty(() => {
          let speed = this.speed
          if (this.loop) {
            num += speed
            if (num >= this.maxAngle) num = 0
          } else {
            this.up ? (num += speed) : (num -= speed)
            if (num >= this.maxAngle) this.up = false
            if (num <= 0) this.up = true
          }
          return Cesium.Transforms.headingPitchRollQuaternion(
            position,
            new Cesium.HeadingPitchRoll((num * Math.PI) / 180, 0, 0)
          )
        }, false),
        ellipsoid: {
          radii: new Cesium.Cartesian3(5000.0, 5000.0, 1.0), // 外半径
          innerRadii: new Cesium.Cartesian3(1.0, 1.0, 1.0), // 内半径
          minimumClock: Cesium.Math.toRadians(0),
          maximumClock: Cesium.Math.toRadians(60),
          minimumCone: Cesium.Math.toRadians(90), //建议设置上下偏角为90
          maximumCone: Cesium.Math.toRadians(90),
          material: Cesium.Color.fromCssColorString('rgba(255, 69, 0,  0.2)'),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('rgba(255, 69, 0, 1)'),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      })
      viewer.flyTo(viewer.entities)
    },
  },
}
</script>
<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
  .radar-effect-tools {
    position: absolute;
    margin: 10px;
    padding: 10px;
    z-index: 10;
    background-color: rgba(61, 61, 61, 0.8);
    border: 1px solid rgb(24, 23, 23);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    .tool-item {
      display: flex;
      margin: 5px 0;
      color: white;
      .el-color-picker {
        margin-right: 10px;
      }
    }
  }
}
</style>
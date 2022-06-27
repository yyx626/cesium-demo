<template>
  <div id="cesiumContainer">
    <div class="measure-tools">
      <el-button size="mini" @click="distance">空间距离</el-button>
      <el-button size="mini" @click="area">空间面积</el-button>
      <el-button size="mini" @click="triangles">三角量测</el-button>
      <el-button size="mini" @click="clear">清除</el-button>
    </div>
  </div>
</template>

<script>
import Measure from './Measure.js'
const Cesium = window.Cesium
let viewer = undefined
let measure
export default {
  data() {
    return {
    }
  },
  mounted() {
    let key =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDhhOThhNy0zMzUzLTRiZDktYWM3Ni00NGI5MGY2N2UwZDUiLCJpZCI6MjQzMjYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODUwMzUwNDh9.DYuDF_RPKe5_8w849_y-sutM68LM51O9o3bTt_3rF1w'
    Cesium.Ion.defaultAccessToken = key
    window.viewer = viewer = new Cesium.Viewer('cesiumContainer', {
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
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
    })
    viewer._cesiumWidget._creditContainer.style.display = 'none' // 隐藏版权
    measure = new Measure(viewer)
    this.initModel()
    this.getLocation()
  },
  methods: {
    distance() {
      measure.drawLineMeasureGraphics({
        clampToGround: false,
        callback: () => {},
      })
    },
    area() {
      measure.drawAreaMeasureGraphics({
        clampToGround: false,
        callback: () => {},
      })
    },
    triangles() {
      measure.drawTrianglesMeasureGraphics({
        callback: () => {},
      })
    },
    clear() {
      measure.clearAll()
    },
    initModel() {
      let tilesetModel = new Cesium.Cesium3DTileset({
        url: `data/dayanta/tileset.json`,
      })
      viewer.scene.primitives.add(tilesetModel)
      window.viewer.flyTo(tilesetModel)
    },
    getLocation() {
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
      handler.setInputAction(function (event) {
        let earthPosition = viewer.scene.pickPosition(event.position)
        if (Cesium.defined(earthPosition)) {
          let cartographic = Cesium.Cartographic.fromCartesian(earthPosition)
          let lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5)
          let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5)
          let height = cartographic.height.toFixed(2)
          console.log(earthPosition, {
            lon: lon,
            lat: lat,
            height: height,
          })
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
  },
}
</script>

<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
  .measure-tools {
    position: absolute;
    z-index: 10;
    border: 1px solid rgb(31, 30, 30);
    background-color: rgba(78, 77, 77, 0.8);
    border-radius: 5px;
    margin: 10px;
    padding: 10px;
  }
}
</style>
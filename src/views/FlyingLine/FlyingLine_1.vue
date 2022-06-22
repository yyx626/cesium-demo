<template>
  <div id="cesiumContainer"></div>
</template>
<script>
import EchartsLayer from './EchartsLayer'
import pathOption from './data_1'
const Cesium = window.Cesium
let viewer = undefined
export default {
  data() {
    return {}
  },
  mounted() {
    let key =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDhhOThhNy0zMzUzLTRiZDktYWM3Ni00NGI5MGY2N2UwZDUiLCJpZCI6MjQzMjYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODUwMzUwNDh9.DYuDF_RPKe5_8w849_y-sutM68LM51O9o3bTt_3rF1w'
    Cesium.Ion.defaultAccessToken = key
    window.viewer = viewer = new Cesium.Viewer('cesiumContainer', {
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
        enablePickFeatures: false,
      }),
      terainProvider: Cesium.createWorldTerrain(),
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
    this.initCamera()
    this.initEchartsMap()
  },
  methods: {
    initEchartsMap() {
      let echartsLayer = new EchartsLayer(viewer, pathOption)
      // 绑定点击事件
      echartsLayer._chart.on('click', (params) => {
        console.log(20180824012121, params)
      })
    },
    initCamera() {
      viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(
          114.46654690269462,
          22.05893520102907,
          1739337
        ),
        orientation: {
          heading: 6.2725992867021105,
          pitch: -1.179484583028378,
          roll: 6.282598084227001,
        },
      })
    },
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
}
</script>
<style lang="scss" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
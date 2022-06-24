<template>
  <div id="cesiumContainer"></div>
</template>
<script>
const Cesium = window.Cesium
let viewer = undefined
let radar = undefined
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
    this.radarSolidScan({
      position: [119.05, 35, 0],
      radius: 1000.0,
      colorOut: Cesium.Color.YELLOW.withAlpha(0.3),
      colorIn: Cesium.Color.GREEN.withAlpha(0.7),
      speed: 4.0,
    })
    viewer.flyTo(viewer.entities)
  },
  methods: {
    radarSolidScan(options) {
      let radius = options.radius
      let centerLng = options.position[0]
      let centerLat = options.position[1]
      let height = options.position[2]

      let heading = 0
      let arr = calculatePane(options.position, radius, heading)
      // 每一帧刷新时调用
      viewer.clock.onTick.addEventListener(() => {
        heading += options.speed
        arr = calculatePane(options.position, radius, heading)
      })

      radar = viewer.entities.add({
        position: new Cesium.Cartesian3.fromDegrees(
          centerLng,
          centerLat,
          height
        ),
        name: '立体雷达扫描',
        ellipsoid: {
          radii: new Cesium.Cartesian3(radius, radius, radius),
          material: options.colorOut,
          outline: true,
          outlineColor: options.colorOut,
          outlineWidth: 1,
          maximumCone: Cesium.Math.toRadians(90),
        },
        wall: {
          positions: new Cesium.CallbackProperty(() => {
            return Cesium.Cartesian3.fromDegreesArrayHeights(arr.positionArr)
          }, false),
          material: options.colorIn,
          minimumHeights: arr.bottomArr,
        },
      })

      // 计算平面扫描范围
      function calculatePane(position, radius, heading) {
        let x1 = position[0],
          y1 = position[1],
          height = position[2]
        let m = Cesium.Transforms.eastNorthUpToFixedFrame(
          Cesium.Cartesian3.fromDegrees(x1, y1, height)
        )
        let rx = radius * Math.cos((heading * Math.PI) / 180.0)
        let ry = radius * Math.sin((heading * Math.PI) / 180.0)
        let translation = Cesium.Cartesian3.fromElements(rx, ry, height)
        let d = Cesium.Matrix4.multiplyByPoint(
          m,
          translation,
          new Cesium.Cartesian3()
        )
        let c = Cesium.Cartographic.fromCartesian(d)
        let x2 = Cesium.Math.toDegrees(c.longitude)
        let y2 = Cesium.Math.toDegrees(c.latitude)
        return calculateSector(x1, y1, x2, y2, height)
      }

      // 计算竖直扇形
      function calculateSector(x1, y1, x2, y2, height) {
        let positionArr = []
        let bottomArr = []
        positionArr.push(x1, y1, height)
        bottomArr.push(height)
        let radius = Cesium.Cartesian3.distance(
          Cesium.Cartesian3.fromDegrees(x1, y1),
          Cesium.Cartesian3.fromDegrees(x2, y2)
        )
        // 角度设置为0-90,也就是1/4圆
        for (let i = 0; i <= 90; i++) {
          let h = radius * Math.sin((i * Math.PI) / 180.0)
          let r = Math.cos((i * Math.PI) / 180.0)
          let x = (x2 - x1) * r + x1
          let y = (y2 - y1) * r + y1
          positionArr.push(x, y, h + height)
          bottomArr.push(height)
        }
        return { positionArr, bottomArr }
      }
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
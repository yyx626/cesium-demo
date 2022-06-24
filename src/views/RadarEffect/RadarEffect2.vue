<template>
  <div id="cesiumContainer"></div>
</template>
<script>
const Cesium = window.Cesium
let viewer = undefined
export default {
  data() {
    return {}
  },
  watch: {},
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
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(119.05, 35, 15000.0),
    })
  },
  methods: {
    initRadar() {
      viewer.scene.globe.depthTestAgainstTerrain = true
      this.addRadarScanPostStage(
        Cesium.Cartographic.fromDegrees(119, 35, 1000),
        2000,
        Cesium.Color.BLUE,
        2000,
        1.0
      )
      this.addRadarScanPostStage(
        Cesium.Cartographic.fromDegrees(119.05, 35, 1000),
        2000,
        Cesium.Color.BLUE,
        2000,
        4.0
      )
      this.addRadarScanPostStage(
        Cesium.Cartographic.fromDegrees(119.1, 35, 1000),
        2000,
        Cesium.Color.BLUE,
        2000,
        8.0
      )
    },
    addRadarScanPostStage(
      cartographicCenter,
      radius,
      scanColor,
      duration,
      dis
    ) {
      var ScanSegmentShader =
        'uniform sampler2D colorTexture;\n' +
        'uniform sampler2D depthTexture;\n' +
        'varying vec2 v_textureCoordinates;\n' +
        'uniform vec4 u_scanCenterEC;\n' +
        'uniform vec3 u_scanPlaneNormalEC;\n' +
        'uniform vec3 u_scanLineNormalEC;\n' +
        'uniform float u_radius;\n' +
        'uniform vec4 u_scanColor;\n' +
        'vec4 toEye(in vec2 uv, in float depth)\n' +
        ' {\n' +
        ' vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n' +
        ' vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n' +
        ' posInCamera =posInCamera / posInCamera.w;\n' +
        ' return posInCamera;\n' +
        ' }\n' +
        'bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n' +
        '{\n' +
        'vec3 v01 = testPt - ptOnLine;\n' +
        'normalize(v01);\n' +
        'vec3 temp = cross(v01, lineNormal);\n' +
        'float d = dot(temp, u_scanPlaneNormalEC);\n' +
        'return d > 0.5;\n' +
        '}\n' +
        'vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n' +
        '{\n' +
        'vec3 v01 = point -planeOrigin;\n' +
        'float d = dot(planeNormal, v01) ;\n' +
        'return (point - planeNormal * d);\n' +
        '}\n' +
        'float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n' +
        '{\n' +
        'vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);\n' +
        'return length(tempPt - ptOnLine);\n' +
        '}\n' +
        'float getDepth(in vec4 depth)\n' +
        '{\n' +
        'float z_window = czm_unpackDepth(depth);\n' +
        'z_window = czm_reverseLogDepth(z_window);\n' +
        'float n_range = czm_depthRange.near;\n' +
        'float f_range = czm_depthRange.far;\n' +
        'return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n' +
        '}\n' +
        'void main()\n' +
        '{\n' +
        'gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n' +
        'float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n' +
        'vec4 viewPos = toEye(v_textureCoordinates, depth);\n' +
        'vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n' +
        'float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n' +
        'float twou_radius = u_radius * 2.0;\n' +
        'if(dis < u_radius)\n' +
        '{\n' +
        'float f0 = 1.0 -abs(u_radius - dis) / u_radius;\n' +
        'f0 = pow(f0, 64.0);\n' +
        // lineEndPt扫描线
        'vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius * 0.5;\n' +
        'float f = 0.0;\n' +
        'if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz))\n' +
        '{\n' +
        'float dis1= length(prjOnPlane.xyz - lineEndPt);\n' +
        'f = abs(twou_radius -dis1) / twou_radius;\n' +
        'f = pow(f, ' +
        dis.toFixed(1) +
        ');\n' +
        '}\n' +
        //外,内边框颜色
        'gl_FragColor = mix(gl_FragColor, u_scanColor, f + f0);\n' +
        '}\n' +
        '}\n'

      var _Cartesian3Center =
        Cesium.Cartographic.toCartesian(cartographicCenter)
      var _Cartesian4Center = new Cesium.Cartesian4(
        _Cartesian3Center.x,
        _Cartesian3Center.y,
        _Cartesian3Center.z,
        1
      )

      var _CartographicCenter1 = new Cesium.Cartographic(
        cartographicCenter.longitude,
        cartographicCenter.latitude,
        cartographicCenter.height + 100
      )
      var _Cartesian3Center1 =
        Cesium.Cartographic.toCartesian(_CartographicCenter1)
      var _Cartesian4Center1 = new Cesium.Cartesian4(
        _Cartesian3Center1.x,
        _Cartesian3Center1.y,
        _Cartesian3Center1.z,
        1
      )

      var _CartographicCenter2 = new Cesium.Cartographic(
        cartographicCenter.longitude + Cesium.Math.toRadians(0.001),
        cartographicCenter.latitude,
        cartographicCenter.height
      )
      var _Cartesian3Center2 =
        Cesium.Cartographic.toCartesian(_CartographicCenter2)
      var _Cartesian4Center2 = new Cesium.Cartesian4(
        _Cartesian3Center2.x,
        _Cartesian3Center2.y,
        _Cartesian3Center2.z,
        1
      )
      var _RotateQ = new Cesium.Quaternion()
      var _RotateM = new Cesium.Matrix3()

      var _time = new Date().getTime()

      var _scratchCartesian4Center = new Cesium.Cartesian4()
      var _scratchCartesian4Center1 = new Cesium.Cartesian4()
      var _scratchCartesian4Center2 = new Cesium.Cartesian4()
      var _scratchCartesian3Normal = new Cesium.Cartesian3()
      var _scratchCartesian3Normal1 = new Cesium.Cartesian3()

      var ScanPostStage = new Cesium.PostProcessStage({
        fragmentShader: ScanSegmentShader,
        uniforms: {
          u_scanCenterEC: () => {
            return Cesium.Matrix4.multiplyByVector(
              viewer.camera.viewMatrix,
              _Cartesian4Center,
              _scratchCartesian4Center
            )
          },
          u_scanPlaneNormalEC: () => {
            var temp = Cesium.Matrix4.multiplyByVector(
              viewer.camera.viewMatrix,
              _Cartesian4Center,
              _scratchCartesian4Center
            )
            var temp1 = Cesium.Matrix4.multiplyByVector(
              viewer.camera.viewMatrix,
              _Cartesian4Center1,
              _scratchCartesian4Center1
            )
            _scratchCartesian3Normal.x = temp1.x - temp.x
            _scratchCartesian3Normal.y = temp1.y - temp.y
            _scratchCartesian3Normal.z = temp1.z - temp.z

            Cesium.Cartesian3.normalize(
              _scratchCartesian3Normal,
              _scratchCartesian3Normal
            )
            return _scratchCartesian3Normal
          },
          u_radius: radius,
          u_scanLineNormalEC: () => {
            var temp = Cesium.Matrix4.multiplyByVector(
              viewer.camera.viewMatrix,
              _Cartesian4Center,
              _scratchCartesian4Center
            )
            var temp1 = Cesium.Matrix4.multiplyByVector(
              viewer.camera.viewMatrix,
              _Cartesian4Center1,
              _scratchCartesian4Center1
            )
            var temp2 = Cesium.Matrix4.multiplyByVector(
              viewer.camera.viewMatrix,
              _Cartesian4Center2,
              _scratchCartesian4Center2
            )

            _scratchCartesian3Normal.x = temp1.x - temp.x
            _scratchCartesian3Normal.y = temp1.y - temp.y
            _scratchCartesian3Normal.z = temp1.z - temp.z

            Cesium.Cartesian3.normalize(
              _scratchCartesian3Normal,
              _scratchCartesian3Normal
            )

            _scratchCartesian3Normal1.x = temp2.x - temp.x
            _scratchCartesian3Normal1.y = temp2.y - temp.y
            _scratchCartesian3Normal1.z = temp2.z - temp.z

            var tempTime =
              ((new Date().getTime() - _time) % duration) / duration

            Cesium.Quaternion.fromAxisAngle(
              _scratchCartesian3Normal,
              tempTime * Cesium.Math.PI * 2, // 扫描幅度为一圈
              _RotateQ
            )
            Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM)
            Cesium.Matrix3.multiplyByVector(
              _RotateM,
              _scratchCartesian3Normal1,
              _scratchCartesian3Normal1
            )
            Cesium.Cartesian3.normalize(
              _scratchCartesian3Normal1,
              _scratchCartesian3Normal1
            )
            return _scratchCartesian3Normal1
          },
          u_scanColor: scanColor,
        },
      })
      return viewer.scene.postProcessStages.add(ScanPostStage)
    },
  },
}
</script>
<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
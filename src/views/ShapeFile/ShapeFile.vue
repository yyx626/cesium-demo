<template>
  <div id="cesiumContainer">
    <div class="shp-tools">
      <div class="tool-item">
        <label class="item-title" for="_shpFile"
          >本地shp - ( 必须同时选择.shp和.dbf两文件 )</label
        >
        <span>
          <input
            type="file"
            id="_shpFile"
            multiple
            accept=".shp,.dbf"
            @change="loadShp4Localhost"
          />
        </span>
      </div>
      <div class="tool-item">
        <label class="item-title" for="urlPath"
          >服务端shp ( 例：http://localhost/test.shp )</label
        >
        <span class="server-load">
          <input
            type="text"
            style="width: 230px; margin-right: 5px"
            id="urlPath"
            :value="serviceUrl"
          />
          <el-button size="mini" @click="loadShp4Server">加载</el-button>
        </span>
      </div>
      <div class="tool-item">
        <el-switch
          v-model="boolDownload"
          active-text="已开启自动下载"
          inactive-text="已关闭自动下载"
        >
        </el-switch>
      </div>
    </div>
  </div>
</template>
<script>
import * as shapefile from "./shapefile";
const Cesium = window.Cesium;
let viewer = undefined;
export default {
  data() {
    return {
      serviceUrl: `${window.location.origin}/data/shape/mask.shp`,
      boolDownload: false,
    };
  },
  mounted() {
    let key =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDhhOThhNy0zMzUzLTRiZDktYWM3Ni00NGI5MGY2N2UwZDUiLCJpZCI6MjQzMjYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODUwMzUwNDh9.DYuDF_RPKe5_8w849_y-sutM68LM51O9o3bTt_3rF1w";
    Cesium.Ion.defaultAccessToken = key;
    window.viewer = viewer = new Cesium.Viewer("cesiumContainer", {
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      }),
      // terrainProvider: this.Cesium.createWorldTerrain(),
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
  },
  methods: {
    loadShp4Server() {
      var _shpData, _dbfData;
      _shpData = document.getElementById("urlPath").value.trim();
      if (_shpData.indexOf(".shp") < 0) {
        console.log("注意：输入的shp服务端地址有误！");
        return;
      }
      _dbfData = _shpData.substr(0, _shpData.length - 3) + "dbf";
      this.CreateAndLoadShp(_shpData, _dbfData, { encoding: "utf-8" });
    },
    loadShp4Localhost() {
      const $this = this;
      var shpFile, dbfFile, _shpData, _dbfData;
      var filesSelect = Array.from(document.getElementById("_shpFile").files);
      if (filesSelect.length != 2) {
        console.log(
          "注意：所选择内容只能是一个图层的.shp和.dbf这两个文件文件！"
        );
        return;
      }
      filesSelect.forEach((element) => {
        if (element.name.indexOf(".shp") > 0) {
          shpFile = element;
        } else if (element.name.indexOf(".dbf") > 0) {
          dbfFile = element;
        }
      });
      if (!shpFile || !dbfFile) {
        console.log(
          "注意：所选择内容必须包括同一个图层的.shp和.dbf这两个文件文件！"
        );
        return;
      }
      var readShp = new FileReader();
      readShp.readAsArrayBuffer(shpFile, "UTF-8"); //读取文件的内容
      readShp.onload = function () {
        _shpData = this.result;
        var readDbf = new FileReader();
        readDbf.readAsArrayBuffer(dbfFile, "UTF-8"); //读取文件的内容
        readDbf.onload = function () {
          _dbfData = this.result;
          $this.CreateAndLoadShp(_shpData, _dbfData, { encoding: "utf-8" });
        };
      };
    },
    CreateAndLoadShp(shpData, dbfData, options) {
      const $this = this;
      var myFeatures = [];
      shapefile
        .open(shpData, dbfData, options)
        .then((source) =>
          source.read().then(function log(result) {
            if (result.done) {
              var _mGeoJson = {
                type: "FeatureCollection",
                features: myFeatures,
              };
              if ($this.boolDownload) {
                $this.funDownload(JSON.stringify(_mGeoJson), "default.geojson");
              }
              const layer = viewer.dataSources.add(
                Cesium.GeoJsonDataSource.load(_mGeoJson, {
                  clampToGround: false,
                })
              );
              viewer.zoomTo(layer);
              return;
            } else {
              var _result = result.value;
              var _curFeature = {
                type: _result.type,
                geometry: {
                  type: _result.geometry.type,
                  coordinates: _result.geometry.coordinates,
                },
                properties: _result.properties,
              };
              myFeatures.push(_curFeature);
              return source.read().then(log);
            }
          })
        )
        .catch((error) => console.error(error.stack));
    },
    funDownload(content, filename) {
      var eleLink = document.createElement("a"); // 创建隐藏的可下载链接
      eleLink.download = filename;
      eleLink.style.display = "none";
      var blob = new Blob([content]); // 将字符内容转成blob
      eleLink.href = URL.createObjectURL(blob);
      document.body.appendChild(eleLink); // 点击触发
      eleLink.click();
      document.body.removeChild(eleLink); // 然后移除创建的元素
      console.log("下载完成");
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
  .shp-tools {
    position: absolute;
    margin: 10px;
    border: 1px solid rgb(29, 29, 29);
    border-radius: 5px;
    background-color: rgba(83, 82, 82, 0.8);
    z-index: 10;
    color: white;
    .tool-item {
      display: flex;
      border: 1px dashed darkgray;
      margin: 10px;
      padding: 5px;
      flex-direction: column;
      align-items: flex-start;
      .item-title {
        display: block;
        margin-bottom: 5px;
        font-size: 15px;
      }
      .server-load {
        display: flex;
      }
    }
  }
}
</style>
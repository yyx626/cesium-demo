<template>
  <div id="cesiumContainer">
    <div class="imagery-layer-tools">
      <div class="item">
        <div class="title">Arcgis地图服务-智图Geoq</div>
        <el-select
          v-model="geoq"
          placeholder="请选择"
          size="mini"
          style="margin-right: 10px"
        >
          <el-option
            v-for="item in geoqList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
        <el-button size="mini" @click="addArcgis4Geoq('WGS84')"
          >无偏移</el-button
        >
        <el-button size="mini" @click="addArcgis4Geoq()">有偏移</el-button>
      </div>
      <div class="item">
        <div class="title">百度地图服务</div>
        <span>
          <el-button size="mini" @click="addBaiduImage(0, 'WGS84')"
            >百度影像-无偏移</el-button
          >
          <el-button size="mini" @click="addBaiduImage(0)"
            >百度影像-有偏移</el-button
          >
        </span>
        <span>
          <el-button size="mini" @click="addBaiduImage(1, 'WGS84')"
            >百度矢量-无偏移</el-button
          >
          <el-button size="mini" @click="addBaiduImage(1)"
            >百度矢量-有偏移</el-button
          >
        </span>
        <span>
          <el-select
            v-model="bdStyle"
            placeholder="请选择"
            size="mini"
            style="margin-right: 10px"
          >
            <el-option
              v-for="item in bdList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-button size="mini" @click="addBaiduImage(2, 'WGS84')"
            >无偏移</el-button
          >
          <el-button size="mini" @click="addBaiduImage(2)">有偏移</el-button>
        </span>
      </div>
      <div class="item">
        <div class="title">高德地图服务</div>
        <span>
          <span>
            底图类型：
            <el-select
              v-model="amapStyle"
              placeholder="请选择"
              size="mini"
              style="margin-right: 10px"
            >
              <el-option
                v-for="item in amapStyleList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </span>
          <span>
            注记类型：
            <el-select
              v-model="amapNotes"
              placeholder="请选择"
              size="mini"
              style="margin-right: 10px"
            >
              <el-option
                v-for="item in amapNotesList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </span>
          <el-button size="mini" @click="addAmapImage('WGS84')"
            >无偏移</el-button
          >
          <el-button size="mini" @click="addAmapImage()">有偏移</el-button>
        </span>
      </div>
      <div class="item">
        <div class="title">腾讯地图服务</div>
        <span>
          <el-button size="mini" @click="addTencentImage(0, 'WGS84')"
            >腾讯影像-无偏移</el-button
          >
          <el-button size="mini" @click="addTencentImage(0)"
            >腾讯影像-有偏移</el-button
          >
        </span>
        <span>
          <el-select
            v-model="tencenStyle"
            placeholder="请选择"
            size="mini"
            style="margin-right: 10px"
          >
            <el-option
              v-for="item in tencenStyletList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-button size="mini" @click="addTencentImage(1, 'WGS84')"
            >无偏移</el-button
          >
          <el-button size="mini" @click="addTencentImage(1)">有偏移</el-button>
        </span>
      </div>
    </div>
    <div class="url-info">
      <span>当前服务地址：</span>
      <span>{{ serviceURL }}</span>
    </div>
  </div>
</template>
<script>
const Cesium = window.Cesium;
let viewer = undefined;
let IL = undefined;
import json from "./data/shandong.json";
import ImageryLayer from "./ImageryLayer.js";
export default {
  data() {
    return {
      serviceURL: "--",
      geoqList: [
        "ChinaOnlineCommunity_Mobile",
        "ChinaOnlineCommunityENG",
        "ChinaOnlineCommunity",
        "ChinaOnlineStreetGray",
        "ChinaOnlineStreetPurplishBlue",
        "ChinaOnlineStreetWarm",
      ],
      geoq: "ChinaOnlineStreetPurplishBlue",
      bdList: [
        "normal",
        "light",
        "dark",
        "redalert",
        "googlelite",
        "grassgreen",
        "midnight",
        "pink",
        "darkgreen",
        "bluish",
        "grayscale",
        "hardedge",
      ],
      bdStyle: "normal",
      amapStyleList: ["6", "7", "8"],
      amapStyle: "6",
      amapNotesList: ["1", "2"],
      amapNotes: "1",
      tencenStyletList: ["1", "2", "3", "4", "8"],
      tencenStyle: "1",
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
    IL = new ImageryLayer();
  },
  methods: {
    addArcgis4Geoq(crs) {
      this.serviceURL =
        "https://map.geoq.cn/ArcGIS/rest/services/" + this.geoq + "/MapServer";
      let options = {
        url: this.serviceURL,
      };
      viewer.imageryLayers.addImageryProvider(
        new IL.ArcgisImageryLayerProvider(options, crs)
      );
      setTimeout(() => {
        viewer.imageryLayers.remove(viewer.imageryLayers._layers[0]);
      }, 2000);
    },
    addBaiduImage(type, crs) {
      this.serviceURL =
        type == 0
          ? "http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46"
          : type == 1
          ? "http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl&v=020"
          : "http://api{s}.map.bdimg.com/customimage/tile?x={x}&y={y}&z={z}&scale=1&customid={style}";
      let options = {
        url: this.serviceURL,
        crs: crs,
        style: this.bdStyle,
      };
      viewer.imageryLayers.addImageryProvider(
        new IL.BaiduImageryLayerProvider(options)
      );
      setTimeout(() => {
        viewer.imageryLayers.remove(viewer.imageryLayers._layers[0]);
      }, 2000);
    },
    addAmapImage(crs) {
      this.serviceURL =
        "https://wprd{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=" +
        this.amapNotes +
        "&style=" +
        this.amapStyle;
      let options = {
        url: this.serviceURL,
        crs: crs,
      };
      viewer.imageryLayers.addImageryProvider(
        new IL.AmapImageryLayerProvider(options)
      );
      setTimeout(() => {
        viewer.imageryLayers.remove(viewer.imageryLayers._layers[0]);
      }, 2000);
    },
    addTencentImage(type, crs) {
      this.serviceURL =
        type == 0
          ? "https://p{s}.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=400"
          : "https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid={style}&scene=0&version=347";
      let options = {
        url: this.serviceURL,
        style: this.tencenStyle,
        crs: crs,
      };
      viewer.imageryLayers.addImageryProvider(
        new IL.TencentImageryLayerProvider(options)
      );
      setTimeout(() => {
        viewer.imageryLayers.remove(viewer.imageryLayers._layers[0]);
      }, 2000);
    },
    initData() {
      let data = viewer.dataSources.add(Cesium.GeoJsonDataSource.load(json));
      viewer.flyTo(data);
    },
  },
};
</script>
<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
  .imagery-layer-tools {
    position: absolute;
    max-width: 30%;
    z-index: 10;
    margin: 10px;
    padding: 5px;
    border: 1px solid rgb(27, 27, 27);
    background-color: rgba(63, 63, 62, 0.8);
    border-radius: 5px;
    color: white;
    text-align: left;
    .item {
      border: 1px dashed rgba(255, 0, 0, 0.6);
      padding: 5px;
      .title {
        margin-bottom: 5px;
      }
      span {
        display: block;
        margin: 5px 0;
      }
    }
  }
  .url-info {
    position: absolute;
    right: 0;
    bottom: 25px;
    padding: 5px;
    margin: 5px;
    z-index: 10;
    background-color: rgba(87, 86, 86, 0.9);
    color: white;
    border: 1px solid rgb(37, 37, 37);
    border-radius: 3px;
    font-size: 0.8rem;
  }
}
</style>
<template>
  <div id="cesiumContainer">
    <div class="path-planning-tools">
      <div class="location-checked">
        <label>出发地：</label>
        <el-select
          v-model="originLocation"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="originRemoteMethod"
          :loading="originLoading"
          size="mini"
        >
          <el-option
            v-for="item in originOptions"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <i
          class="el-icon-location-information"
          @click="flyToLocation(originLocation)"
        ></i>
      </div>
      <div class="location-checked">
        <label>目的地：</label>
        <el-select
          v-model="endLocation"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="endRemoteMethod"
          :loading="endLoading"
          size="mini"
        >
          <el-option
            v-for="item in endOptions"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <i
          class="el-icon-location-information"
          @click="flyToLocation(endLocation)"
        ></i>
      </div>
      <div class="path-button">
        <el-button size="mini" @click="createPath(0)">用时最短</el-button>
        <el-button size="mini" @click="createPath(2)">距离最短</el-button>
      </div>
      <div class="distance-time">
        <label>{{ distance }}</label>
        <label>{{ time }}</label>
      </div>
    </div>
  </div>
</template>
<script>
import PathPlanning from "./PathPlanning";
const Cesium = window.Cesium;
let viewer = undefined;
let ppObj = null;
export default {
  data() {
    return {
      originOptions: [],
      originLocation: "",
      originLoading: false,
      endOptions: [],
      endLocation: "",
      endLoading: false,
      distance: "",
      time: "",
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
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
      //关闭点选出现的提示框
      selectionIndicator: false,
      infoBox: false,
    });
    viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权
    ppObj = new PathPlanning(viewer);
  },
  methods: {
    createPath(type) {
      const $this = this;
      viewer.entities.removeAll();
      let origin = $this.originLocation[0] + "," + $this.originLocation[1];
      let destination = $this.endLocation[0] + "," + $this.endLocation[1];
      ppObj.getPathList(origin, destination, type, function (result) {
        console.log("最终路劲规划结果：", result);
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(
            result.start[0],
            result.start[1]
          ),
          billboard: {
            image: require("./images/start.png"),
            show: true,
            scale:0.3,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          },
        });
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(result.end[0], result.end[1]),
          billboard: {
            image: require("./images/end.png"),
            show: true,
            scale:0.3,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          },
        });
        result.paths.forEach((element) => {
          $this.distance = "距离：" + element.distance + "km";
          $this.time = "用时：" + element.time;
          const color = Cesium.Color.fromRandom();
          viewer.entities.add({
            name: "pathLine",
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArray(element.fullPath),
              width: 3,
              material: color.withAlpha(1),
              clampToGround: true,
            },
          });
        });
 
        viewer.zoomTo(viewer.entities);
      });
    },
    flyToLocation(location) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          location[0],
          location[1],
          500
        ),
      });
    },
    endRemoteMethod(query) {
      const $this = this;
      if (query !== "") {
        this.endLoading = true;
        setTimeout(() => {
          this.endLoading = false;
          ppObj.getPOIList(query, function (result) {
            $this.endOptions = [];
            for (let index = 0; index < result.length; index++) {
              const element = result[index];
              $this.endOptions.push({
                label: element.name,
                value: element.location,
                id: element.id,
              });
            }
          });
        }, 200);
      } else {
        this.endOptions = [];
      }
    },
    originRemoteMethod(query) {
      const $this = this;
      if (query !== "") {
        this.originLoading = true;
        setTimeout(() => {
          this.originLoading = false;
          ppObj.getPOIList(query, function (result) {
            $this.originOptions = [];
            for (let index = 0; index < result.length; index++) {
              const element = result[index];
              $this.originOptions.push({
                label: element.name,
                value: element.location,
              });
            }
          });
        }, 200);
      } else {
        this.originOptions = [];
      }
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
  .path-planning-tools {
    position: absolute;
    z-index: 10;
    margin: 10px;
    padding: 10px;
    border: 1px solid rgb(31, 30, 30);
    border-radius: 5px;
    background-color: rgba(87, 85, 85, 0.8);
    display: flex;
    flex-direction: column;
    color: white;
    .location-checked {
      margin: 5px 0;
      .el-icon-location-information {
        cursor: pointer;
        margin-left: 5px;
      }
    }
    .path-button {
      display: flex;
      margin: 5px 0 10px;
    }
    .distance-time {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
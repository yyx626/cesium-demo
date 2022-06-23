<template>
  <div class="profile-echarts">
    <div id="profile-echarts"></div>
    <i class="echarts-close" @click="closeThis">×</i>
  </div>
</template>
<script>
import * as echarts from "echarts";
const Cesium = window.Cesium;
let tipEntity = undefined;
export default {
  props: ["profileData"],
  watch: {
    profileData() {
      document
        .getElementById("profile-echarts")
        .removeAttribute("_echarts_instance_");
      this.initEcharts();
    },
  },
  mounted() {
    this.initEcharts();
    window.addEventListener("resize", () => {
      this.myChart && this.myChart.resize();
    });
  },
  data() {
    return {
      myChart: undefined,
    };
  },
  methods: {
    closeThis() {
      if (tipEntity) {
        window.viewer.entities.remove(tipEntity);
        tipEntity = undefined;
      }
      window.profileEntities.forEach((element) => {
        window.viewer.entities.remove(element);
      });
      window.profileEntities = [];
      this.$parent.show = false;
    },
    initEcharts() {
      let datas = [],
        coords = [];
      const pointsData = this.profileData;
      const maxDistance = pointsData[pointsData.length - 1].distance;
      let xAixMax = Math.ceil(maxDistance);
      for (let index = 0; index < pointsData.length; index++) {
        const element = pointsData[index];
        const curData = [
          element.distance.toFixed(2),
          element.position.height.toFixed(2),
        ];
        datas.push(curData);
        const curCoords = [element.position.lon, element.position.lat];
        coords.push(curCoords);
      }
      const pointOption = {
        show: true,
        pixelSize: 10,
        color: Cesium.Color.GREEN,
        outlineColor: Cesium.Color.SKYBLUE,
        outlineWidth: 3,
      };
      const ele = document.getElementById("profile-echarts");
      this.myChart = echarts.init(ele);
      let option = {
        title: {
          text: "剖面分析结果",
          textStyle:{
            color:"white"
          }
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            align: "left",
          },
          formatter(params) {
            const xy = coords[params[0].dataIndex];
            const tipData = params[0]["data"];
            if (!tipEntity) {
              tipEntity = window.viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(
                  xy[0],
                  xy[1],
                  Number(tipData[1])
                ),
                point: pointOption,
              });
            } else {
              tipEntity.position = Cesium.Cartesian3.fromDegrees(
                xy[0],
                xy[1],
                Number(tipData[1])
              );
            }
            return (
              "距离：" +
              tipData[0] +
              "m<br>" +
              "高度：" +
              tipData[1] +
              "m<br>" +
              "坐标：" +
              xy[0].toFixed(5) +
              "，" +
              xy[1].toFixed(5)
            );
          },
        },
        grid: {
          x: 40,
          x2: 40,
          y2: 24,
        },
        calculable: true,
        xAxis: [
          {
            type: "value",
            max: xAixMax,
            scale: true,
          },
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
          },
        ],
        series: [
          {
            name: "ProfileLine",
            type: "line",
            data: datas,
            smooth: true,
            itemStyle: {
              normal: {
                color: "#39FDA1",
              },
            },
            lineStyle: {
              normal: {
                width: 3,
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(85,254,139,1)", // 0% 处的颜色
                    },
                    {
                      offset: 0.5,
                      color: "rgba(7,252,202,1)", // 100% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(14,245,210,1)", // 100% 处的颜色
                    },
                  ],
                  globalCoord: false, // 缺省为 false
                },
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(102,153,255,1)",
                    },
                    {
                      offset: 0.8,
                      color: "rgba(102,153,255,0.08)",
                    },
                    {
                      offset: 1,
                      color: "rgba(9,173,208,0.15)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(14,245,210,1)", //阴影颜色
                shadowBlur: 20,
              },
            },
            markPoint: {
              data: [
                { type: "max", name: "最高点" },
                { type: "min", name: "最低点" },
              ],
            },
          },
        ],
      };
      this.myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
.profile-echarts {
  position: absolute;
  bottom: 0;
  width: calc(100% - 30px);
  height: 300px;
  background-color: rgba(42,42,42,0.8);
  z-index: 10;
  padding: 15px;
  #profile-echarts {
    width: 100%;
    height: 100%;
  }
  .echarts-close {
    color: white;
    position: absolute;
    font-weight: bolder;
    font-size: 2rem;
    right: 15px;
    top: 5px;
    cursor: pointer;
  }
}
</style>
<template>
  <div class="military-plotting-tools">
    <div class="plotting-items">
      <span
        class="item-span"
        v-for="item in items"
        :key="item.name"
        :title="item.name"
        @click="draw(item.type)"
      >
        <!-- <img class="geo-img" :src="item.image" /> -->
        <label class="geo-label">{{ item.name }}</label>
      </span>
    </div>
    <div class="plotting-color-select">
      <label class="color-text">颜色</label>
      <el-color-picker
        size="mini"
        v-model="color"
        show-alpha
        :predefine="predefineColors"
      >
      </el-color-picker>
    </div>
  </div>
</template>
<script>
import MilitaryPlotting from "./MilitaryPlotting";
const Cesium = window.Cesium;
let my_MilitaryPlotting;
export default {
  data() {
    return {
      color: "rgba(255, 0, 0, 0.8)",
      size: 25,
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
      ],
      items: [
        {
          name: "自由线",
          image: require("./images/free-line.png"),
          type: "FreeLine",
        },
        {
          name: "折线",
          image: require("./images/polyline.png"),
          type: "Polyline",
        },
        {
          name: "曲线",
          image: require("./images/curve.png"),
          type: "Curve",
        },
        {
          name: "自由面",
          image: require("./images/staging-area.png"),
          type: "FreePolygon",
        },
        {
          name: "多边形",
          image: require("./images/easy.png"),
          type: "Polygon",
        },
        {
          name: "正多边形",
          image: require("./images/polygon.png"),
          type: "RegularPolygon",
        },
        {
          name: "简单直线箭头",
          image: require("./images/straight-line-arrow.png"),
          type: "StraightLineArrow",
        },
        {
          name: "简单曲线箭头",
          image: require("./images/curve-line-arrow.png"),
          type: "CurveLineArrow",
        },
        {
          name: "直角箭头",
          image: require("./images/right-angle-arrow.png"),
          type: "RightAngleArrow",
        },
        {
          name: "燕尾箭头",
          image: require("./images/swallowtail-arrow.png"),
          type: "SwallowtailArrow",
        },
        {
          name: "钳击箭头",
          // image: require("./images/pincer-arrow.png"),
          type: "PincerArrow",
        },
        {
          name: "进攻箭头",
          // image: require("./images/attack-arrow.png"),
          type: "AttackArrow",
        },
        {
          name: "圆角矩形",
          image: require("./images/round-rectangle.png"),
          type: "RoundRectangle",
        },
        {
          name: "扇形",
          image: require("./images/sector.png"),
          type: "Sector",
        },
        {
          name: "弓形",
          image: require("./images/bow.png"),
          type: "Bow",
        },
        {
          name: "集结地",
          // image: require("./images/staging-area.png"),
          type: "StagingArea",
        },
        {
          name: "曲线旗标",
          // image: require("./images/staging-area.png"),
          type: "CurveFlag",
        },
        {
          name: "矩形旗标",
          // image: require("./images/staging-area.png"),
          type: "RectangleFlag",
        },
        {
          name: "正三角旗标",
          // image: require("./images/staging-area.png"),
          type: "RegularTriangleFlag",
        },
        {
          name: "倒三角旗标",
          // image: require("./images/staging-area.png"),
          type: "InvertedTriangleFlag",
        },
        {
          name: "对三角旗标",
          // image: require("./images/staging-area.png"),
          type: "TriangleFlag",
        },
        {
          name: "清空",
          image: require("./images/delete.png"),
          type: "RemoveAll",
        },
      ],
    };
  },
  mounted() {
    my_MilitaryPlotting = new MilitaryPlotting(window.viewer);
  },
  methods: {
    draw(type) {
      console.log("当前绘制的箭头类型", type);
      switch (type) {
        case "FreeLine":
          this.createFreeLine();
          break;
        case "Polyline":
          this.createPolyline();
          break;
        case "Curve":
          this.createCurve();
          break;
        case "FreePolygon":
          this.createFreePolygon();
          break;
        case "Polygon":
          this.createPolygon();
          break;
        case "RegularPolygon":
          this.createRegularPolygon(6);
          break;
        case "StraightLineArrow":
          this.createLineArrow(true);
          break;
        case "CurveLineArrow":
          this.createLineArrow(false);
          break;
        case "SwallowtailArrow":
          this.createSwallowtailArrow();
          break;
        case "RightAngleArrow":
          this.createRightAngleArrow();
          break;
        case "RoundRectangle":
          this.createRoundRectangle();
          break;
        case "Sector":
          this.createSector();
          break;
        case "Bow":
          this.createBow();
          break;
        case "PincerArrow":
          this.createPincerArrow();
          break;
        case "AttackArrow":
          this.createAttackArrow();
          break;
        case "StagingArea":
          this.createStagingArea();
          break;
        case "CurveFlag":
          this.CreateFlag(0);
          break;
        case "RectangleFlag":
          this.CreateFlag(1);
          break;
        case "RegularTriangleFlag":
          this.CreateFlag(2);
          break;
        case "InvertedTriangleFlag":
          this.CreateFlag(3);
          break;
        case "TriangleFlag":
          this.CreateFlag(4);
          break;
        case "RemoveAll":
          this.removeAll();
          break;
      }
    },
 
    //创建正多边形
    createRegularPolygon(num) {
      my_MilitaryPlotting.CreateRegularPolygon(
        {
          color: Cesium.Color.fromCssColorString(this.color),
          id: this.setSessionid(),
          num: num,
        },
        function (el) {
          console.log(
            "在这里执行多边形绘制后回调方法",
            el,
            my_MilitaryPlotting
          );
        }
      );
    },
    //创建多边形
    createPolygon() {
      my_MilitaryPlotting.CreatePolygon(
        {
          color: Cesium.Color.fromCssColorString(this.color),
          id: this.setSessionid(),
        },
        function (el) {
          console.log(
            "在这里执行多边形绘制后回调方法",
            el,
            my_MilitaryPlotting
          );
        }
      );
    },
    //创建自由面
    createFreePolygon() {
      my_MilitaryPlotting.CreateFreePolygon(
        {
          color: Cesium.Color.fromCssColorString(this.color),
          id: this.setSessionid(),
        },
        function (el) {
          console.log(
            "在这里执行自由面绘制后回调方法",
            el,
            my_MilitaryPlotting
          );
        }
      );
    },
    //创建圆滑曲线
    createCurve() {
      my_MilitaryPlotting.CreateCurve(
        {
          color: Cesium.Color.fromCssColorString(this.color),
          id: this.setSessionid(),
          width: 5,
        },
        function (el) {
          console.log(
            "在这里执行圆滑曲线绘制后回调方法",
            el,
            my_MilitaryPlotting
          );
        }
      );
    },
    //创建折线
    createPolyline() {
      my_MilitaryPlotting.CreatePolyline(
        {
          color: Cesium.Color.fromCssColorString(this.color),
          id: this.setSessionid(),
          width: 5,
        },
        function (el) {
          console.log("在这里执行折线绘制后回调方法", el, my_MilitaryPlotting);
        }
      );
    },
    //创建自由线
    createFreeLine() {
      my_MilitaryPlotting.CreateFreeLine(
        {
          color: Cesium.Color.fromCssColorString(this.color),
          id: this.setSessionid(),
          width: 5,
        },
        function (el) {
          console.log(
            "在这里执行自由线绘制后回调方法",
            el,
            my_MilitaryPlotting
          );
        }
      );
    },
    //创建曲线旗标
    CreateFlag(type) {
      my_MilitaryPlotting.CreateFlag(
        {
          color: Cesium.Color.fromCssColorString(this.color),
          id: this.setSessionid(),
          type: type,
        },
        function (el) {
          console.log(
            "在这里执行进攻箭头绘制后回调方法",
            el,
            my_MilitaryPlotting
          );
        }
      );
    },
    //创建集结地
    createStagingArea() {
      my_MilitaryPlotting.CreateStagingArea(
        {
          color: Cesium.Color.fromCssColorString(this.color),
          id: this.setSessionid(),
        },
        function (el) {
          console.log(
            "在这里执行进攻箭头绘制后回调方法",
            el,
            my_MilitaryPlotting
          );
        }
      );
    },
    //创建进攻箭头
    createAttackArrow() {
      my_MilitaryPlotting.CreateAttackArrow(
        {
          color: Cesium.Color.fromCssColorString(this.color),
          id: this.setSessionid(),
        },
        function (el) {
          console.log(
            "在这里执行进攻箭头绘制后回调方法",
            el,
            my_MilitaryPlotting
          );
        }
      );
    },
    //创建钳击箭头
    createPincerArrow() {
      my_MilitaryPlotting.CreatePincerArrow(
        {
          color: Cesium.Color.fromCssColorString(this.color),
          id: this.setSessionid(),
        },
        function (el) {
          console.log(
            "在这里执行钳击箭头绘制后回调方法",
            el,
            my_MilitaryPlotting
          );
        }
      );
    },
    //创建弓形
    createBow() {
      my_MilitaryPlotting.CreateBow(
        {
          color: Cesium.Color.fromCssColorString(this.color),
          id: this.setSessionid(),
        },
        function (el) {
          console.log("在这里执行弓形绘制后回调方法", el, my_MilitaryPlotting);
        }
      );
    },
    //创建扇形
    createSector() {
      my_MilitaryPlotting.CreateSector(
        {
          color: Cesium.Color.fromCssColorString(this.color),
          id: this.setSessionid(),
        },
        function (el) {
          console.log("在这里执行扇形绘制后回调方法", el, my_MilitaryPlotting);
        }
      );
    },
    //创建圆角矩形
    createRoundRectangle() {
      my_MilitaryPlotting.CreateRoundRectangle(
        {
          color: Cesium.Color.fromCssColorString(this.color),
          id: this.setSessionid(),
        },
        function (el) {
          console.log(
            "在这里执行圆角矩形绘制后回调方法",
            el,
            my_MilitaryPlotting
          );
        }
      );
    },
    // 创建直角箭头
    createRightAngleArrow() {
      my_MilitaryPlotting.CreateRightAngleArrow(
        {
          color: Cesium.Color.fromCssColorString(this.color),
          id: this.setSessionid(),
        },
        function (el) {
          console.log(
            "在这里执行直角箭头绘制后回调方法",
            el,
            my_MilitaryPlotting
          );
        }
      );
    },
    // 创建燕尾箭头
    createSwallowtailArrow() {
      my_MilitaryPlotting.CreateSwallowtailArrow(
        {
          color: Cesium.Color.fromCssColorString(this.color),
          id: this.setSessionid(),
        },
        function (el) {
          console.log(
            "在这里执行燕尾箭头绘制后回调方法",
            el,
            my_MilitaryPlotting
          );
        }
      );
    },
    // 创建简单箭头-直线Or曲线
    createLineArrow(straight) {
      my_MilitaryPlotting.CreateLineArrow(
        {
          color: Cesium.Color.fromCssColorString(this.color),
          id: this.setSessionid(),
          width: 15,
          straight: straight,
        },
        function (el) {
          console.log(
            "在这里执行直线箭头创建后回调方法",
            el,
            my_MilitaryPlotting
          );
        }
      );
    },
    // 移除所有绘制对象
    removeAll() {
      my_MilitaryPlotting.clearAll();
    },
    //创建随机id
    setSessionid(num) {
      var len = num || 32;
      var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      var maxPos = chars.length;
      var pwd = "";
      for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    setColor() {
      const color = Cesium.Color.fromRandom();
      return color.withAlpha(1);
    },
  },
};
</script>
<style lang="scss" scoped>
.military-plotting-tools {
  position: absolute;
  display: flex;
  margin: 10px;
  padding: 5px;
  z-index: 10;
  background-color: rgba(100, 99, 99, 0.8);
  border: 1px solid rgb(29, 29, 29);
  border-radius: 5px;
  color: white;
  flex-direction: column;
  align-items: flex-start;
  .plotting-items {
    display: flex;
    width: 660px;
    flex-wrap: wrap;
    .item-span {
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      padding-right: 10px;
      width: 120px;
      .geo-img {
        border: 1px solid transparent;
        border-radius: 5px;
      }
      &:hover {
        cursor: pointer;
        border: 1px solid white;
        background-color: rgb(66, 66, 66);
        border-radius: 5px;
      }
    }
  }
  .plotting-color-select {
    display: flex;
    align-items: center;
    .color-text {
      margin: 0 5px;
      letter-spacing: 0.1rem;
    }
  }
}
</style>
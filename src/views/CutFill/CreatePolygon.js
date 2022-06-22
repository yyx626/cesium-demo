const Cesium = window.Cesium;
class CreatePolygon {
  constructor(viewer) {
    if (!viewer) throw new Error("no viewer object!");
    this.viewer = viewer;
    this.handler = undefined;
    this.init();
  }
  init() {
    this.activeShapePoints = [];
    this.floatingPoint = undefined;
    this.activeShape = undefined;
    this.activePoints = [];
    this.initHandler();
  }
  start(callback) {
    const $this = this;
    $this.keyDownStatus(true);
    $this.init();
    $this.handler = new Cesium.ScreenSpaceEventHandler($this.viewer.canvas);
    $this.handler.setInputAction(function (event) {
      let earthPosition = $this.viewer.scene.pickPosition(event.position);
      if (Cesium.defined(earthPosition)) {
        if ($this.activeShapePoints.length === 0) {
          $this.floatingPoint = $this.createPoint(earthPosition);
          $this.activeShapePoints.push(earthPosition);
          let dynamicPositions = new Cesium.CallbackProperty(function () {
            return new Cesium.PolygonHierarchy($this.activeShapePoints);
          }, false);
          $this.activeShape = $this.drawShape(dynamicPositions); //绘制动态图
        }
        $this.activeShapePoints.push(earthPosition);
        $this.createPoint(earthPosition);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    $this.handler.setInputAction(function (event) {
      if (Cesium.defined($this.floatingPoint)) {
        let newPosition = $this.viewer.scene.pickPosition(event.endPosition);
        if (Cesium.defined(newPosition)) {
          $this.floatingPoint.position.setValue(newPosition);
          $this.activeShapePoints.pop();
          $this.activeShapePoints.push(newPosition);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    $this.handler.setInputAction(function () {
      $this.activeShapePoints.pop(); //去除最后一个动态点
      if ($this.activeShapePoints.length) {
        $this.polygon = $this.drawShape($this.activeShapePoints); //绘制最终图
      }
      $this.viewer.entities.remove($this.floatingPoint); //去除动态点图形（当前鼠标点）
      $this.viewer.entities.remove($this.activeShape); //去除动态图形
      $this.activePoints.forEach((element) => {
        $this.viewer.entities.remove(element);
      });
      $this.handler.destroy();
      setTimeout(() => {
        if (typeof callback == "function") callback();
      }, 1000);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }
  initHandler() {
    if (this.handler) {
      this.handler.destroy();
      this.handler = undefined;
    }
  }
  createPoint(worldPosition) {
    let point = this.viewer.entities.add({
      position: worldPosition,
      point: {
        color: Cesium.Color.SKYBLUE,
        pixelSize: 5,
      },
    });
    this.activePoints.push(point);
    return point;
  }
  drawShape(positionData) {
    let shape = this.viewer.entities.add({
      polygon: {
        hierarchy: positionData,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.BLUE.withAlpha(0.4)
        ),
      },
    });
    return shape;
  }
  //快捷键//Ctrl + Z
  keyDownStatus(bool) {
    const $this = this;
    document.onkeydown = function (event) {
      if (event.ctrlKey && window.event.keyCode == 90) {
        if (!bool) {
          return false;
        }
        $this.activeShapePoints.pop();
        $this.viewer.entities.remove(
          $this.activePoints[$this.activePoints.length - 1]
        );
        $this.activePoints.pop();
      }
    };
  }
  /**
   * Cesium中世界坐标系（笛卡尔）转经纬度
   * @param {*} cartesian3
   * @returns 经纬度
   */
  Cartesian3ToDgrees(cartesian3) {
    let cartographic =
      window.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
    let lat = Cesium.Math.toDegrees(cartographic.latitude);
    let lng = Cesium.Math.toDegrees(cartographic.longitude);
    let alt = cartographic.height;
    return { lng: lng, lat: lat, alt: alt };
  }
}
 
export default CreatePolygon;
/*
 * 历史轨迹
 * @Author: yyx
 * @Date: 2022-08-22
 */
const Cesium = window.Cesium;
class historyObject {
  constructor(viewer) {
    if (!viewer) throw new Error("no viewer object!");
    this.viewer = viewer;
  }
  //创建历史轨迹-直接绘制出全部轨迹
  createWithAllPath(data) {
    let viewer = this.viewer;
    let start = Cesium.JulianDate.fromDate(new Date(data.startTime));
    let stop = Cesium.JulianDate.fromDate(new Date(data.endTime));
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.clock.multiplier = 1; //控制速度
    viewer.timeline.zoomTo(start, stop);
    let positionProperty = computePath();
    this.allPathObj = viewer.entities.add({
      id: "history-all-path",
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({
          start: start,
          stop: stop,
        }),
      ]),
      position: positionProperty,
      orientation: new Cesium.VelocityOrientationProperty(positionProperty),
      model: data.model,
      path: {
        resolution: 1,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.1,
          color: Cesium.Color.YELLOW,
        }),
        width: 10,
      },
    });
    function computePath() {
      let property = new Cesium.SampledPositionProperty();
      for (let index = 0; index < data.values.length; index++) {
        const element = data.values[index];
        let time = Cesium.JulianDate.fromDate(new Date(element.time));
        let position = Cesium.Cartesian3.fromDegrees(
          element.position[0],
          element.position[1],
          element.position[2]
        );
        property.addSample(time, position);
      }
      return property;
    }
    viewer.clockViewModel.shouldAnimate = true;
  }
  //设置修改速度
  changeSpeed(value) {
    this.viewer.clock.multiplier = Number(value);
  }
  //设置是否镜头跟踪模型
  trackedModel(model, bool) {
    bool
      ? (this.viewer.trackedEntity = model)
      : (this.viewer.trackedEntity = undefined);
  }
  //设置轨迹样式，是否圆滑
  setPathStyle(model, smooth) {
    smooth
      ? model.position.setInterpolationOptions({
          interpolationDegree: 5,
          interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
        })
      : model.position.setInterpolationOptions({
          interpolationDegree: 1,
          interpolationAlgorithm: Cesium.LinearApproximation,
        });
  }
  //历史轨迹动画暂停
  pause() {
    this.viewer.clockViewModel.shouldAnimate = false;
  }
  //历史轨迹动画继续（取消暂停）
  continue() {
    this.viewer.clockViewModel.shouldAnimate = true;
  }
  destroy() {
    if (this.allPathObj && this.allPathObj != null) {
      this.viewer.entities.remove(this.allPathObj);
    }
    if (this.refreshPathObj && this.refreshPathObj != null) {
      this.viewer.dataSources.remove(this.refreshPathObj);
    }
  }
  //创建历史轨迹-轨迹不断刷新
  createRefreshPath(data) {
    let $this = this;
    let cartographicDegrees = [];
    let startTime16 = new Date(data.startTime);
    let startTime = Cesium.JulianDate.fromDate(startTime16);
    let endTime = Cesium.JulianDate.fromDate(new Date(data.endTime));
    for (let index = 0; index < data.values.length; index++) {
      const element = data.values[index];
      let stepTime = new Date(element.time);
      let step = (stepTime.getTime() - startTime16.getTime()) / 1000;
      cartographicDegrees.push(
        step,
        element.position[0],
        element.position[1],
        element.position[2]
      );
    }
    this.viewer.clock.currentTime = startTime.clone();
    let interval = startTime.toString() + "/" + endTime.toString();
    this.czml = [
      {
        id: "document",
        name: "CZML Path",
        version: "1.0",
        clock: {
          interval: interval,
          currentTime: startTime.toString(),
        },
      },
      {
        id: "path",
        name: "path with GPS flight data",
        description:
          "<p>Hang gliding flight log data from Daniel H. Friedman.<br>Icon created by Larisa Skosyrska from the Noun Project</p>",
        availability: interval,
        model: data.model,
        path: {
          material: {
            polylineOutline: {
              color: {
                rgba: [255, 0, 255, 255],
              },
              outlineColor: {
                rgba: [0, 255, 255, 255],
              },
              outlineWidth: 2,
            },
          },
          width: 5,
          leadTime: 0,
          resolution: 5,
        },
        position: {
          interpolationAlgorithm: "LAGRANGE",
          interpolationDegree: 1,
          epoch: startTime.toString(),
          cartographicDegrees: cartographicDegrees,
        },
      },
    ];
    $this.viewer.dataSources
      .add(Cesium.CzmlDataSource.load($this.czml))
      .then(function (ds) {
        $this.refreshPathObj = ds;
        $this.viewer.clock.shouldAnimate = true;
        let curModel = ds.entities.getById("path");
        $this.viewer.trackedEntity = curModel;
        //确保模型角度和路径一致
        curModel.orientation = new Cesium.VelocityOrientationProperty(
          curModel.position
        );
      });
  }
}
export default historyObject;
/*
 * @Author: yyx
 * @Date: 2022-06-23
 */
const Cesium = window.Cesium;
import * as kriging from "./kriging.js/kriging";
import * as turf from "@turf/turf";
 
let ViewShedAnalysis = function (viewer, canvasEleId) {
  if (!viewer) throw new Error("no viewer object!");
  let canvasEle = document.getElementById(canvasEleId);
  if (!canvasEle) throw new Error("the canvas element is not exist");
  this.canvasEle = canvasEle;
  this.viewer = viewer;
  this.handler = undefined;
  this.lightCamera;
  this.pyramid;
  this.frustumPrimitive;
  this.viewershedPolygon;
};
ViewShedAnalysis.prototype = {
  /**
   * 初始化handler
   */
  initHandler() {
    if (this.handler) {
      this.handler.destroy();
      this.handler = undefined;
    }
  },
  /**
   * 开始执行视域分析
   * @param {number} precision 精度，值越大创建耗时越长，建议在10~20之间
   */
  createViewshed: function (precision) {
    let $this = this;
    let scene = $this.viewer.scene;
    $this.initHandler();
    $this.clearAll();
    $this.handler = new Cesium.ScreenSpaceEventHandler($this.viewer.canvas);
    $this.handler.setInputAction((event) => {
      // 禁止地球旋转和缩放，地球的旋转会对鼠标移动监听有影响，所以需要禁止
      scene.screenSpaceCameraController.enableRotate = false;
      scene.screenSpaceCameraController.enableZoom = false;
      scene.globe.depthTestAgainstTerrain = true;
      let earthPosition = scene.pickPosition(event.position);
      let pos = $this.cartesian3ToDegree(earthPosition);
      $this.handler.setInputAction(function (event) {
        let newPosition = scene.pickPosition(event.endPosition);
        if (Cesium.defined(newPosition)) {
          let pos1 = $this.cartesian3ToDegree(newPosition);
          let distance = Cesium.Cartesian3.distance(newPosition, earthPosition);
          let angle = $this.getAngle(pos[0], pos[1], pos1[0], pos1[1]);
          let pitch = $this.getPitch(earthPosition, newPosition);
          $this.ViewShedOptions = {
            viewPosition: earthPosition, //观测点 笛卡尔坐标
            endPosition: newPosition, //目标点 笛卡尔坐标
            direction: angle, //观测方位角 默认为`0`,范围`0~360`
            pitch: pitch, //俯仰角,radius,默认为`0`
            horizontalViewAngle: 90, //可视域水平夹角,默认为 `90`,范围`0~360`
            verticalViewAngle: 60, //可视域垂直夹角,默认为`60`,范围`0~180`
            visibleAreaColor: Cesium.Color.GREEN, //可视区域颜色,默认为`green`
            invisibleAreaColor: Cesium.Color.RED, //不可见区域颜色,默认为`red`
            visualRange: distance, //距离,单位`米`
          };
          $this.updateViewShed();
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
 
    $this.handler.setInputAction(() => {
      $this.initHandler();
      // 开启地球旋转和缩放
      scene.screenSpaceCameraController.enableRotate = true;
      scene.screenSpaceCameraController.enableZoom = true;
      $this.drawViewershed(precision);
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
  },
 
  ReturnDistance(pos0, pos1) {
    let distance = 0;
    let point1cartographic = Cesium.Cartographic.fromCartesian(pos0);
    let point2cartographic = Cesium.Cartographic.fromCartesian(pos1);
    /**根据经纬度计算出距离**/
    let geodesic = new Cesium.EllipsoidGeodesic();
    geodesic.setEndPoints(point1cartographic, point2cartographic);
    let s = geodesic.surfaceDistance;
    return s;
  },
  getHeight(x, y, objectsToExclude) {
    let endCartographic = Cesium.Cartographic.fromDegrees(x, y);
    let endHeight = this.viewer.scene.sampleHeight(
      endCartographic,
      objectsToExclude
    );
    return endHeight;
  },
 
  cartesian3ToDegree: function (Cartesian3) {
    let _ellipsoid = this.viewer.scene.globe.ellipsoid;
    let _cartographic = _ellipsoid.cartesianToCartographic(Cartesian3);
    let _lat = Cesium.Math.toDegrees(_cartographic.latitude);
    let _lng = Cesium.Math.toDegrees(_cartographic.longitude);
    let _alt = _cartographic.height;
    return [_lng, _lat, _alt];
  },
  getAngle: function (lng1, lat1, lng2, lat2) {
    let dRotateAngle = Math.atan2(Math.abs(lng1 - lng2), Math.abs(lat1 - lat2));
    if (lng2 >= lng1) {
      dRotateAngle = lat2 < lat1 ? Math.PI - dRotateAngle : dRotateAngle;
    } else {
      dRotateAngle =
        lat2 >= lat1 ? 2 * Math.PI - dRotateAngle : Math.PI + dRotateAngle;
    }
    dRotateAngle = (dRotateAngle * 180) / Math.PI;
    return dRotateAngle;
  },
 
  getPitch(pointA, pointB) {
    let transfrom = Cesium.Transforms.eastNorthUpToFixedFrame(pointA);
    const vector = Cesium.Cartesian3.subtract(
      pointB,
      pointA,
      new Cesium.Cartesian3()
    );
    let direction = Cesium.Matrix4.multiplyByPointAsVector(
      Cesium.Matrix4.inverse(transfrom, transfrom),
      vector,
      vector
    );
    Cesium.Cartesian3.normalize(direction, direction);
    return Cesium.Math.PI_OVER_TWO - Cesium.Math.acosClamped(direction.z);
  },
 
  updateViewShed: function () {
    this.clear();
    this.setLightCamera();
    this.addVisualPyramid();
    this.createFrustum();
  },
  clear: function () {
    if (this.pyramid) {
      this.viewer.entities.removeById(this.pyramid.id);
      this.pyramid = undefined;
    }
    if (this.frustumPrimitive) {
      this.viewer.scene.primitives.remove(this.frustumPrimitive);
      this.frustumPrimitive = undefined;
    }
    if (this.debugModelMatrixPrimitive) {
      this.viewer.scene.primitives.remove(this.debugModelMatrixPrimitive);
      this.debugModelMatrixPrimitive = undefined;
    }
  },
  clearAll: function () {
    this.clear();
    if (this.viewershedPolygon) {
      this.viewer.scene.primitives.remove(this.viewershedPolygon);
      this.viewershedPolygon = undefined;
    }
  },
  addVisualPyramid: function () {
    let options = this.ViewShedOptions;
    let position = options.viewPosition;
    let visualRange = Number(options.visualRange);
    let transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    this.debugModelMatrixPrimitive = this.viewer.scene.primitives.add(
      new Cesium.DebugModelMatrixPrimitive({
        modelMatrix: transform,
        length: 5.0,
      })
    );
    const halfClock = options.horizontalViewAngle / 2;
    const halfCone = options.verticalViewAngle / 2;
    const pitch = Cesium.Math.toDegrees(options.pitch);
    const ellipsoid = new Cesium.EllipsoidGraphics({
      radii: new Cesium.Cartesian3(visualRange, visualRange, visualRange),
      minimumClock: Cesium.Math.toRadians(90 - options.direction - halfClock),
      maximumClock: Cesium.Math.toRadians(90 - options.direction + halfClock),
      minimumCone: Cesium.Math.toRadians(90 - pitch - halfCone),
      maximumCone: Cesium.Math.toRadians(90 - pitch + halfCone),
      fill: false,
      outline: true,
      subdivisions: 256,
      stackPartitions: 64,
      slicePartitions: 64,
      outlineColor: Cesium.Color.YELLOWGREEN.withAlpha(0.5),
    });
    const pyramidEntity = new Cesium.Entity({
      position: position,
      ellipsoid,
    });
    this.pyramid = this.viewer.entities.add(pyramidEntity);
  },
  setLightCamera: function () {
    if (!this.lightCamera) {
      this.lightCamera = new Cesium.Camera(this.viewer.scene);
    }
    let options = this.ViewShedOptions;
    let visualRange = Number(options.visualRange);
    this.lightCamera.position = options.viewPosition;
    this.lightCamera.frustum.near = 0.1;
    this.lightCamera.frustum.far = visualRange;
    const hr = Cesium.Math.toRadians(options.horizontalViewAngle);
    const vr = Cesium.Math.toRadians(options.verticalViewAngle);
    this.lightCamera.frustum.aspectRatio =
      (visualRange * Math.tan(hr / 2) * 2) /
      (visualRange * Math.tan(vr / 2) * 2);
    this.lightCamera.frustum.fov = hr > vr ? hr : vr;
    this.lightCamera.setView({
      destination: options.viewPosition,
      orientation: {
        heading: Cesium.Math.toRadians(options.direction || 0),
        pitch: options.pitch || 0,
        roll: 0,
      },
    });
  },
  createFrustum: function () {
    const scratchRight = new Cesium.Cartesian3();
    const scratchRotation = new Cesium.Matrix3();
    const scratchOrientation = new Cesium.Quaternion();
    const direction = this.lightCamera.directionWC;
    const up = this.lightCamera.upWC;
    let right = this.lightCamera.rightWC;
    right = Cesium.Cartesian3.negate(right, scratchRight);
    let rotation = scratchRotation;
    Cesium.Matrix3.setColumn(rotation, 0, right, rotation);
    Cesium.Matrix3.setColumn(rotation, 1, up, rotation);
    Cesium.Matrix3.setColumn(rotation, 2, direction, rotation);
    let orientation = Cesium.Quaternion.fromRotationMatrix(
      rotation,
      scratchOrientation
    );
    let instanceOutline = new Cesium.GeometryInstance({
      geometry: new Cesium.FrustumOutlineGeometry({
        frustum: this.lightCamera.frustum,
        origin: this.ViewShedOptions.viewPosition,
        orientation: orientation,
      }),
      id: "视椎体轮廓线" + Math.random().toString(36).substr(2),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          new Cesium.Color(0.0, 1.0, 0.0, 1.0)
        ),
        show: new Cesium.ShowGeometryInstanceAttribute(true),
      },
    });
    this.frustumPrimitive = this.viewer.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: instanceOutline,
        appearance: new Cesium.PerInstanceColorAppearance({
          flat: true,
          translucent: false,
          closed: true,
        }),
      })
    );
  },
  createPoint: function (firstPos, secondPos) {
    let entity4FirstPos = new Cesium.Entity({
      name: "firstPos",
      show: true,
      position: firstPos,
      point: {
        show: true,
        pixelSize: 20,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 5,
      },
      description: `
              <p>这是绘制的视椎体起点</p>`,
    });
    this.viewer.entities.add(entity4FirstPos);
    let entity4SecondPos = new Cesium.Entity({
      name: "secondPos",
      show: true,
      position: secondPos,
      point: {
        show: true,
        pixelSize: 30,
        color: Cesium.Color.YELLOW,
        outlineColor: Cesium.Color.RED,
        outlineWidth: 8,
      },
      description: `
              <p>这是绘制的视椎体视角终点</p>`,
    });
    this.viewer.entities.add(entity4SecondPos);
  },
 
  //绘制可视域
  add(positionArr) {
    let polygon = new Cesium.PolygonGeometry({
      polygonHierarchy: new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArray(positionArr)
      ),
      height: 0.0,
      extrudedHeight: 0.0,
      vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
      stRotation: 0.0, // 纹理的旋转坐标（以弧度为单位）,正旋转是逆时针方向
      ellipsoid: Cesium.Ellipsoid.WGS84,
      granularity: Cesium.Math.RADIANS_PER_DEGREE, // 每个纬度和经度之间的距离（以弧度为单位）,确定缓冲区中的位置数
      perPositionHeight: false, // 每个位置点使用的高度
      closeTop: true,
      closeBottom: true,
      // NONE 与椭圆表面不符的直线;GEODESIC 遵循测地路径;RHUMB	遵循大黄蜂或恶魔般的道路。
      arcType: Cesium.ArcType.GEODESIC, // 多边形边缘线型
    });
 
    let polygonInstance = new Cesium.GeometryInstance({
      geometry: polygon,
      name: "ViewershedPolygon",
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          Cesium.Color.BLUE.withAlpha(0.6)
        ),
        show: new Cesium.ShowGeometryInstanceAttribute(true), //显示或者隐藏
      },
    });
    this.viewershedPolygon = this.viewer.scene.primitives.add(
      new Cesium.GroundPrimitive({
        geometryInstances: polygonInstance,
        appearance: new Cesium.EllipsoidSurfaceAppearance({
          aboveGround: true,
          material: new Cesium.Material({
            fabric: {
              type: "Image",
              uniforms: {
                image: this.returnImgae(),
              },
            },
          }),
        }),
      })
    );
  },
  drawViewershed(precision) {
    const pos = this.cartesian3ToDegree(this.ViewShedOptions.viewPosition);
    const radius = this.ViewShedOptions.visualRange;
    const direction = this.ViewShedOptions.direction;
    let boundary = this.computeBoundaryOptions(pos, radius, direction);
    const bbox = boundary.bbox;
    let mask = turf.polygon([boundary.boundaryPoints]);
    const dis = this.ViewShedOptions.visualRange / (precision * 1000);
    let gridPoints = turf.pointGrid(bbox, dis, { mask: mask });
    console.log(this.ViewShedOptions.visualRange, precision, dis);
 
    let pointsResult = this.createTargetPoints(gridPoints, dis, pos);
    let variogram = kriging.train(
      pointsResult.values,
      pointsResult.lngs,
      pointsResult.lats,
      "exponential",
      0,
      100
    );
    let grid = kriging.grid([boundary.boundaryPoints], variogram, dis / 1000);
    const colors = [
      "#ff000080",
      "#ff000080",
      "#ff000080",
      "#ff000080",
      "#ff000080",
      "#ff000080",
      "#00ff0080",
      "#00ff0080",
      "#00ff0080",
      "#00ff0080",
      "#00ff0080",
      "#00ff0080",
    ];
 
    this.canvasEle.width = 3840;
    this.canvasEle.height = 2160;
    kriging.plot(
      this.canvasEle,
      grid,
      [bbox[0], bbox[2]],
      [bbox[1], bbox[3]],
      colors
    );
    this.add(boundary.positionArr);
  },
  computeBoundaryOptions(pos, radius, angle) {
    let Ea = 6378137; //   赤道半径
    let Eb = 6356725; // 极半径
    const lng = pos[0],
      lat = pos[1];
    const bbox = [lng, lat, lng, lat]; //[minX, minY, maxX, maxY]
    let positionArr = [];
    let boundaryPoints = [];
    positionArr.push(lng, lat);
    boundaryPoints.push([lng, lat]);
    //正北是0°
    let start = angle + 45 > 360 ? angle - 45 - 360 : angle - 45;
    let end = start + 90;
    for (let i = start; i <= end; i++) {
      let dx = radius * Math.sin((i * Math.PI) / 180.0);
      let dy = radius * Math.cos((i * Math.PI) / 180.0);
      let ec = Eb + ((Ea - Eb) * (90.0 - lat)) / 90.0;
      let ed = ec * Math.cos((lat * Math.PI) / 180);
      let BJD = lng + ((dx / ed) * 180.0) / Math.PI;
      let BWD = lat + ((dy / ec) * 180.0) / Math.PI;
      positionArr.push(BJD, BWD);
      boundaryPoints.push([BJD, BWD]);
      this.refreshBBox(bbox, BJD, BWD);
    }
    boundaryPoints.push([lng, lat]);
    return {
      positionArr,
      boundaryPoints,
      bbox,
    };
  },
  /**
   * 更新外围矩形 Bbox
   * @param {Array} result 外围矩形Bbox-[minX, minY, maxX, maxY]
   * @param {Number} x 经度
   * @param {Number} y 纬度
   */
  refreshBBox(result, x, y) {
    result[0] = x < result[0] ? x : result[0];
    result[1] = y < result[1] ? y : result[1];
    result[2] = x > result[2] ? x : result[2];
    result[3] = y > result[3] ? y : result[3];
  },
  /**
   * 插值点用射线判断通视性
   * @param {*} gridPoints 网格点
   * @param {*} step 步长，可以理解成是精度
   * @param {*} sourcePos 视域分析起点
   * @returns kriging插值所需的参数对象{ values:[], lngs:[], lats:[]}
   */
  createTargetPoints(gridPoints, step, sourcePos) {
    let positionArr = [];
    let objectsToExclude = [
      this.frustumPrimitive,
      this.pyramid,
      this.debugModelMatrixPrimitive,
    ];
    let values = [],
      lngs = [],
      lats = [];
    let height = this.getHeight(sourcePos[0], sourcePos[1], objectsToExclude);
    positionArr.push({
      x: sourcePos[0],
      y: sourcePos[1],
      z: height,
    });
    let viewPoint = this.ViewShedOptions.viewPosition;
    for (let index = 0; index < gridPoints.features.length; index++) {
      const feature = gridPoints.features[index];
      const coords = feature.geometry.coordinates;
      const x = coords[0],
        y = coords[1];
      let h = this.getHeight(x, y, objectsToExclude);
      let endPoint = Cesium.Cartesian3.fromDegrees(x, y, h);
      let direction = Cesium.Cartesian3.normalize(
        Cesium.Cartesian3.subtract(
          endPoint,
          viewPoint,
          new Cesium.Cartesian3()
        ),
        new Cesium.Cartesian3()
      );
      // 建立射线
      let ray = new Cesium.Ray(viewPoint, direction);
      let result = this.viewer.scene.pickFromRay(ray, objectsToExclude); // 计算交互点，返回第一个
      if (result) {
        let buffer = this.ReturnDistance(endPoint, result.position);
        // let M_color = Cesium.Color.GREEN;
        if (buffer > step) {
          // M_color = Cesium.Color.RED;
          values.push(0);
        } else {
          values.push(1);
        }
        lngs.push(x);
        lats.push(y);
        // this.viewer.entities.add(
        //   new Cesium.Entity({
        //     name: "插值点",
        //     show: true,
        //     position: endPoint,
        //     point: {
        //       show: true,
        //       pixelSize: 10,
        //       color: M_color,
        //       outlineWidth: 2,
        //       outlineColor: Cesium.Color.YELLOW,
        //     },
        //   })
        // );
      }
    }
    return {
      values,
      lngs,
      lats,
    };
  },
  /**
   * canvas转image图片
   * @returns base64图片
   */
  returnImgae() {
    return this.canvasEle.toDataURL("image/png");
  },
};
 
export default ViewShedAnalysis;
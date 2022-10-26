/*
 * Cesium 热力图主类
 * @Author: yyx
 * @Date: 2022-10-26
 */
import { Intensity, Canvas } from "./Intensity";
const Cesium = window.Cesium;
class HeatmapIntensity {
  constructor(viewer, option = {}) {
    if (!viewer) throw new Error("no viewer object!");
    this._viewer = viewer;
    this._min = option.min || 0; //最小值
    this._max = option.max || 100; //最大值
    this._size = option.size || 20; //光圈大小，像素值
    this._result = undefined; //热力图结果
    this._canvas = undefined; //离屏canvas
  }
 
  get min() {
    return this._min;
  }
  set min(val) {
    this._min = val;
    this.updateHeatmap(this._result.canvasData);
  }
  get max() {
    return this._max;
  }
  set max(val) {
    this._max = val;
    this.updateHeatmap(this._result.canvasData);
  }
  get size() {
    return this._size;
  }
  set size(val) {
    this._size = val;
    this.updateHeatmap(this._result.canvasData);
  }
  get result() {
    return this._result;
  }
  /**
   * 创建热力图对象
   * @param {*} box 范围对象，经纬度值-{west,south,east,north}
   * @param {*} data 待绘制热力图的数据-[{x1,y1,value1},{x2,y2,value2},...]
   * @returns 热力图结果对象
   */
  createHeatmap(box, data) {
    const mercator_WestSouth = this.WGS84ToWebMercator(box.west, box.south, 0); //左下位置（墨卡托）
    const mercator_EastNorth = this.WGS84ToWebMercator(box.east, box.north, 0); //右上位置（墨卡托）
    const diffDegrees_X = mercator_EastNorth.x - mercator_WestSouth.x;
    const diffDegrees_Y = mercator_EastNorth.y - mercator_WestSouth.y;
    const diffMax = Math.max(diffDegrees_X, diffDegrees_Y);
    let multiple = diffMax / 300; //适当扩大倍数，以便绘制canvas
    const width = Math.ceil(diffDegrees_X / multiple);
    const height = Math.ceil(diffDegrees_Y / multiple);
    this.mercator_WestSouth = mercator_WestSouth;
    this.mercator_EastNorth = mercator_EastNorth;
    this.diffDegrees_X = diffDegrees_X;
    this.diffDegrees_Y = diffDegrees_Y;
    let canvasData = [];
    data.forEach((element) => {
      const curMercator = this.WGS84ToWebMercator(
        Number(element.x),
        Number(element.y),
        0
      );
      const per_X = (curMercator.x - mercator_WestSouth.x) / diffDegrees_X;
      const currentPix_X = Math.ceil(per_X * width);
      const per_Y = (curMercator.y - mercator_WestSouth.y) / diffDegrees_Y;
      const currentPix_Y = Math.ceil(per_Y * height);
      const currentValue = Number(element.value);
      canvasData.push({
        x: currentPix_X,
        y: height - currentPix_Y - 1,
        value: currentValue,
      });
    });
    let canvas = new Canvas(width, height);
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    let circle = this.createCircle(this._size);
    let circleHalfWidth = circle.width / 2;
    let circleHalfHeight = circle.height / 2;
 
    // 按透明度分类
    let dataOrderByAlpha = {};
    canvasData.forEach((item) => {
      let alpha =
        item.value < this._min
          ? 0
          : Math.min(1, item.value / this._max).toFixed(2);
      dataOrderByAlpha[alpha] = dataOrderByAlpha[alpha] || [];
      dataOrderByAlpha[alpha].push(item);
    });
 
    // 绘制不同透明度的圆形
    for (let i in dataOrderByAlpha) {
      if (isNaN(i)) continue;
      let _data = dataOrderByAlpha[i];
      context.beginPath();
      context.globalAlpha = i;
      _data.forEach((item) => {
        context.drawImage(
          circle,
          item.x - circleHalfWidth,
          item.y - circleHalfHeight
        );
      });
    }
    // 圆形着色
    let intensity = new Intensity();
    let colored = context.getImageData(
      0,
      0,
      context.canvas.width,
      context.canvas.height
    );
    const options = { min: 0, max: this._max, size: this._size };
    this.colorize(options, colored.data, intensity.getImageData());
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.putImageData(colored, 0, 0);
    let entity = this._viewer.entities.add({
      name: "rectangle",
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(
          box.west,
          box.south,
          box.east,
          box.north
        ),
        material: new Cesium.ImageMaterialProperty({
          image: canvas,
          transparent: true,
        }),
        // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    });
    this._canvas = canvas;
    this._result = { box, data, canvasData, entity };
    return this._result;
  }
  /**
   * 更新热力图数据
   * @param {*} data 待绘制热力图的数据-[{x1,y1,value1},{x2,y2,value2},...]
   */
  setData(data) {
    if (!this._result) {
      return;
    }
    let canvasData = [];
    const height = this._canvas.height;
    const width = this._canvas.width;
    data.forEach((element) => {
      const curMercator = this.WGS84ToWebMercator(
        Number(element.x),
        Number(element.y),
        0
      );
      const per_X =
        (curMercator.x - this.mercator_WestSouth.x) / this.diffDegrees_X;
      const currentPix_X = Math.ceil(per_X * width);
      const per_Y =
        (curMercator.y - this.mercator_WestSouth.y) / this.diffDegrees_Y;
      const currentPix_Y = Math.ceil(per_Y * height);
      const currentValue = Number(element.value);
      canvasData.push({
        x: currentPix_X,
        y: height - currentPix_Y - 1,
        value: currentValue,
      });
    });
    this._result.data = data;
    this._result.canvasData = canvasData;
    this.updateHeatmap(canvasData);
  }
  /**
   * 更新热力图
   * @param {*} data 参考canvasData
   * @returns 热力图结果对象
   */
  updateHeatmap(data) {
    let canvas = this._canvas;
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    let circle = this.createCircle(this._size);
    let circleHalfWidth = circle.width / 2;
    let circleHalfHeight = circle.height / 2;
    // 按透明度分类
    let dataOrderByAlpha = {};
    data.forEach((item) => {
      let alpha =
        item.value < this._min
          ? 0
          : Math.min(1, item.value / this._max).toFixed(2);
      dataOrderByAlpha[alpha] = dataOrderByAlpha[alpha] || [];
      dataOrderByAlpha[alpha].push(item);
    });
    // 绘制不同透明度的圆形
    for (let i in dataOrderByAlpha) {
      if (isNaN(i)) continue;
      let _data = dataOrderByAlpha[i];
      context.beginPath();
      context.globalAlpha = i;
      _data.forEach((item) => {
        context.drawImage(
          circle,
          item.x - circleHalfWidth,
          item.y - circleHalfHeight
        );
      });
    }
    // 圆形着色
    let intensity = new Intensity();
    let colored = context.getImageData(
      0,
      0,
      context.canvas.width,
      context.canvas.height
    );
    const options = { min: 0, max: this._max, size: this._size };
    this.colorize(options, colored.data, intensity.getImageData());
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.putImageData(colored, 0, 0);
    this._result.entity.rectangle.material = new Cesium.ImageMaterialProperty({
      image: canvas,
      transparent: true,
    });
    return this._result;
  }
  createCircle(size) {
    let shadowBlur = size / 2;
    let r2 = size + shadowBlur;
    let offsetDistance = 10000;
    let circle = new Canvas(r2 * 2, r2 * 2);
    let context = circle.getContext("2d");
    context.shadowBlur = shadowBlur;
    context.shadowColor = "black";
    context.shadowOffsetX = context.shadowOffsetY = offsetDistance;
    context.beginPath();
    context.arc(
      r2 - offsetDistance,
      r2 - offsetDistance,
      size,
      0,
      Math.PI * 2,
      true
    );
    context.closePath();
    context.fill();
    return circle;
  }
  colorize(options, pixels, gradient) {
    let max = options.max;
    let min = options.min;
    let diff = max - min;
    let range = options.range || null;
    let jMin = 0;
    let jMax = 1024;
    if (range && range.length === 2) {
      jMin = ((range[0] - min) / diff) * 1024;
    }
    if (range && range.length === 2) {
      jMax = ((range[1] - min) / diff) * 1024;
    }
    let maxOpacity = options.maxOpacity || 0.8;
    for (let i = 3, len = pixels.length, j; i < len; i += 4) {
      j = pixels[i] * 4; // get gradient color from opacity value
      if (pixels[i] / 256 > maxOpacity) {
        pixels[i] = 256 * maxOpacity;
      }
      if (j && j >= jMin && j <= jMax) {
        pixels[i - 3] = gradient[j];
        pixels[i - 2] = gradient[j + 1];
        pixels[i - 1] = gradient[j + 2];
      } else {
        pixels[i] = 0;
      }
    }
  }
  WGS84ToWebMercator(lng, lat, height) {
    let mercator = {};
    let x = (lng * 20037508.34) / 180;
    let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
    y = (y * 20037508.34) / 180;
    mercator.x = x;
    mercator.y = y;
    mercator.z = height;
    return mercator;
  }
  clearAll() {
    this._result && this._viewer.entities.remove(this._result.entity);
    this._result = undefined;
  }
}
export default HeatmapIntensity;
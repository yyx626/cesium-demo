/*
 * 标绘组件主类
 * @Author: yyx
 * @Date: 2022-06-22
 */
import CreateLineArrow from "../../lib/CreateLineArrow";
import CreateSwallowtailArrow from "../../lib/CreateSwallowtailArrow";
import CreateRightAngleArrow from "../../lib/CreateRightAngleArrow";
import CreateRoundRectangle from "../../lib/CreateRoundRectangle";
import CreateSector from "../../lib/CreateSector";
import CreateBow from "../../lib/CreateBow";
import CreatePincerArrow from "../../lib/CreatePincerArrow";
import CreateAttackArrow from "../../lib/CreateAttackArrow";
import CreateStagingArea from "../../lib/CreateStagingArea";
import CreateFlag from "../../lib/CreateFlag";
import CreateFreeLine from "../../lib/CreateFreeLine";
import CreatePolyline from "../../lib/CreatePolyline";
import CreateCurve from "../../lib/CreateCurve";
import CreateFreePolygon from "../../lib/CreateFreePolygon";
import CreatePolygon from "../../lib/CreatePolygon";
import CreateRegularPolygon from "../../lib/CreateRegularPolygon";
class MilitaryPlotting {
  constructor(viewer) {
    if (!viewer) throw new Error("no viewer object!");
    this.viewer = viewer;
    this.resultObject = {
      lineArrow: [], //简单箭头Entity集合
      swallowtailArrow: [], //燕尾箭头Entity集合
      rightAngleArrow: [], //直角箭头Entity集合
      roundRectangle: [], //圆角矩形Entity集合
      sector: [], //扇形Entity集合
      bow: [], //弓形Entity集合
      pincerArrow: [], //钳击箭头Entity集合
      attackArrow: [], //进攻箭头Entity集合
      stagingArea: [], //集结地Entity集合
      flag: [], //旗标Entity集合
      freeLine: [], //自由线Entity集合
      polyline: [], //折线Entity集合
      curve: [], //圆滑曲线Entity集合
      freePolygon: [], //自由面Entity集合
      polygon: [], //多边形Entity集合
      regularPolygon: [], //正多边形Entity集合
    };
  }
  /**
   * 创建正多边形
   * @param {*} options 参数{id，color，num}
   * @param {*} callBack 回调函数，可直接引用创建的对象
   */
  CreateRegularPolygon(options, callBack) {
    CreateRegularPolygon(
      this.viewer,
      this.resultObject.regularPolygon,
      options,
      callBack
    );
  }
  /**
   * 创建多边形
   * @param {*} options 参数{id，color}
   * @param {*} callBack 回调函数，可直接引用创建的对象
   */
  CreatePolygon(options, callBack) {
    CreatePolygon(this.viewer, this.resultObject.polygon, options, callBack);
  }
  /**
   * 创建自由面
   * @param {*} options 参数{id，color}
   * @param {*} callBack 回调函数，可直接引用创建的对象
   */
  CreateFreePolygon(options, callBack) {
    CreateFreePolygon(
      this.viewer,
      this.resultObject.freePolygon,
      options,
      callBack
    );
  }
  /**
   * 创建圆滑曲线
   * @param {*} options 参数{id，color，width}
   * @param {*} callBack 回调函数，可直接引用创建的对象
   */
  CreateCurve(options, callBack) {
    CreateCurve(this.viewer, this.resultObject.curve, options, callBack);
  }
  /**
   * 创建笔直折线
   * @param {*} options 参数{id，color，width}
   * @param {*} callBack 回调函数，可直接引用创建的对象
   */
  CreatePolyline(options, callBack) {
    CreatePolyline(this.viewer, this.resultObject.polyline, options, callBack);
  }
  /**
   * 创建自由曲线
   * @param {*} options 参数{id，color，width}
   * @param {*} callBack 回调函数，可直接引用创建的对象
   */
  CreateFreeLine(options, callBack) {
    CreateFreeLine(this.viewer, this.resultObject.freeLine, options, callBack);
  }
  /**
   * 创建倒三角旗标
   * @param {*} options 参数{id，color，type}
   * @param {*} callBack 回调函数，可直接引用创建的对象
   */
  CreateFlag(options, callBack) {
    CreateFlag(this.viewer, this.resultObject.flag, options, callBack);
  }
  /**
   * 创建集结地
   * @param {*} options 参数{id，color}
   * @param {*} callBack 回调函数，可直接引用创建的对象
   */
  CreateStagingArea(options, callBack) {
    CreateStagingArea(
      this.viewer,
      this.resultObject.stagingArea,
      options,
      callBack
    );
  }
  /**
   * 创建进攻箭头
   * @param {*} options 参数{id，color}
   * @param {*} callBack 回调函数，可直接引用创建的对象
   */
  CreateAttackArrow(options, callBack) {
    CreateAttackArrow(
      this.viewer,
      this.resultObject.attackArrow,
      options,
      callBack
    );
  }
  /**
   * 创建钳击箭头
   * @param {*} options 参数{id，color}
   * @param {*} callBack 回调函数，可直接引用创建的对象
   */
  CreatePincerArrow(options, callBack) {
    CreatePincerArrow(
      this.viewer,
      this.resultObject.pincerArrow,
      options,
      callBack
    );
  }
  /**
   * 创建弓形
   * @param {*} options 参数{id，color}
   * @param {*} callBack 回调函数，可直接引用创建的对象
   */
  CreateBow(options, callBack) {
    CreateBow(this.viewer, this.resultObject.bow, options, callBack);
  }
  /**
   * 创建扇形
   * @param {*} options 参数{id，color}
   * @param {*} callBack 回调函数，可直接引用创建的对象
   */
  CreateSector(options, callBack) {
    CreateSector(this.viewer, this.resultObject.sector, options, callBack);
  }
  /**
   * 创建圆角矩形
   * @param {*} options 参数{id，color}
   * @param {*} callBack 回调函数，可直接引用创建的对象
   */
  CreateRoundRectangle(options, callBack) {
    CreateRoundRectangle(
      this.viewer,
      this.resultObject.roundRectangle,
      options,
      callBack
    );
  }
  /**
   * 创建直角箭头
   * @param {*} options 参数{id，color}
   * @param {*} callBack 回调函数，可直接引用创建的对象
   */
  CreateRightAngleArrow(options, callBack) {
    CreateRightAngleArrow(
      this.viewer,
      this.resultObject.rightAngleArrow,
      options,
      callBack
    );
  }
  /**
   * 创建简单箭头-直线Or曲线
   * @param {*} options {color，id，width，straight}
   * @param {*} callback 回调函数，可直接引用创建的对象
   */
  CreateLineArrow(options, callback) {
    CreateLineArrow(
      this.viewer,
      this.resultObject.lineArrow,
      options,
      callback
    );
  }
  /**
   * 创建燕尾箭头
   * @param {*} options {id，color}
   * @param {*} callBack 回调函数，可直接引用创建的对象
   */
  CreateSwallowtailArrow(options, callBack) {
    CreateSwallowtailArrow(
      this.viewer,
      this.resultObject.swallowtailArrow,
      options,
      callBack
    );
  }
  /**
   * 清除所有创建的对象
   */
  clearAll() {
    for (const key in this.resultObject) {
      if (Object.hasOwnProperty.call(this.resultObject, key)) {
        const element = this.resultObject[key];
        for (let index = 0; index < element.length; index++) {
          const el = element[index];
          this.viewer.entities.remove(el);
          element.splice(index, 1);
          index -= 1;
        }
      }
    }
  }
}
export default MilitaryPlotting;
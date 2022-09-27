/*
 * @Author: yyx
 * @Date: 2022-09-27
 */
//注意：
//①：加载geojson格式的数据，如果是以primitive的形式，需要想办法传入boundary参数，不然无法定位
//②：加载模型的时候，如果移动过位置，需要传入boundary，防治定位错误
const Cesium = window.Cesium;
class ProjectTree {
  constructor(viewer, sourceData) {
    if (!viewer) throw new Error("no viewer object!");
    this.viewer = viewer;
    this.sourceData = Cesium.defaultValue(sourceData, []); //工程树初始化的数据
    this.checkedItems = []; //工程树勾选的节点
    this.itemTypes = [
      "imagery-layer",
      "terrain-layer",
      "entity-point",
      "entity-polyline",
      "entity-polygon",
      "geojson-entity",
      "geojson-primitive",
      "model-gltf",
      "model-b3dm",
    ]; //树结构数据所能包含的所有数据类型
    this.init();
  }
  init() {
    this.initChecked(this.sourceData);
  }
  //初始化树节点选择项
  initChecked(data) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element.checked) {
        this.checkedItems.push(element.id);
      } else {
        if (element.children && element.children.length > 0) {
          this.initChecked(element.children);
        }
      }
    }
  }
  // 生成唯一uuid
  guid() {
    return "xxxxx-xxxx-xxxx-xxxx-xxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  /**
   * 往指定id节点下新增一个子节点
   * @param {string} id 工程树上待增加节点的id
   * @param {object} data { id: 节点id, label: 节点显示内容, checked: 是否勾选, type: 数据类型，参考 data: 节点绑定数据, boundary: 边界，例[118.9, 33.9, 119.1, 34.1]-西南东北, }
   */
  add(id, data) {
    for (let index = 0; index < this.sourceData.length; index++) {
      const element = this.sourceData[index];
      if (element.children) {
        if (element.id === id) {
          element.children.push(data);
          this.initShow(data, data.checked);
          return;
        } else {
          if (element.children.length > 0) {
            this.childrenAdd(id, element.children, data);
          }
        }
      }
    }
  }
  //递归遍历获取节点
  childrenAdd(id, data, ele) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element.children) {
        if (element.id === id) {
          element.children.push(ele);
          this.initShow(ele, ele.checked);
          return;
        } else {
          if (element.children.length > 0) {
            this.childrenAdd(id, element.children, ele);
          }
        }
      }
    }
  }
  //新增节点时，控制图层初始化显示或隐藏-仅在执行add时使用
  initShow(item, boolShow) {
    const type = item.type;
    const data = item.data;
    switch (type) {
      case "imagery-layer":
      case "entity-point":
      case "entity-polyline":
      case "entity-polygon":
      case "geojson-entity":
      case "geojson-primitive":
      case "model-gltf":
      case "model-b3dm":
        data.show = boolShow;
        break;
      case "terrain-layer":
        boolShow
          ? (this.viewer.terrainProvider = data)
          : (this.viewer.scene.terrainProvider =
              new Cesium.EllipsoidTerrainProvider({}));
        break;
    }
  }
  //控制图层显示或者隐藏
  setShow(item, boolShow) {
    if (item.children) {
      for (let index = 0; index < item.children.length; index++) {
        const element = item.children[index];
        this.setShow(element, boolShow);
      }
    } else {
      this.initShow(item, boolShow);
      this.refreshChecked(this.sourceData);
    }
  }
  // 更新sourceData内各节点checked状态
  refreshChecked(data) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      element.checked = this.checkedItems.indexOf(element.id) != -1;
      if (element.children && element.children.length > 0) {
        this.refreshChecked(element.children);
      }
    }
  }
  //地图定位到当前节点图层
  flyTo(node) {
    if (node.boundary) {
      let rectangle = new Cesium.Rectangle.fromDegrees(
        node.boundary[0],
        node.boundary[1],
        node.boundary[2],
        node.boundary[3]
      );
      this.viewer.camera.flyTo({
        destination: rectangle,
      });
    } else {
      switch (node.type) {
        case "imagery-layer":
        case "geojson-entity":
          this.viewer.flyTo(node.data);
          break;
        case "entity-point":
        case "entity-polyline":
        case "entity-polygon":
          this.viewer.flyTo(node.data._children);
          break;
        case "model-gltf":
        case "model-b3dm":
          this.viewer.camera.flyToBoundingSphere(node.data.boundingSphere);
          break;
        case "geojson-primitive":
        case "terrain-layer":
          break;
      }
    }
  }
  //移除工程树对象
  remove(data) {
    if (data.children) {
      for (let index = 0; index < data.children.length; index++) {
        const element = data.children[index];
        this.remove(element);
      }
    } else {
      this.removeItem(data);
    }
  }
  removeItem(item) {
    switch (item.type) {
      case "imagery-layer":
        this.viewer.imageryLayers.remove(item.data);
        break;
      case "geojson-entity":
        this.viewer.dataSources.remove(item.data);
        break;
      case "entity-point":
      case "entity-polyline":
      case "entity-polygon":
        item.data._children.forEach((element) => {
          this.viewer.entities.remove(element);
        });
        this.viewer.entities.remove(item.data);
        break;
      case "model-gltf":
      case "model-b3dm":
      case "geojson-primitive":
        this.viewer.scene.primitives.remove(item.data);
        break;
      case "terrain-layer":
        break;
    }
  }
}
export default ProjectTree;
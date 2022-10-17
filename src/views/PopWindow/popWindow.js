/*
 * 自定义弹窗
 * @Author: yyx
 * @Date: 2022-10-17
 */
const Cesium = window.Cesium;
class PopupWindow {
  constructor(viewer, mapId, popupId, popupList) {
    if (!viewer) throw new Error("no viewer object!");
    this.viewer = viewer;
    this.documentHtml = document.getElementById(popupId).outerHTML;
    this.mapContainer = document.getElementById(mapId);
    this.popupList = Cesium.defaultValue(popupList, []);
  }
  newPopup(options) {
    const viewer = this.viewer;
    let offset_x = Cesium.defaultValue(options.offset_x, 0);
    let offset_y = Cesium.defaultValue(options.offset_y, 0);
    let name = Cesium.defaultValue(options.name, "newPopup");
    let position = options.position;
    let pos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      viewer.scene,
      position
    );
    let left_init = pos.x + offset_x;
    let top_init = pos.y + offset_y;
    let popDiv = document.createElement("div");
    popDiv.style =
      "position: absolute;left: " + left_init + "px;top: " + top_init + "px;";
    popDiv.innerHTML = this.documentHtml.replace("id=", "name=");
    this.mapContainer.appendChild(popDiv);
    this.popupList.push({ name: name, documentNode: popDiv });
    viewer.scene.postRender.addEventListener(() => {
      if (Cesium.defined(position)) {
        let changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          viewer.scene,
          position
        );
        let curPos = new Cesium.Cartesian2(changedC.x, changedC.y);
        let left = curPos.x + offset_x;
        let top = curPos.y + offset_y;
        popDiv.style =
          "position: absolute;left: " + left + "px;top: " + top + "px;";
      }
    });
    return popDiv;
  }
  remove(name) {
    this.popupList.forEach((element, index) => {
      if (element.name === name) {
        this.mapContainer.removeChild(element.documentNode);
        this.popupList.splice(index, 1);
      }
    });
  }
  removeAll() {
    this.popupList.forEach((element) => {
      this.mapContainer.removeChild(element.documentNode);
    });
    this.popupList = [];
  }
}
export default PopupWindow;
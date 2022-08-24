/*
 * @Author: yyx
 * @Date: 2022-08-24
 */
const Cesium = window.Cesium;
class CutFillAnalysis {
  constructor(viewer, positions, height, precision) {
    if (!viewer) throw new Error("no viewer object!");
    this.viewer = viewer;
    if (!positions) throw new Error("no positions object!");
    this.positions = positions;
    if (!height) throw new Error("no height object!");
    this.height = height;
    this.precision = precision || 256;
    this.maxHeigh = -1000000;
    this.createPolygonGeo(this.positions);
  }
  createPolygonGeo(points) {
    //计算网格粒度-精度
    let granularity = Math.PI / Math.pow(2, 11);
    granularity = granularity / this.precision;
    let polygonGeometry = new Cesium.PolygonGeometry.fromPositions({
      positions: points,
      vertexFormat: Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
      granularity: granularity,
    });
    //创建多边形平面几何体
    this.geom = new Cesium.PolygonGeometry.createGeometry(polygonGeometry);
  }
  VolumeAnalysis() {
    let cutArea = 0,
      cutVolume = 0,
      fillArea = 0,
      fillVolume = 0,
      noArea = 0;
    const indices = this.geom.indices; //获取顶点索引数据
    const positions = this.geom.attributes.position.values;
    for (let index = 0; index < indices.length; index += 3) {
      const pos0 = this.returnPosition(positions, indices[index]);
      const pos1 = this.returnPosition(positions, indices[index + 1]);
      const pos2 = this.returnPosition(positions, indices[index + 2]);
      this.viewer.entities.add({
        name: "三角面",
        polygon: {
          hierarchy: [pos0.heightPos, pos1.heightPos, pos2.heightPos],
          perPositionHeight: true,
          material: Cesium.Color.fromRandom(),
          extrudedHeight: this.height,
          outline: true,
          outlineColor: Cesium.Color.BLACK,
        },
      });
      //水平状态下三角形面积
      const area = this.computeArea4Triangle(
        pos0.noHeightPos,
        pos1.noHeightPos,
        pos2.noHeightPos
      );
      //计算三个点的均高
      const height = (pos0.height + pos1.height + pos2.height) / 3;
      if (height < this.height) {
        // 需要填方的部分
        fillArea += area;
        const volume = area * (this.height - height);
        fillVolume += volume;
      } else if (height == this.height) {
        noArea += area;
      } else {
        // 需要挖方的部分
        cutArea += area;
        const volume = area * (height - this.height);
        cutVolume += volume;
      }
    }
    const allArea = cutArea + fillArea + noArea;
    this.result = {
      allArea,
      cutArea,
      cutVolume,
      fillArea,
      fillVolume,
      noArea,
    };
    return this.result;
  }
  computeCentroid4Polygon(positions) {
    let x = [],
      y = [];
    let allX = 0,
      allY = 0;
    for (let i = 0; i < positions.length; i++) {
      let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
      allX += cartographic.longitude;
      allY += cartographic.latitude;
      x.push(cartographic.longitude);
      y.push(cartographic.latitude);
    }
    let centroidx = allX / positions.length;
    let centroidy = allY / positions.length;
    const Cartographic = new Cesium.Cartographic(centroidx, centroidy);
    return Cesium.Cartesian3.fromRadians(
      Cartographic.longitude,
      Cartographic.latitude,
      this.maxHeigh + 30
    );
  }
  /**
   * 海伦公式求取三角形面积
   * @param {*} pos1
   * @param {*} pos2
   * @param {*} pos3
   * @returns 三角形面积㎡
   */
  computeArea4Triangle(pos1, pos2, pos3) {
    let a = Cesium.Cartesian3.distance(pos1, pos2);
    let b = Cesium.Cartesian3.distance(pos2, pos3);
    let c = Cesium.Cartesian3.distance(pos3, pos1);
    let S = (a + b + c) / 2;
    return Math.sqrt(S * (S - a) * (S - b) * (S - c));
  }
  returnPosition(positions, index) {
    let cartesian = new Cesium.Cartesian3(
      positions[index * 3],
      positions[index * 3 + 1],
      positions[index * 3 + 2]
    );
    let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    let height = this.viewer.scene.sampleHeightSupported
      ? this.viewer.scene.sampleHeight(cartographic)
      : this.viewer.scene.globe.getHeight(cartographic);
 
    if (height > this.maxHeigh) {
      this.maxHeigh = height;
    }
 
    return {
      heightPos: Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        height
      ),
      noHeightPos: Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        0
      ),
      height: height,
    };
  }
}
export default CutFillAnalysis;
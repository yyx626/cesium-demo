<template>
  <div id="cesiumContainer">
    <tree-cesium
      v-if="loadFinish"
      class="tree-div-main"
      :projectTree="projectTree"
    ></tree-cesium>
  </div>
</template>
<script>
import TreeCesium from "../../components/TreeCesium.vue";
import ProjectTree from "./ProjectTree";
import pointJson from "../../../public/data/json/point.json";
import polylineJson from "../../../public/data/json/polyline.json";
import polygonJson from "../../../public/data/json/polygon.json";
export default {
  components: { TreeCesium },
  data() {
    return {
      loadFinish: false,
      projectTree: undefined,
      Directory: [
        {
          id: "imageryLayer",
          label: "影像数据集",
          checked: false,
          children: [],
        },
        {
          id: "terrainLayer",
          label: "地形数据集",
          checked: false,
          children: [],
        },
        {
          id: "entityLayer",
          label: "Entity数据集",
          checked: false,
          children: [
            {
              id: "entityPoints",
              label: "点",
              checked: false,
              children: [],
            },
            {
              id: "entityPolylines",
              label: "折线",
              checked: false,
              children: [],
            },
            {
              id: "entityPolygons",
              label: "面",
              checked: false,
              children: [],
            },
          ],
        },
        {
          id: "geojsonLayer",
          label: "geojson数据集",
          checked: false,
          children: [],
        },
        {
          id: "modelLayer",
          label: "模型数据",
          checked: false,
          children: [],
        },
      ], //初始化的时候需要自定义一级目录；一级目录的checked建议初始的时候均为false，在往目录下增加节点的时候，每个节点会有自己的checked属性
    };
  },
  mounted() {
    let Cesium = window.Cesium;
    let key =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDhhOThhNy0zMzUzLTRiZDktYWM3Ni00NGI5MGY2N2UwZDUiLCJpZCI6MjQzMjYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODUwMzUwNDh9.DYuDF_RPKe5_8w849_y-sutM68LM51O9o3bTt_3rF1w";
    Cesium.Ion.defaultAccessToken = key;
    window.viewer = new Cesium.Viewer("cesiumContainer", {
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      }),
      geocoder: true,
      homeButton: true,
      sceneModePicker: true,
      baseLayerPicker: true,
      navigationHelpButton: true,
      animation: true,
      timeline: true,
      fullscreenButton: true,
      vrButton: true,
      //关闭点选出现的提示框
      selectionIndicator: false,
      infoBox: false,
    });
    window.viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权
    window.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(120, 26, 1500000.0),
    });
    this.loadFinish = true;
    this.initLayer();
  },
  methods: {
    initLayer() {
      window.projectTree = this.projectTree = new ProjectTree(
        window.viewer,
        this.Directory
      );
      this.initImageLayer(); //初始化影像目录用例
      this.initTerrainLayer(); //初始化地形目录用例
      this.initEntityPoints(); //初始化entity点用例
      this.initEntityPolyines(); //初始化entity线用例
      this.initEntityPolygons(); //初始化entity面用例
      this.initGeojson(); //初始化geojson数据用例
      this.initModels(); //初始化模型数据用例
    },
    initModels() {
      const viewer = window.viewer;
      const Cesium = window.Cesium;
      const projectTree = this.projectTree;
      //gltf,glb格式模型
      let model = Cesium.Model.fromGltf({
        url: `${window.location.origin}/data/model/house/scene.gltf`,
        modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
          Cesium.Cartesian3.fromDegrees(119, 34, 500)
        ),
        scale: 5000, //放大倍数
      });
      viewer.scene.primitives.add(model);
      const gltfModel = {
        id: "gltfModel",
        label: "gltf模型",
        checked: true,
        type: "model-gltf",
        data: model,
        boundary: [118.9, 33.9, 119.1, 34.1],
      };
      projectTree.add("modelLayer", gltfModel);
      //b3dm格式模型
      let tilesetModel = new Cesium.Cesium3DTileset({
        url: `${window.location.origin}/data/model/osgb/tileset.json`,
      });
      viewer.scene.primitives.add(tilesetModel);
      const b3dmModel = {
        id: "b3dmModel",
        label: "b3dm模型",
        checked: true,
        type: "model-b3dm",
        data: tilesetModel,
      };
      projectTree.add("modelLayer", b3dmModel);
    },
    initGeojson() {
      const viewer = window.viewer;
      const Cesium = window.Cesium;
      const projectTree = this.projectTree;
      //entity形式数据
      viewer.dataSources
        .add(
          Cesium.GeoJsonDataSource.load(polygonJson, {
            stroke: Cesium.Color.YELLOW.withAlpha(1),
            strokeWidth: 20,
            fill: Cesium.Color.GREEN.withAlpha(0.5),
            clampToGround: true,
          })
        )
        .then((data) => {
          const geojsonEntity = {
            id: "geojsonEntity",
            label: "Entity形式图层",
            checked: false,
            type: "geojson-entity",
            data: data,
          };
          projectTree.add("geojsonLayer", geojsonEntity);
        });
      //primitive形式面数据
      Cesium.GeoJsonDataSource.load(polygonJson).then(function (dataSource) {
        let entities = dataSource.entities.values;
        let _geometryInstances = []; //用于合并多个GeometryInstances，极大的提高性能
        for (let i = 0; i < entities.length; i++) {
          let entity = entities[i];
          let _points = entity.polygon.hierarchy._value.positions;
          let _polygon = new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(_points),
            extrudedHeight: 0,
            height: 0,
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
          });
          _geometryInstances.push(
            new Cesium.GeometryInstance({
              geometry: _polygon,
              attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                  Cesium.Color.fromRandom({ alpha: 0.5 })
                ),
              },
            })
          );
        }
        const primitive = new Cesium.GroundPrimitive({
          geometryInstances: _geometryInstances,
          appearance: new Cesium.PerInstanceColorAppearance({
            translucent: true,
            closed: false,
          }),
        });
        viewer.scene.primitives.add(primitive);
        const geojsonPolygon = {
          id: "geojsonPolygon",
          label: "primitive形式面图层",
          checked: true,
          type: "geojson-primitive",
          data: primitive,
          boundary: [119.5, 35.5, 120.5, 36.4],
        };
        projectTree.add("geojsonLayer", geojsonPolygon);
      });
      //primitive形式点数据
      Cesium.GeoJsonDataSource.load(pointJson).then(function (dataSource) {
        let entities = dataSource.entities.values;
        let pointsPrimitives = new Cesium.BillboardCollection();
        for (let i = 0; i < entities.length; i++) {
          let entity = entities[i];
          let billboard = {
            image:
              "data:image/png;base64,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",
            position: entity.position._value,
            width: 33,
            height: 44,
            id: entity,
          };
          pointsPrimitives.add(billboard);
        }
        viewer.scene.primitives.add(pointsPrimitives);
        const geojsonPoint = {
          id: "geojsonPoint",
          label: "primitive形式点图层",
          checked: true,
          type: "geojson-primitive",
          data: pointsPrimitives,
          boundary: [119.5, 35.4, 120.5, 36.5], //西，南，东，北,
        };
        projectTree.add("geojsonLayer", geojsonPoint);
      });
      //primitive形式线数据
      Cesium.GeoJsonDataSource.load(polylineJson).then(function (dataSource) {
        let entities = dataSource.entities.values;
        window.m_polyline = dataSource;
        let geoInstances = [];
        for (let i = 0; i < entities.length; i++) {
          let entity = entities[i];
          let positions = entity.polyline.positions._value;
          let _polyline = new Cesium.GroundPolylineGeometry({
            positions: positions,
            width: 4.0,
          });
          geoInstances.push(
            new Cesium.GeometryInstance({
              geometry: _polyline,
              id: "polyline" + i,
            })
          );
        }
        const primitive = new Cesium.GroundPolylinePrimitive({
          geometryInstances: geoInstances,
          appearance: new Cesium.PolylineMaterialAppearance(),
        });
        viewer.scene.primitives.add(primitive);
        const geojsonPolyline = {
          id: "geojsonPolyline",
          label: "primitive形式线图层",
          checked: false,
          type: "geojson-primitive",
          data: primitive,
          boundary: [119.5, 35.5, 120.5, 36.5], //西，南，东，北,
        };
        projectTree.add("geojsonLayer", geojsonPolyline);
      });
    },
    initEntityPolygons() {
      const viewer = window.viewer;
      const Cesium = window.Cesium;
      let polygonCollection_0 = viewer.entities.add(new Cesium.Entity());
      viewer.entities.add({
        name: "自定义面图层0",
        parent: polygonCollection_0,
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            118.1234, 26.343, 118.5244, 26.233, 118.234, 26.533,
          ]),
          material: Cesium.Color.YELLOW.withAlpha(0.9),
          outline: true,
          outlineColor: Cesium.Color.BLACK,
        },
      });
      const polygon0 = {
        id: "polygon0",
        label: "自定义面图层0",
        checked: true,
        type: "entity-polyline",
        data: polygonCollection_0,
      };
      this.projectTree.add("entityPolygons", polygon0);
    },
    initEntityPolyines() {
      const viewer = window.viewer;
      const Cesium = window.Cesium;
      let polylineCollection_0 = viewer.entities.add(new Cesium.Entity());
      for (let index = 1; index < 5; index++) {
        let positions0 = Cesium.Cartesian3.fromDegreesArray([
          120 + index * 0.01,
          26 + index * 0.3,
          120 + index * 1,
          26 + index * 0.3,
        ]);
        viewer.entities.add({
          name: "自定义线段0",
          parent: polylineCollection_0,
          polyline: {
            positions: positions0,
            width: 10.0,
            material: Cesium.Color.DEEPSKYBLUE,
          },
        });
      }
      const polyline0 = {
        id: "polyline0",
        label: "自定义线段0",
        checked: true,
        type: "entity-polyline",
        data: polylineCollection_0,
      };
      this.projectTree.add("entityPolylines", polyline0);
      let polylineCollection_1 = viewer.entities.add(new Cesium.Entity());
      for (let index = 1; index < 4; index++) {
        let positions1 = Cesium.Cartesian3.fromDegreesArray([
          119 + index * 0.01,
          25.5 + index * 0.3,
          119 + index * 1,
          25.5 + index * 0.3,
        ]);
        viewer.entities.add({
          name: "自定义线段1",
          parent: polylineCollection_1,
          polyline: {
            positions: positions1,
            width: 10.0,
            material: Cesium.Color.RED,
          },
        });
      }
      const polyline1 = {
        id: "polyline1",
        label: "自定义线段1",
        checked: false,
        type: "entity-polyline",
        data: polylineCollection_1,
      };
      this.projectTree.add("entityPolylines", polyline1);
    },
    initEntityPoints() {
      const viewer = window.viewer;
      const Cesium = window.Cesium;
      let pointCollection_0 = viewer.entities.add(new Cesium.Entity());
      for (let index = 0; index < 10; index++) {
        viewer.entities.add({
          name: "自定义点0",
          parent: pointCollection_0,
          position: Cesium.Cartesian3.fromDegrees(120 + index * 0.05, 25),
          point: {
            color: Cesium.Color.SKYBLUE,
            pixelSize: 10,
            outlineColor: Cesium.Color.YELLOW,
            outlineWidth: 3,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });
      }
      const point0 = {
        id: "point0",
        label: "自定义点0",
        checked: false,
        type: "entity-point",
        data: pointCollection_0,
        boundary: [120, 23, 125, 33], //西，南，东，北,
      };
      this.projectTree.add("entityPoints", point0);
      let pointCollection_1 = viewer.entities.add(new Cesium.Entity());
      for (let index = 0; index < 20; index++) {
        viewer.entities.add({
          name: "自定义点1",
          parent: pointCollection_1,
          position: Cesium.Cartesian3.fromDegrees(120 + index * 0.05, 25.3),
          point: {
            color: Cesium.Color.YELLOW,
            pixelSize: 10,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 3,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });
      }
      const point1 = {
        id: "point1",
        label: "自定义点1",
        checked: true,
        type: "entity-point",
        data: pointCollection_1,
      };
      this.projectTree.add("entityPoints", point1);
      let pointCollection_2 = viewer.entities.add(new Cesium.Entity());
      for (let index = 0; index < 15; index++) {
        viewer.entities.add({
          name: "自定义点2",
          parent: pointCollection_2,
          position: Cesium.Cartesian3.fromDegrees(120 + index * 0.05, 25.6),
          point: {
            color: Cesium.Color.RED,
            pixelSize: 10,
            outlineColor: Cesium.Color.GREEN,
            outlineWidth: 3,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });
      }
      const point2 = {
        id: "point2",
        label: "自定义点2",
        checked: false,
        type: "entity-point",
        data: pointCollection_2,
      };
      this.projectTree.add("entityPoints", point2);
    },
    initImageLayer() {
      const viewer = window.viewer;
      const Cesium = window.Cesium;
      const baseLayer = {
        id: "baseImageryLayer",
        label: "默认底图",
        checked: true,
        type: "imagery-layer",
        data: viewer.imageryLayers._layers[0],
      };
      this.projectTree.add("imageryLayer", baseLayer);
      let darkMapData = viewer.imageryLayers.addImageryProvider(
        new Cesium.ArcGisMapServerImageryProvider({
          url: "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
        })
      );
      const darkImageryLayer = {
        id: "darkImageryLayer",
        label: "深色系底图",
        checked: false,
        type: "imagery-layer",
        data: darkMapData,
      };
      this.projectTree.add("imageryLayer", darkImageryLayer);
    },
    initTerrainLayer() {
      const Cesium = window.Cesium;
      let terrainProvider = new Cesium.createWorldTerrain();
      const baseTerrainLayer = {
        id: "baseTerrainLayer",
        label: "默认地形",
        checked: false,
        type: "terrain-layer",
        data: terrainProvider,
      };
      this.projectTree.add("terrainLayer", baseTerrainLayer);
    },
  },
};
</script>
<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
  .tree-div-main {
    position: absolute;
    left: 5px;
    top: 20px;
    height: 50%;
    width: 280px;
    z-index: 99;
    border: 1px solid darkgray;
  }
}
</style>
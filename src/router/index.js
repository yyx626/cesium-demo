import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  // {
  //   path: "/",
  //   name: "Home",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "about" */ "../views/Viewershed/Viewershed.vue"
  //     ),
  // },

  // 重定向：项目跑起来时，访问/ 立马定向到首页
  {
    path: "*",
    redirect: "/index"
  },
  // 首页
  {
    path:"/index",
    component:()=>import("../views/ImageryLayer/ImageryLayer.vue")
  },
  {
    path: "/bufferAnalysis",
    name: "BufferAnalysis",
    component: () => import("../views/BufferAnalysis/BufferAnalysis.vue"),
  },
  {
    path: "/cesiumEcharts",
    name: "CesiumEcharts",
    component: () => import("../views/CesiumEcharts/CesiumEcharts.vue"),
  },
  {
    path: "/cesiumTree",
    name: "CesiumTree",
    component: () => import("../views/CesiumTree/CesiumTree.vue"),
  },
  {
    path: "/cesiumParameter",
    name: "CesiumParameter",
    component: () => import("../views/CesiumParameter/CesiumParameter.vue")
  },
  {
    path:"/clusterAnalysis",
    name:"ClusterAnalysis",
    component:()=>import("../views/ClusterAnalysis/ClusterAnalysis.vue")
  },
  {
    path: "/cutFill",
    name: "CutFill",
    component: () => import("../views/CutFill/CutFill.vue")
  },
  {
    path: "/dynamicTrailMaterial",
    name: "DynamicTrailMaterial",
    component: () => import("../views/DynamicTrailMaterial/DynamicTrailMaterial.vue")
  },
  {
    path: "/edit3dm",
    name: "Edit3dm",
    component: () => import("../views/Edit3DM/Edit3dm.vue")
  },
  {
    path: "/electric",
    name: "Electric",
    component: () => import("../views/ElectricMaterial/ElectricMaterial.vue")
  },
  {
    path: "/pathPlanning",
    name: "PathPlanning",
    component: () => import("../views/PathPlanning/PathPlanning.vue")
  },
  {
    path: "/radarEffect1",
    name: "RadarEffect1",
    component: () => import("../views/RadarEffect/RadarEffect1.vue")
  },
  {
    path: "/radarEffect2",
    name: "RadarEffect12",
    component: () => import("../views/RadarEffect/RadarEffect2.vue")
  },
  {
    path: "/radarEffect3",
    name: "RadarEffect13",
    component: () => import("../views/RadarEffect/RadarEffect3.vue")
  },
  {
    path: "/realtimePath",
    name: "RealtimePath",
    component: () => import("../views/Path/RealtimePath.vue")
  },
  {
    path: "/flood",
    name: "Flood",
    component: () => import("../views/Flood/Flood.vue")
  },
  {
    path: "/flyingLine",
    name: "FlyingLine",
    component: () => import("../views/FlyingLine/FlyingLine.vue")
  },
  {
    path: "/flyingLine_1",
    name: "FlyingLine_1",
    component: () => import("../views/FlyingLine/FlyingLine_1.vue")
  },
  {
    path: "/geojsonBillboard",
    name: "GeojsonBillboard",
    component: () => import("../views/GeojsonBillboard/GeojsonBillboard.vue")
  },
  {
    path: "/heatmap",
    name: "Heatmap",
    component: () => import("../views/HeatMap/HeatmapCustom.vue")
  },
  {
    path: "/historyPath",
    name: "HistoryPath",
    component: () => import("../views/Path/HistoryPath.vue")
  },
  {
    path: "/historyPathRefresh",
    name: "HistoryPathRefresh",
    component: () => import("../views/Path/HistoryPathRefresh.vue")
  },
  {
    path: "/measure",
    name: "Measure",
    component: () => import("../views/Measure/Measure.vue"),
  },
  {
    path: "/militaryPlotting",
    name: "MilitaryPlotting",
    component: () => import("../views/MilitaryPlotting/MilitaryPlotting.vue"),
  },
  {
    path: "/profileAnalysis",
    name: "ProfileAnalysis",
    component: () => import("../views/ProfileAnalysis/ProfileAnalysis.vue")
  },
  {
    path: "/popWindow",
    name: "PopWindow",
    component: () => import("../views/PopWindow/PopWindow.vue")
  },
  {
    path: "/shapeFile",
    name: "ShapeFile",
    component: () => import("../views/ShapeFile/ShapeFile.vue")
  },
  {
    path: "/slopeAspect",
    name: "SlopeAspect",
    component: () => import("../views/SlopeAspect/SlopeAspect.vue")
  },
  {
    path: "/splitScreen",
    name: "SplitScreen",
    component: () => import("../views/SplitScreen/SplitScreen.vue")
  },
  {
    path: "/terrainExcavation",
    name: "TerrainExcavation",
    component: () => import("../views/TerrainExcavation/TerrainExcavation.vue")
  },
  {
    path: "/viewershed",
    name: "Viewershed",
    component: () => import("../views/Viewershed/Viewershed.vue")
  },
  {
    path: "/visibilityAnalysis",
    name: "VisibilityAnalysis",
    component: () => import("../views/VisibilityAnalysis/VisibilityAnalysis.vue")
  },

];

const router = new VueRouter({
  routes,
});

export default router;

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
    path: "/CesiumEcharts",
    name: "CesiumEcharts",
    component: () => import("../views/CesiumEcharts/CesiumEcharts.vue"),
  },
  {
    path: "/CesiumParameter",
    name: "CesiumParameter",
    component: () => import("../views/CesiumParameter/CesiumParameter.vue")
  },
  {
    path:"/ClusterAnalysis",
    name:"ClusterAnalysis",
    component:()=>import("../views/ClusterAnalysis/ClusterAnalysis.vue")
  },
  {
    path: "/CutFill",
    name: "CutFill",
    component: () => import("../views/CutFill/CutFill.vue")
  },
  {
    path: "/RadarEffect1",
    name: "RadarEffect1",
    component: () => import("../views/RadarEffect/RadarEffect1.vue")
  },
  {
    path: "/RadarEffect2",
    name: "RadarEffect12",
    component: () => import("../views/RadarEffect/RadarEffect2.vue")
  },
  {
    path: "/RadarEffect3",
    name: "RadarEffect13",
    component: () => import("../views/RadarEffect/RadarEffect3.vue")
  },
  {
    path: "/FlyingLine",
    name: "FlyingLine",
    component: () => import("../views/FlyingLine/FlyingLine.vue")
  },
  {
    path: "/FlyingLine_1",
    name: "FlyingLine_1",
    component: () => import("../views/FlyingLine/FlyingLine_1.vue")
  },
  {
    path: "/GeojsonBillboard",
    name: "GeojsonBillboard",
    component: () => import("../views/GeojsonBillboard/GeojsonBillboard.vue")
  },
  {
    path: "/HistoryPath",
    name: "HistoryPath",
    component: () => import("../views/HistoryPath/HistoryPath.vue")
  },
  {
    path: "/Measure",
    name: "Measure",
    component: () => import("../views/Measure/Measure.vue"),
  },
  {
    path: "/MilitaryPlotting",
    name: "MilitaryPlotting",
    component: () => import("../views/MilitaryPlotting/MilitaryPlotting.vue"),
  },
  {
    path: "/ProfileAnalysis",
    name: "ProfileAnalysis",
    component: () => import("../views/ProfileAnalysis/ProfileAnalysis.vue")
  },
  {
    path: "/SlopeAspect",
    name: "SlopeAspect",
    component: () => import("../views/SlopeAspect/SlopeAspect.vue")
  },
  {
    path: "/TerrainExcavation",
    name: "TerrainExcavation",
    component: () => import("../views/TerrainExcavation/TerrainExcavation.vue")
  },
  {
    path: "/Viewershed",
    name: "Viewershed",
    component: () => import("../views/Viewershed/Viewershed.vue")
  },
  {
    path: "/VisibilityAnalysis",
    name: "VisibilityAnalysis",
    component: () => import("../views/VisibilityAnalysis/VisibilityAnalysis.vue")
  },

];

const router = new VueRouter({
  routes,
});

export default router;

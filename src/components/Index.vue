<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :unique-opened="true">
        <el-submenu index="1">
          <template slot="title"
            ><i class="el-icon-mouse"></i>Interaction</template
          ><router-link to="/Measure">
            <el-menu-item index="1-1"> Measure </el-menu-item></router-link
          >
          <router-link to="/MilitaryPlotting">
            <el-menu-item index="1-2"> Plotting </el-menu-item></router-link
          >
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"
            ><i class="el-icon-pie-chart"></i>Echarts</template
          ><router-link to="/CesiumEcharts">
            <el-menu-item index="2-1"> Charts </el-menu-item></router-link
          >
          <router-link to="/FlyingLine">
            <el-menu-item index="2-2">
              FlyingLine(converge)
            </el-menu-item></router-link
          ><router-link to="/FlyingLine_1">
            <el-menu-item index="2-3">
              FlyingLine(divergency)
            </el-menu-item></router-link
          >
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"
            ><i class="el-icon-place"></i>Terrain Analysis</template
          ><router-link to="/ProfileAnalysis">
            <el-menu-item index="3-1"> Profile </el-menu-item></router-link
          ><router-link to="/SlopeAspect">
            <el-menu-item index="3-2">
              Slope and Aspect
            </el-menu-item></router-link
          ><router-link to="/CutFill">
            <el-menu-item index="3-3"> Cut and Fill </el-menu-item></router-link
          ><router-link to="/TerrainExcavation">
            <el-menu-item index="3-4"> Terrain Excavation </el-menu-item></router-link
          >
        </el-submenu>
        <el-submenu index="4">
          <template slot="title"
            ><i class="el-icon-view"></i>Visual Analysis</template
          ><router-link to="/Viewershed">
            <el-menu-item index="4-1"> Viewshed </el-menu-item></router-link
          ><router-link to="/VisibilityAnalysis">
            <el-menu-item index="4-2"> Visibility </el-menu-item></router-link
          >
        </el-submenu>
        <el-submenu index="5">
          <template slot="title"
            ><i class="el-icon-camera"></i>Visualization</template
          ><router-link to="/GeojsonBillboard">
            <el-menu-item index="5-1">
              Geojson Billboard
            </el-menu-item></router-link
          >
          <router-link to="/ClusterAnalysis">
            <el-menu-item index="5-1">
              Cluster Analysis
            </el-menu-item></router-link
          ><router-link to="/RadarEffect1">
            <el-menu-item index="5-2">
              Radar Effect_1
            </el-menu-item></router-link
          ><router-link to="/RadarEffect2">
            <el-menu-item index="5-3">
              Radar Effect_2
            </el-menu-item></router-link
          ><router-link to="/RadarEffect3">
            <el-menu-item index="5-4">
              Radar Effect_3
            </el-menu-item></router-link
          >
        </el-submenu>
        <el-submenu index="6">
          <template slot="title"
            ><i class="el-icon-location"></i>Path Animation</template
          ><router-link to="/HistoryPath">
            <el-menu-item index="4-1"> History Path </el-menu-item></router-link
          >
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <router-view />
    </el-container>
  </el-container>
</template>

<script>
export default {}
</script>

<style>
.el-aside {
  color: #333;
}
</style>
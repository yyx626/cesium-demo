<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu>
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-mouse"></i>Interaction</template>
          <el-menu-item index="1-1">
            <router-link to="/Measure">Measure</router-link>
          </el-menu-item>
          <el-menu-item index="1-2">
            <router-link to="/MilitaryPlotting">Plotting</router-link>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-pie-chart"></i>Echarts</template>
          <el-menu-item index="2-1">
            <router-link to="/CesiumEcharts">Charts</router-link>
          </el-menu-item>
          <el-menu-item index="2-2">
            <router-link to="/FlyingLine">FlyingLine(converge)</router-link>
          </el-menu-item>
          <el-menu-item index="2-3">
            <router-link to="/FlyingLine_1">FlyingLine(divergency)</router-link>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"><i class="el-icon-place"></i>Terrain Analysis</template>
          <el-menu-item index="3-1">
            <router-link to="/ProfileAnalysis">Profile</router-link>
          </el-menu-item>
          <el-menu-item index="3-2">
            <router-link to="/SlopeAspect">Slope and Aspect</router-link>
          </el-menu-item>
          <el-menu-item index="3-3">
            <router-link to="/CutFill">Cut and Fill</router-link>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title"><i class="el-icon-view"></i>Visual Analysis</template>
          <el-menu-item index="4-1">
            <router-link to="/Viewershed">Viewshed</router-link>
          </el-menu-item>
          <el-menu-item index="4-2">
            <router-link to="/VisibilityAnalysis">Visibility</router-link>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title"><i class="el-icon-camera"></i>Visualization</template>
          <el-menu-item index="5-1">
            <router-link to="/GeojsonBillboard">Geojson Billboard</router-link>
          </el-menu-item>
          <el-menu-item index="5-2">
            <router-link to="/RadarEffect1">Radar Effect_1</router-link>
          </el-menu-item>
          <el-menu-item index="5-3">
            <router-link to="/RadarEffect2">Radar Effect_2</router-link>
          </el-menu-item>
          <el-menu-item index="5-4">
            <router-link to="/RadarEffect3">Radar Effect_3</router-link>
          </el-menu-item>
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
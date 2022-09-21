<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :unique-opened="true">
        <el-submenu index="1">
          <template slot="title"
            ><i class="el-icon-mouse"></i>Interaction</template
          ><router-link to="/measure">
            <el-menu-item index="1-1"> Measure </el-menu-item></router-link
          >
          <router-link to="/militaryPlotting">
            <el-menu-item index="1-2"> Plotting </el-menu-item></router-link
          >
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"
            ><i class="el-icon-pie-chart"></i>Echarts</template
          ><router-link to="/cesiumEcharts">
            <el-menu-item index="2-1"> Charts </el-menu-item></router-link
          >
          <router-link to="/flyingLine">
            <el-menu-item index="2-2">
              FlyingLine(converge)
            </el-menu-item></router-link
          ><router-link to="/flyingLine_1">
            <el-menu-item index="2-3">
              FlyingLine(divergency)
            </el-menu-item></router-link
          >
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"
            ><i class="el-icon-place"></i>Terrain Analysis</template
          ><router-link to="/profileAnalysis">
            <el-menu-item index="3-1"> Profile </el-menu-item></router-link
          ><router-link to="/slopeAspect">
            <el-menu-item index="3-2">
              Slope and Aspect
            </el-menu-item></router-link
          ><router-link to="/cutFill">
            <el-menu-item index="3-3"> Cut and Fill </el-menu-item></router-link
          ><router-link to="/terrainExcavation">
            <el-menu-item index="3-4"> Terrain Excavation </el-menu-item></router-link
          >
        </el-submenu>
        <el-submenu index="4">
          <template slot="title"
            ><i class="el-icon-view"></i>Visual Analysis</template
          ><router-link to="/viewershed">
            <el-menu-item index="4-1"> Viewshed </el-menu-item></router-link
          ><router-link to="/visibilityAnalysis">
            <el-menu-item index="4-2"> Visibility </el-menu-item></router-link
          >
        </el-submenu>
        <el-submenu index="5">
          <template slot="title"
            ><i class="el-icon-camera"></i>Visualization</template
          ><router-link to="/geojsonBillboard">
            <el-menu-item index="5-1">
              Geojson Billboard
            </el-menu-item></router-link
          >
          <router-link to="/clusterAnalysis">
            <el-menu-item index="5-2">
              Cluster Analysis
            </el-menu-item></router-link
          ><router-link to="/radarEffect1">
            <el-menu-item index="5-3">
              Radar Effect_1
            </el-menu-item></router-link
          ><router-link to="/radarEffect2">
            <el-menu-item index="5-4">
              Radar Effect_2
            </el-menu-item></router-link
          ><router-link to="/radarEffect3">
            <el-menu-item index="5-5">
              Radar Effect_3
            </el-menu-item></router-link
          ><router-link to="/electric">
            <el-menu-item index="5-6">
              Electric material
            </el-menu-item></router-link
          ><router-link to="/dynamicTrailMaterial">
            <el-menu-item index="5-7">
              Dynamic Trail Material
            </el-menu-item></router-link
          >
        </el-submenu>
        <el-submenu index="6">
          <template slot="title"
            ><i class="el-icon-location-outline"></i>Path Animation</template
          ><router-link to="/historyPath">
            <el-menu-item index="6-1"> History Path </el-menu-item></router-link
          ><router-link to="/historyPathRefresh">
            <el-menu-item index="6-2"> History Path Refresh</el-menu-item></router-link
          ><router-link to="/realtimePath">
            <el-menu-item index="6-3"> Realtime Path </el-menu-item></router-link
          >
        </el-submenu>
        <el-submenu index="7">
          <template slot="title"
            ><i class="el-icon-discover"></i>Spatial Analysis</template
          ><router-link to="/flood">
            <el-menu-item index="7-1"> Flood Analysis </el-menu-item></router-link
          >
        </el-submenu>
        <el-submenu index="8">
          <template slot="title"
            ><i class="el-icon-edit"></i>Edit</template
          ><router-link to="/edit3dm">
            <el-menu-item index="8-1"> Edit 3Dtiles </el-menu-item></router-link
          >
        </el-submenu>
        <el-submenu index="9">
          <template slot="title"
            ><i class="el-icon-setting"></i>Map</template
          ><router-link to="/index">
            <el-menu-item index="9-1"> Imagery Layer </el-menu-item></router-link
          ><router-link to="/cesiumParameter">
            <el-menu-item index="9-2"> Cesium Parameter </el-menu-item></router-link
          ><router-link to="/shapeFile">
            <el-menu-item index="9-3"> ShapeFile </el-menu-item></router-link
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
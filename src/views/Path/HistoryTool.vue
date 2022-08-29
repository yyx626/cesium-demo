<template>
  <div class="parames-tool-box">
    <span class="tool-item">
      <label>暂停：</label>
      <el-switch
        v-model="pause"
        active-color="#13ce66"
        inactive-color="#ff4949"
      >
      </el-switch>
    </span>
    <span class="tool-item">
      <label>速度：</label>
      <el-input size="mini" v-model="speed"></el-input>
    </span>
    <span class="tool-item">
      <label>平滑：</label>
      <el-switch
        v-model="smooth"
        active-color="#13ce66"
        inactive-color="#ff4949"
      >
      </el-switch>
    </span>
    <span class="tool-item">
      <label>视角跟随：</label>
      <el-switch
        v-model="tracked"
        active-color="#13ce66"
        inactive-color="#ff4949"
      >
      </el-switch>
    </span>
  </div>
</template>
<script>
export default {
  props: ["historyObj"],
  watch: {
    speed(val) {
      this.historyObj.changeSpeed(val);
    },
    smooth(val) {
      this.historyObj.setPathStyle(this.historyObj.allPathObj, val);
    },
    tracked(val) {
      this.historyObj.trackedModel(this.historyObj.allPathObj, val);
    },
    pause(val) {
      val ? this.historyObj.pause() : this.historyObj.continue();
    },
  },
  data() {
    return {
      pause: false,
      speed: 1,
      smooth: false,
      tracked: false,
    };
  },
};
</script>
<style lang="scss" scoped>
.parames-tool-box {
  position: absolute;
  right: 20px;
  bottom: 50px;
  z-index: 99;
  background-color: darkgrey;
  color: white;
  border-radius: 10px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  .tool-item {
    display: flex;
    margin: 5px 2px;
    align-items: center;
    ::v-deep {
      .el-input {
        width: 120px;
      }
    }
  }
}
</style>
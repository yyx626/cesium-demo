<template>
  <div class="dejavu3d-tree">
    <div class="dejavu3d-tree-tool">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        size="mini"
      >
      </el-input>
      <span class="tool-bar">
        <span>
          <i class="el-icon-document-add" title="加载"></i>
          <i class="el-icon-folder-opened" title="打开"></i>
          <i class="el-icon-circle-plus-outline" title="创建"></i>
          <i class="el-icon-upload" title="导出"></i>
        </span>
        <label title="设置当前为默认工程树状态">设为默认</label>
      </span>
    </div>
    <el-tree
      class="dejavu3d-tree-main"
      :data="treeData"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :default-checked-keys="checkedItems"
      @check="checkedChange"
      @node-contextmenu="rightClick"
      @node-click="handleNodeClick"
      ref="tree"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="tree-node-label" :class="iconNode(data)">{{
          node.label
        }}</span>
        <span class="custom-tree-node-tool">
          <i
            v-if="!data.children && data.type !== 'terrain-layer'"
            class="el-icon-s-promotion"
            title="跳转"
            @click="() => flyTo(data)"
          ></i>
          <i
            v-if="!data.children"
            class="el-icon-info"
            title="详情"
            @click="() => more(data)"
          ></i>
          <i
            class="el-icon-delete"
            title="删除"
            @click="() => remove(node, data)"
          ></i>
        </span>
      </span>
    </el-tree>
    <general-information
      class="general-information"
      v-if="generalInfo"
      :style="glStyle"
      :curretSelectNode="curretSelectNode"
    ></general-information>
  </div>
</template>
<script>
import GeneralInformation from "./GeneralInformation.vue";
export default {
  components: { GeneralInformation },
  props: ["projectTree"],
  computed: {
    treeData() {
      return this.projectTree.sourceData;
    },
    checkedKeys() {
      return this.$refs.tree.getCheckedKeys();
    },
    glStyle() {
      let left = this.$refs.tree.$el.clientWidth + 50;
      return "left: " + left + "px;";
    },
  },
  data() {
    return {
      filterText: "", //筛选条件
      checkedItems: [], //默认勾选
      treeClickCount: 0, //默认点击次数
      timer: undefined,
      generalInfo: false, //显示基本信息
      curretSelectNode: null, //当前选择的节点
    };
  },
  mounted() {
    this.initChecked(this.treeData);
    this.$nextTick(() => {
      this.$refs.tree.setCheckedKeys(this.checkedItems);
    });
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
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
    },
    checkedChange(node, data) {
      this.checkedItems = this.projectTree.checkedItems = data.checkedKeys;
      const checked = data.checkedKeys.indexOf(node.id) != -1;
      this.projectTree.setShow(node, checked);
    },
    iconNode(data) {
      return data.children ? "node-group" : "node-layer";
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      this.treeClickCount++;
      let timer = setTimeout(() => {
        if (this.treeClickCount == 1) {
          //单击事件
          console.log("单击事件,可在此处理对应逻辑", data, node);
        } else if (this.treeClickCount > 1) {
          //双击事件
          this.projectTree.flyTo(data);
        }
        this.treeClickCount = 0;
        clearTimeout(timer);
      }, 300);
    },
    flyTo(data) {
      this.projectTree.flyTo(data);
    },
    more(data) {
      this.curretSelectNode = data;
      this.generalInfo = true;
    },
    remove(node, data) {
      //这里需要弹出确认选择
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
      this.projectTree.remove(data);
    },
    rightClick(MouseEvent, object, Node, element) {
      console.log("右键事件：", MouseEvent, object, Node, element);
    },
  },
};
</script>
<style lang="scss" scoped>
$hoverColor: rgb(139, 139, 248);
$scrollbarColor: rgba(58, 58, 59, 0.7);
.dejavu3d-tree {
  background-color: rgba(1, 16, 36, 0.8);
  border-radius: 3px;
  .dejavu3d-tree-tool {
    margin: 5px 10px;
    .tool-bar {
      display: flex;
      color: white;
      font-size: 0.8rem;
      align-items: center;
      justify-content: space-between;
      margin-top: 5px;
      i {
        margin: 2px 5px;
        font-size: 1.2rem;
        &:hover {
          cursor: pointer;
          font-weight: bold;
          color: $hoverColor;
        }
      }
      label:hover {
        cursor: pointer;
        font-weight: bolder;
        color: $hoverColor;
      }
    }
  }
  .dejavu3d-tree-main {
    height: calc(100% - 75px);
    overflow: auto;
    background-color: transparent;
    padding: 0 5px;
    color: white;
    font-size: 0.9rem;
    .tree-node-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-left: 1.2rem;
      width: 120px;
      display: inline-block;
      text-align: left;
      line-height: 1rem;
    }
    .node-group {
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAYpJREFUOE+l0j1Iw0AUB/D/i9avQWwQB8FB6KUu4qjQwcXVj0XBuYgkVUEHhw6igwoODkJTQUQd1UXQTVB0U1w72AQpKE7m6mQRm5ykITYiNoI3HXf3fvfuvSP8c9A/41EBZN04ApAA0BkAb+QyBs059l7rEg/IGI8gLHCNHfuH5ayx6865ypLhgG4IrrFvz4ltGY28HlcA+r8BRDsO6tZe1e6Cu+4/4Qfw261R3TyQCJeWGtv/AUT1/BaBZv9Q2GdBYrqoKmdfGUBgBYRRRDDMp9hTLUTWjXEAS1xjvVUAOBaAWdRYOiyD1s2cXN/UYLl1CwI5OGKezyjnYUA0k58kCUmuKkNB4I23x1oxQXYYIGfNPRIib2ls/Qsg4NTS2EhYsPfxzGcie8xS47eBIjorPBVfDgPath/6JKd8yDWlJ9jGIwFqJ2Ff+wCBCnZL5EQqfaS5pizKmXsPJ2lACHFRTCkbVSBjdgkJCXLsiuptUKH5/eWw1NixYKViqz4gJLpz+189F5ZzyP4nUxyfEUyoDe8AAAAASUVORK5CYII=")
        no-repeat;
    }
    .node-layer {
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAihJREFUOE+lk81LlFEUxn/nvn6EhTAztjBo46hQVFTaKloIrQQhFKJsKHMxTTM7F/0VLaT0HR36MDSi0CEoglxmmxBpV+HMBFEUkY5BaZK898SdVyPD2nhX9/Kc85xznuceYZtHtpnPlgS7rhV211RrCpUUoCoMeWbtzsKl/Z/+LriJIOaXToK9qNAbBkpewQh6KnzKGFbvlTMt0xtEFYJottCvSkKgA5gDydWt1o5/GNj7w+F7Rj/WrQbLSeACcBh4gcpkOdN8VSLZ4nFRfV4pABMWL7eUbprZShsXi5IU9LzDDdJe6SDivzkkmASQAGkMu2CknG654fDY8HyfCmmQYyDvUJ0Ept0oIUG2cK7m+8rDz/VrP2NBfcqq9IlwFFhxIgI7QWdEuSVVNU93LHtfV2pXe8uZlpuhBn7BBb1HJC9W7i5m4rMR/+0JQ+BcsIIMLqSb5yLZ4gGwZ0TlLNBkAzoqBLHh+X0Y041qj8IRhGdi9fZipnUsFLnUA9qPaqfAS0SmsDa/mGl9LQ1+sc1q0GXEe1SpMlLqFGu7UXoQrQIJUBRhSo3JL6XiTzZy8MyDcIThwixC+4aF5XRzrmH0VaMG1d0Vd7y1vPtEUb+YBHV2toHM2kCv/P5I0aHCaTEkFLpCCzVnMDl3s9gkiEt0ik4g5v7S5fjjdes3Ox65XjqIsSkR+oC6dfQbKoOeJ+NfUvHCnxn/XaaoP59EJXB2/Wvptr2NvwAnhdv1VJa4QQAAAABJRU5ErkJggg==")
        no-repeat;
    }
    .custom-tree-node-tool {
      position: absolute;
      right: 0;
      margin-right: 5px;
      i {
        margin: 0 2px;
        &:hover {
          cursor: pointer;
          font-weight: bold;
          color: $hoverColor;
        }
      }
    }
    ::v-deep {
      .el-tree-node:focus > .el-tree-node__content {
        background-color: #66b0ffa9 !important;
      }
      .el-tree-node__content:hover {
        background-color: #66b0ff5e;
      }
    }
  }
  .general-information {
    background-color: aqua;
    position: absolute;
    top: 0;
  }
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: $scrollbarColor;
    background-clip: padding-box;
    border: 1px solid $scrollbarColor;
    border-radius: 7px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: $scrollbarColor;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  ::-webkit-scrollbar-track:hover {
    background-color: rgba(3, 26, 55, 0.8);
  }
}
</style>
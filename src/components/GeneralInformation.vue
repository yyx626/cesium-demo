<template>
  <div>
    <button @click="close">关闭</button>
    <label for="">{{ curretSelectNode.label }}</label>
  </div>
</template>
<script>
export default {
  props: ["curretSelectNode"],
  computed: {},
  data() {
    return {};
  },
  methods: {
    close() {
      this.$parent.generalInfo = false;
      this.$parent.curretSelectNode = null;
    },
  },
};
</script>
<template>
  <div id="app">
    <!-- <router-view /> -->
    <index></index>
  </div>
</template>
<script>
import Index from "./components/Index.vue";
export default {
  components: { Index },
}
</script>
<style
Index lang="scss">
#app{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  width: 100%;
  height: 100%;
}
</style>

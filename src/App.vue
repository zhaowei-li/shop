<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
  .el-breadcrumb {
    padding: 10px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
}
</style>

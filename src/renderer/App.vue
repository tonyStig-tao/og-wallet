<template>
  <body>
    <div id="drag" style="-webkit-app-region: drag">
    </div>
    <div id="app">
      <router-view></router-view>
    </div>
  </body>
</template>

<script>
  export default {
    name: 'OG-wallet'
  }
</script>

<style>
  /* CSS */
  #drag{
    position: absolute;
    height: 5%;
    width: 100%;
  }
</style>

<template>
  <div id="accountWrapper" v-if="isRouterAlive">
  <img id="logoSmall" src="~@/assets/logo.png" alt="electron-vue">
    <h1>here is import</h1>
    <div id="menu-icon">
      <div>account <el-button type="success" icon="el-icon-menu" @click="goIndex" circle></el-button></div>
    </div>
  </div>
</template>

<style>
</style>

<script>

export default {
  name: 'account-page',
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    goIndex () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
<template>
  <div id="accountWrapper" v-if="isRouterAlive">
    <img id="logoSmall" src="~@/assets/logo.png" alt="electron-vue">
    <main>
      <span class="title">
        account overview
      </span>
      <div id="menu-icon">
        <div>account <el-button type="success" icon="el-icon-menu" @click="goIndex" circle></el-button></div>
      </div>
    </main>
  </div>
</template>

<style>
  #accountWrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 40px 40px;
    width: 100vw;
  }

  #logoSmall {
    height: auto;
    margin-bottom: 20px;
    width: 320px;
  }

</style>

<script>
import sqlite from '../db/db.js'

var initPage = function () {
  sqlite.query('SELECT * FROM usr').then(function (data) {
    console.log(data)
  })
}
initPage()

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
    },
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
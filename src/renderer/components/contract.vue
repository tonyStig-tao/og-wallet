<template>
  <div id="accountWrapper" v-if="isRouterAlive">
    <img id="logoSmall" src="~@/assets/ann.png" alt="electron-vue">
    <p class="title alt" style="position:absolute;top:38%;left:45%">HERE IS EMPTY</p>
    <p class="title alt" style="position:absolute;top:41%;left:38%">PLEASE CREAT OR WATCH AN CONTRACT</p>
    <div id="accountButtonBIG">
      <el-button type="success" @click="goCreatAccount"  icon="el-icon-plus" round>creat contract</el-button>
      <el-button type="success" @click="goImportAccount" icon="el-icon-download" round style="margin-top: 10px">watch contract</el-button>
    </div>
    <div id="menu-icon">
        <div>contract <el-button type="success" icon="icon iconfont icon-jiaoyiguanli" @click="goIndex" circle></el-button></div>
      </div>
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

  #stepPage {
    padding: 1% 26%;
    width:100%;
  }

  #modeSelecter { 
    padding: 1% 26%;
    width:100%;
  }

  #success_container{
    width:100px;
    height:100px; 
    margin:0 auto;
  }

  #success_logo{
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-bottom: 20px;
  }

  #input {
    margin-bottom: 3px;
  }

  #icon {
    display: flex;
    flex-direction: column;
  }

  #qrcode{
    background-color: transparent;
  }
</style>

<script>
export default {
  name: 'contract-page',
  components: {
  },
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
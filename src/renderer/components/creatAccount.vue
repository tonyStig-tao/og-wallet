<template>
  <div id="accountWrapper" v-if="isRouterAlive">
    <img id="logoSmall" src="~@/assets/logo.png" alt="electron-vue">
    <el-steps :active="creat_page" align-center finish-status="success">
      <el-step title="creat account" description=""></el-step>
      <el-step title="account information" description=""></el-step>
      <el-step title="confirm recovery phrase" description=""></el-step>
    </el-steps>
    <div id="menu-icon">
      <el-button type="success" @click="goIndex" icon="el-icon-close" round>CANCEL</el-button>
      <el-button v-show="creat_page > 0" @click="back" type="success" icon="el-icon-back" round>BACK</el-button>
      <el-button type="success" @click="next" icon="el-icon-check" round>NEXT</el-button>
      <!-- <div>account <el-button type="success" icon="el-icon-menu" @click="goIndex" circle></el-button></div> -->
    </div>
    <div id="stepPage">
      <div id="step1" v-show="creat_page == 0">
        <p>account name</p>
        <el-input id="input" size="small" placeholder="a descriptive name for the account" style="background-color: transparent;"></el-input>
        <p>password hint</p>
        <el-input id="input" size="small" placeholder="(optional)a hint to help with remembering the password" style="background-color: transparent;"></el-input>
        <p>password </p>
        <el-input id="input" size="small" placeholder="a strong, unique password" style="background-color: transparent;"></el-input>
        <p>password(repeat) </p>
        <el-input id="input" size="small" placeholder="verify your password" style="background-color: transparent;"></el-input>
      </div>
      <div id="step2" v-show="creat_page == 1">
        here is 2
      </div>
      <div id="step3" v-show="creat_page == 2">
        here is 3
      </div>
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
    padding: 10px 150px;
  }

  #input {
    margin-bottom: 10px;
  }

  #icon {
    display: flex;
    flex-direction: column;
  }
</style>

<script>
import C from '../js/common.js'

C.creatAccount()

export default {
  name: 'account-page',
  data () {
    return {
      isRouterAlive: true,
      creat_page: 0
    }
  },
  methods: {
    next () {
      if (this.creat_page === 0) {
        this.creat_page += 1
      } else {
        this.creat_page += 1
      }
    },
    back () {
      this.creat_page -= 1
    },
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
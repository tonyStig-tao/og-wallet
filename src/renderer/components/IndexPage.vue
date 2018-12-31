<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/ann.png" alt="electron-vue">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
    <main v-if="isRouterAlive">
      <div id="networkStatusWords">
        <div class="title alt" v-if="netWork_GREEN">NETWORK STATUS: {{nowLinkTo}}
          <!-- <el-button type="text" size="medium">{{nowLinkTo}}</el-button> -->
        </div>
        <div class="title alt" v-if="netWork_RED">NETWORK STATUS: {{nowLinkTo}}</div>
      </div>
      <div id="networkStatus">
        <el-button type="success" icon="el-icon-check" circle @click="networkStatus" v-if="netWork_GREEN" size="mini"></el-button>
        <el-button type="danger" icon="el-icon-close" circle v-if="netWork_RED" size="mini"></el-button>
        <!-- <el-progress type="circle" :percentage="100" status="success" :width="12" v-if="netWork_GREEN"></el-progress> -->
        <!-- <el-progress type="circle" :percentage="100" status="exception" :width="12" v-if="netWork_RED"></el-progress> -->
      </div>
      <el-dialog
        title="NODE INFO"
        :visible.sync="dialogVisible"
        width="78%"
        :show-close="false">
        <span>{{network_status}}</span>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
          <el-button type="success" round @click="dialogVisible = false">ok</el-button>
        </span>
      </el-dialog>
      <div class="left-side">
        <span class="title">
          Welcome to Ola! An annchain.og wallet.
        </span>
        <!-- <system-information></system-information> -->
      </div>
      <div class="right-side">
        <div class="doc">
          <div class="title">Getting Started</div>
          <p>
            Ola 1.11 Beta is here: a faster, simple OG client. This huge update to OG allows you to create encrypted contracts and transactions on-chain. 
          </p>
          <el-button type="success" @click="goCreatAccount"  icon="el-icon-plus" round style="margin-top: 10px">creat account</el-button>
          <el-button type="success" @click="goImportAccount" icon="el-icon-download" round style="margin-top: 10px">Import account</el-button>
        </div>
        <div class="doc" style="margin-top: 15%">
          <div class="title alt">Other Documentation</div>
          <el-button type="success" icon="icon iconfont icon-web" plain @click="open('http://www.annchain.io/' )" style="margin-top: 10px"> website</el-button>
          <el-button type="success" icon="icon iconfont icon-github1" plain @click="open('https://github.com/annchain/OG')" style="margin-top: 10px"> github</el-button>
        </div>
      </div>
    </main>
    <div id="menu-icon">
      <div>index <el-button type="success" icon="icon iconfont icon-caidan1" @click="goAccount" circle></el-button></div>
    </div>
  </div>
</template>

<script>
  import SystemInformation from './IndexPage/SystemInformation'
  import C from '../js/common.js'
  import sqlite from '../db/db.js'
  import config from '../config/config.js'

  var initPage = function () {
    sqlite.createTable('CREATE TABLE  IF NOT EXISTS usr (account_name CHAR, account_hint CHAR, address CHAR PRIMARY KEY UNIQUE, pubKey CHAR UNIQUE, pubKey_raw CHAR UNIQUE, privKey CHAR UNIQUE, balance_OG DOUBLE DEFAULT (0))').then((data) => {
      console.log(data)
      return sqlite.createTable('CREATE TABLE  IF NOT EXISTS txHistory (txHash CHAR PRIMARY KEY UNIQUE, cStatus CHAR, cFrom CHAR, cTo CHAR, cAmount DOUBLE, ConfirmTime CHAR)')
    }).then((data) => {
      console.log(data)
      return sqlite.query('SELECT * FROM usr')
    }).then().catch((err) => {
      console.log('err=', err)
    })
  }

  export default {
    name: 'index-page',
    data () {
      return {
        isRouterAlive: true,
        netWork_RED: true,
        netWork_GREEN: false,
        nowLinkTo: '',
        network_status: {},
        dialogVisible: false
      }
    },
    created: function () {
      C.getNetInfo().then((data) => {
        console.log(data)
        this.network_status = data
        this.netWork_GREEN = true
        this.netWork_RED = false
        this.nowLinkTo = config.OG_RPC.HttpProvider
      }).then().catch((err) => {
        console.log(err)
        this.netWork_GREEN = false
        this.netWork_RED = true
      })
      initPage()
    },
    components: { SystemInformation },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      networkStatus () {
        this.dialogVisible = true
      },
      goAccount () {
        this.$router.push({ path: '/account' })
        // this.$router.push({ path: '/account', query: { id: s } })
      },
      goCreatAccount () {
        this.$router.push({ path: '/creatAccount' })
      },
      goImportAccount () {
        this.$router.push({ path: '/importAccount' })
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

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #networkStatus{
    position: absolute;
    top:5%;
    right:2%;
  }

  #networkStatusWords{
    position: absolute;
    top:5.3%;
    right:4.5%;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  #menu-icon {
    position: absolute;
    right: 30px;
    bottom: 30px;
    color: #2c3e51;
    font-weight: bold;
    font-family:"Arial";
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 5px;
  }

  .title.alt.small {
    font-size: 14px;
    margin-bottom: 5px;
    font-weight: normal;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: 0.8em;
    cursor: pointer;
    outline: none;
    padding: 0.8em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    /* background-color: #4fc08d; */
    transition: all 0.15s ease;
    box-sizing: border-box;
    /* border: 1px solid #4fc08d; */
    margin-bottom: 10px;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>

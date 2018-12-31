<template>
  <div id="accountWrapper" v-if="isRouterAlive">
    <img id="logoSmall" src="~@/assets/ann.png" alt="electron-vue">
    <!-- <img id="logoSmall" src="~@/assets/logo.png" alt="electron-vue"> -->
    <el-steps :active="creat_page" align-center finish-status="success">
      <el-step title="creat account" description=""></el-step>
      <el-step title="account information" description=""></el-step>
      <el-step title="confirm recovery phrase" description=""></el-step>
    </el-steps>
    <div id="menu-icon">
      <el-button v-show="creat_page<=2" type="danger" @click="goAccount" icon="el-icon-close" round>CANCEL</el-button>
      <el-button v-show="creat_page>0 & creat_page<2" @click="back" type="success" icon="el-icon-back" round>BACK</el-button>
      <el-button v-show="creat_page<2" type="success" @click="next" icon="el-icon-check" round>NEXT</el-button>
      <el-button v-show="creat_page==2" type="success" @click="next" icon="el-icon-check" round>CONFIRM</el-button>
      <el-button v-show="creat_page==3" type="success" @click="creat" icon="el-icon-check" round>CREAT</el-button>
      <!-- <div>account <el-button type="success" icon="el-icon-menu" @click="goIndex" circle></el-button></div> -->
    </div>
    <div id="stepPage">
      <div id="step1" v-show="creat_page == 0">
        <p class="title alt">account name</p>
        <el-input id="input" v-model="newAccount.account_name" size="small" placeholder="a descriptive name for the account" style="background-color: transparent;"></el-input>
        <p class="title alt">password hint</p>
        <el-input id="input" v-model="newAccount.account_hint" size="small" placeholder="(optional)a hint to help with remembering the password" style="background-color: transparent;"></el-input>
        <p class="title alt">password </p>
        <el-input id="input" v-model="newAccount.password" type="password" size="small" placeholder="a strong, unique password" style="background-color: transparent;"></el-input>
        <p class="title alt">password(repeat) </p>
        <el-input id="input" v-model="newAccount.password_repeat" type="password" size="small" placeholder="verify your password" style="background-color: transparent;"></el-input>
      </div>
      <div id="step2" v-show="creat_page == 1">
        <p class="title alt small">account</p>
        <vue-avatar :username="newAccount.account_name || tag"></vue-avatar>
        <p class="title alt">{{newAccount.account_name}}</p>
        <p class="title alt small">address</p>
        <p class="title alt">{{newAccountOBJ.address}}</p>
        <p class="title alt small">owner recovery phrase</p>
        <p class="title alt">{{newAccountOBJ.recoverPhrase}}</p>
      </div>
      <div id="step3" v-show="creat_page == 2">
        <p class="title alt small">address</p>
        <p class="title alt">{{newAccountOBJ.address}}</p>
        <p class="title alt small">owner recovery phrase</p>
        <el-input id="input" v-model="inputPhrase" size="small" placeholder="the account recovery phrase" style="background-color: transparent;"></el-input>
        <p class="title alt">Type your recovery phrase now.</p>
      </div>
      <div id="step4" v-show="creat_page == 3">
        <div id="success_container">
          <img id="success_logo" src="~@/assets/success.png">
        </div>
        <p class="title alt" style="text-align:center;margin-top: 20px;">{{newAccountOBJ.address}}</p>
        <p class="title alt" style="text-align:center;margin-top: 20px;">🎉CREAT ACCOUNT SUCCESS🎉</p>
        <!-- <canvas id="qrcode"></canvas> -->
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
    padding: 5% 26%;
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
import C from '../js/common.js'
import QRCode from 'qrcode'
import VueAvatar from '@lossendae/vue-avatar'

export default {
  name: 'account-page',
  components: {
    QRCode: QRCode,
    VueAvatar
  },
  data () {
    return {
      tag: 'a',
      isRouterAlive: true,
      creat_page: 0,
      newAccount: {
        account_name: '',
        account_hint: '',
        password: '',
        password_repeat: '',
        balance: 0
      },
      newAccountOBJ: '',
      inputPhrase: ''
    }
  },
  methods: {
    next () {
      if (this.creat_page === 0) {
        if (this.newAccount.account_name && this.newAccount.password && this.newAccount.password_repeat) {
          if (this.newAccount.password.length > 7) {
            if (this.newAccount.password === this.newAccount.password_repeat) {
              this.newAccountOBJ = C.creatAccount()
              this.newAccountOBJ.recoverPhrase = C.getRecoverPhrase(this.newAccountOBJ.privateKey)
              this.newAccountOBJ.privateKey = C.encryptPrivKey(this.newAccount.password, this.newAccountOBJ.privateKey)
              this.creat_page += 1
              console.log(this.creat_page)
            } else {
              this.$message({
                message: 'the supplied passwords does not match',
                type: 'error'
              })
            }
          } else {
            this.$message({
              message: 'the passwords length must be more than 7',
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: 'please check account name and password can not be null',
            type: 'error'
          })
        }
      } else if (this.creat_page === 2) {
        // if (this.inputPhrase === this.newAccountOBJ.recoverPhrase) {
        if (this.inputPhrase === '1') {
          this.$message({
            message: 'currect!',
            type: 'success'
          })
          this.creat_page += 1
        } else {
          this.$message({
            message: 'recovery phrase not match, please try again',
            type: 'error'
          })
        }
      } else if (this.creat_page === 3) {
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
    useqrcode (data) {
      var canvas = document.getElementById('qrcode')
      QRCode.toCanvas(canvas, data, function (error) {
        if (error) console.error(error)
        console.log('QRCode success!')
      })
    },
    goAccount () {
      this.$router.push({ path: '/account' })
    },
    checkPhrase (data) {
      if (this.newAccountOBJ.recoverPhrase === data) {

      } else {

      }
    },
    creat () {
      C.accountStorage(this.newAccount, this.newAccountOBJ)
      this.$router.push({ path: '/account' })
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
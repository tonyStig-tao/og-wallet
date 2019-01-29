<template>
  <div id="accountWrapper" v-if="isRouterAlive">
    <img id="logoSmall" src="~@/assets/ann.png" alt="electron-vue">
    <!-- <img id="logoSmall" src="~@/assets/logo.png" alt="electron-vue"> -->
    <el-steps :active="import_page" align-center finish-status="success">
      <el-step title="import account" description=""></el-step>
      <el-step title="account information" description=""></el-step>
      <el-step title="confirm recovery phrase" description=""></el-step>
    </el-steps>
    <div id="menu-icon">
      <el-button v-show="import_page<=2" type="danger" @click="goAccount" icon="el-icon-close" round>CANCEL</el-button>
      <el-button v-show="import_page>0 & import_page<2" @click="back" type="success" icon="el-icon-back" round>BACK</el-button>
      <el-button v-show="import_page<2" type="success" @click="next" icon="el-icon-check" round>NEXT</el-button>
      <el-button v-show="import_page==2" :disabled="confirmDisabled" type="success" @click="next" icon="el-icon-check" round>CONFIRM</el-button>
      <el-button v-show="import_page==3" type="success" @click="creat" icon="el-icon-check" round>CREAT</el-button>
      <!-- <div>account <el-button type="success" icon="el-icon-menu" @click="goIndex" circle></el-button></div> -->
    </div>
    <div id="modeSelecter" v-show="import_page == 0">
      <template>
        <el-radio v-model="importMode" label="1" border>USE PRIVATE KEY RECOVER</el-radio>
        <el-radio v-model="importMode" label="2" border>USE RECOVERY PHARSE</el-radio>
      </template>
    </div>
    <div id="stepPage">
      <div id="step1" v-show="import_page == 0">
        <p class="title alt" v-show="importMode == '1'">private key</p>
        <el-input v-show="importMode == '1'" id="input" v-model="ImpAccount.privateKey" size="small" placeholder="the raw hex encoded private key" style="background-color: transparent;"></el-input>
        <p class="title alt" v-show="importMode == '2'">recovery phrase</p>
        <el-input v-show="importMode == '2'" id="input" v-model="ImpAccount.recoveryPhrase" size="small" placeholder="the account recovery phrase" style="background-color: transparent;"></el-input>
        <p class="title alt">account name</p>
        <el-input id="input" v-model="ImpAccount.account_name" size="small" placeholder="a descriptive name for the account" style="background-color: transparent;"></el-input>
        <p class="title alt">password hint</p>
        <el-input id="input" v-model="ImpAccount.account_hint" size="small" placeholder="(optional)a hint to help with remembering the password" style="background-color: transparent;"></el-input>
        <p class="title alt">password </p>
        <el-input id="input" v-model="ImpAccount.password" size="small" placeholder="a strong, unique password" type="password" style="background-color: transparent;"></el-input>
        <p class="title alt">password(repeat) </p>
        <el-input id="input" v-model="ImpAccount.password_repeat" size="small" placeholder="verify your password" type="password" style="background-color: transparent;"></el-input>
      </div>
      <div id="step2" v-show="import_page == 1">
        <p class="title alt small">account</p>
        <vue-avatar :username="ImpAccount.account_name"></vue-avatar>
        <p class="title alt">{{ImpAccount.account_name}}</p>
        <p class="title alt small">address</p>
        <p class="title alt">{{restoreAccountOBJ.address}}</p>
        <p class="title alt small" v-show="importMode == '1'">owner recovery phrase</p>
        <!-- <p class="title alt" v-show="importMode == '1'">{{restoreAccountOBJ.recoverPhrase}}</p> -->
        <div>
          <el-button :key="phrase" v-for="phrase in phraseArr" type="success" round size="small" style="margin-top: 4px;margin-left: 10px;">{{ phrase }}</el-button>
        </div>
        <p class="title alt small" v-show="importMode == '1'"> Please back up the recovery phrase now. Make sure to keep it private and secure, it allows full and unlimited access to the account. </p>
      </div>
      <div id="step3" v-show="import_page == 2">
        <!-- <p class="title alt small">address</p> -->
        <!-- <p class="title alt">{{restoreAccountOBJ.address}}</p> -->
        <!-- <p class="title alt small">owner recovery phrase</p> -->
        <!-- <el-input id="input" v-model="inputPhrase" size="small" placeholder="the account recovery phrase" style="background-color: transparent;"></el-input> -->
        <!-- <p class="title alt">Type your recovery phrase now.</p> -->
        <p class="title alt">Please confirm your wallet recovery phrase.</p>
        <p class="title alt small">owner recovery phrase</p>
        <el-card id="box-card-phrase" shadow="never">
          <div id="inputPhrase">
            <el-button :key="inputPhrase" v-for="inputPhrase in ownerTypeInPhrase" @click="resetPhrase(inputPhrase)" type="success" round size="small" style="margin-top: 4px;margin-left: 10px;">{{ inputPhrase }}</el-button>
          </div>
        </el-card>
        <p class="title alt small" style="margin-top: 10px;">Please click recovery phrase in order and make sure your backup is correct</p>
        <div id="randomPhrase">
          <el-button :key="phrase" v-for="phrase in phraseArr" @click="setPhrase(phrase)" type="warning" round size="small" style="margin-top: 4px;margin-left: 10px;">{{ phrase }}</el-button>
        </div>
      </div>
      <div id="step4" v-show="import_page == 3">
        <div id="success_container">
          <img id="success_logo" src="~@/assets/success.png">
        </div>
        <p class="title alt" style="text-align:center;margin-top: 20px;">{{restoreAccountOBJ.address}}</p>
        <p class="title alt" style="text-align:center;margin-top: 20px;">🎉IMPORT ACCOUNT SUCCESS🎉</p>
        <!-- <canvas id="qrcode"></canvas> -->
      </div>
    </div>
  </div>
</template>

<style>
  #accountWrapper {
    /* background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      ); */
    background-image: url("~@/assets/background.png"); 
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
      isRouterAlive: true,
      import_page: 0,
      ImpAccount: {
        privateKey: '',
        account_name: '',
        account_hint: '',
        password: '',
        password_repeat: '',
        balance: 0
      },
      restoreAccountOBJ: '',
      inputPhrase: '',
      importMode: '1',
      phraseArr: [],
      ownerTypeInPhrase: [],
      confirmDisabled: true
    }
  },
  methods: {
    next () {
      if (this.import_page === 0) {
        console.log(this.ImpAccount)
        if (this.ImpAccount.password === this.ImpAccount.password_repeat) {
          if (this.ImpAccount.password.length > 7) {
            if (this.importMode === '1') { // use private key recover
              this.restoreAccountOBJ = C.recoveryAccount(this.ImpAccount.privateKey)
              this.restoreAccountOBJ.recoverPhrase = C.getRecoverPhrase(this.ImpAccount.privateKey)
              this.restoreAccountOBJ.recoverPhraseArr = this.restoreAccountOBJ.recoverPhrase.split(' ')
              this.phraseArr = this.restoreAccountOBJ.recoverPhraseArr
              console.log(this.phraseArr)
              this.restoreAccountOBJ.privateKey = C.encryptPrivKey(this.ImpAccount.password, this.restoreAccountOBJ.privateKey)
              console.log(this.restoreAccountOBJ)
            } else if (this.importMode === '2') { // use recovery phrase recover
              console.log('asd', this.importMode, this.ImpAccount.recoveryPhrase)
              this.ImpAccount.privateKey = C.recoverPrivate(this.ImpAccount.recoveryPhrase)
              this.restoreAccountOBJ = C.recoveryAccount(this.ImpAccount.privateKey)
              this.restoreAccountOBJ.privateKey = C.encryptPrivKey(this.ImpAccount.password, this.restoreAccountOBJ.privateKey)
              console.log(this.restoreAccountOBJ)
            }
            this.import_page += 1
          } else {
            this.$message({
              message: 'the passwords length must be more than 7',
              type: 'error'
            })
          }
        } else {
          console.log('the supplied passwords does not match')
          this.$message({
            message: 'the supplied passwords does not match',
            type: 'error'
          })
        }
      } else if (this.import_page === 1) {
        if (this.importMode === '1') {
          this.phraseRandArr = C.randArr(this.phraseArr)
          this.import_page += 1
        } else {
          this.import_page += 2
        }
      } else if (this.import_page === 2) {
        var ownerTypeInPhrase = this.ownerTypeInPhrase.toString().replace(/,/g, ' ')
        console.log(ownerTypeInPhrase)
        console.log(this.restoreAccountOBJ.recoverPhrase)
        if (ownerTypeInPhrase === this.restoreAccountOBJ.recoverPhrase) {
        // if (this.inputPhrase === '1') {
          this.$message({
            message: 'currect!',
            type: 'success'
          })
          this.import_page += 1
        } else {
          this.resetAllPhrase()
          this.$message({
            message: 'recovery phrase not match, please try again',
            type: 'error'
          })
        }
      } else if (this.import_page === 3) {
        this.import_page += 1
      } else {
        this.import_page += 1
      }
    },
    back () {
      this.import_page -= 1
    },
    goIndex () {
      this.$router.push({ path: '/' })
    },
    goAccount () {
      this.$router.push({ path: '/account' })
    },
    setPhrase (phrase) {
      var indexOfPhrase = this.phraseArr.indexOf(phrase)
      this.phraseArr.splice(indexOfPhrase, 1)
      this.ownerTypeInPhrase.push(phrase)
      if (this.ownerTypeInPhrase.length === 24) {
        this.confirmDisabled = false
      }
      console.log(this.ownerTypeInPhrase.toString())
      // this.ownerTypeInPhrase = this.ownerTypeInPhrase.toString().replace(/,/g, ' ')
      // console.log(this.ownerTypeInPhrase)
    },
    resetPhrase (phrase) {
      var indexOfPhrase = this.ownerTypeInPhrase.indexOf(phrase)
      this.ownerTypeInPhrase.splice(indexOfPhrase, 1)
      this.phraseArr.push(phrase)
    },
    resetAllPhrase () {
      this.phraseArr = this.ownerTypeInPhrase
      this.ownerTypeInPhrase = []
      console.log(this.phraseArr)
      this.confirmDisabled = true
    },
    useqrcode (data) {
      var canvas = document.getElementById('qrcode')
      QRCode.toCanvas(canvas, data, function (error) {
        if (error) console.error(error)
        console.log('QRCode success!')
      })
    },
    checkPhrase (data) {
      if (this.restoreAccountOBJ.recoverPhrase === data) {

      } else {

      }
    },
    creat () {
      C.accountStorage(this.ImpAccount, this.restoreAccountOBJ)
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
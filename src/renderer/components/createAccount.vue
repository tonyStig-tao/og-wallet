<template>
  <div id="accountWrapper" v-if="isRouterAlive" v-loading="stepPageLoading" element-loading-text="CREATING...">
    <img id="logoSmall" src="~@/assets/ann.png" alt="electron-vue">
    <!-- <img id="logoSmall" src="~@/assets/logo.png" alt="electron-vue"> -->
    <el-steps :active="create_page" align-center finish-status="success">
      <el-step title="create account" description=""></el-step>
      <el-step title="account information" description=""></el-step>
      <el-step title="confirm recovery phrase" description=""></el-step>
    </el-steps>
    <div id="menu-icon">
      <el-button v-show="create_page<=2" type="danger" @click="goAccount" icon="el-icon-close" round>CANCEL</el-button>
      <el-button v-show="create_page>0 & create_page<2" @click="back" type="success" icon="el-icon-back" round>BACK</el-button>
      <el-button v-show="create_page==0 & showLoading" type="success" :loading="true" round>Creating...</el-button>
      <el-button v-show="create_page==0 & !showLoading" type="success" @click="next" icon="el-icon-check" round>NEXT</el-button>
      <el-button v-show="create_page==2 & !showLoading" type="success" @click="next" icon="el-icon-check" round>NEXT</el-button>
      <el-button v-show="create_page==1" type="success" @click="dialogVisible=true" icon="el-icon-check" round>NEXT</el-button>
      <el-button v-show="create_page==2" :disabled="confirmDisabled" type="success" @click="next" icon="el-icon-check" round>CONFIRM</el-button>
      <el-button v-show="create_page==3" type="success" @click="create" icon="el-icon-check" round>CREATE</el-button>
      <!-- <div>account <el-button type="success" icon="el-icon-menu" @click="goIndex" circle></el-button></div> -->
    </div>
    <el-dialog
      title="NOTICE"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close=false
      :before-close="handleClose">
      <span>Are you sure you have back up the recovery phrase safely?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" round>NO</el-button>
        <el-button type="success" @click="next" round>YES</el-button>
      </span>
    </el-dialog>
    <div id="stepPage">
      <div id="step1" v-show="create_page == 0" >
        <p class="title alt">account name</p>
        <el-input id="input" v-model="newAccount.account_name" size="small" placeholder="a descriptive name for the account" style="background-color: transparent;" :autofocus=true :clearable=true></el-input>
        <p class="title alt">password hint</p>
        <el-input id="input" v-model="newAccount.account_hint" size="small" placeholder="(optional)a hint to help with remembering the password" style="background-color: transparent;" :clearable=true></el-input>
        <p class="title alt">password </p>
        <el-input id="input" v-model="newAccount.password" type="password" size="small" placeholder="a strong, unique password" style="background-color: transparent;" :clearable=true></el-input>
        <p class="title alt">password(repeat) </p>
        <el-input id="input" v-model="newAccount.password_repeat" type="password" size="small" placeholder="verify your password" style="background-color: transparent;" :clearable=true></el-input>
      </div>
      <div id="step2" v-show="create_page == 1">
        <p class="title alt small">account</p>
        <vue-avatar :username="newAccount.account_name || tag"></vue-avatar>
        <p class="title alt">{{newAccount.account_name}}</p>
        <p class="title alt small">address</p>
        <p class="title alt">{{newAccountOBJ.address}}</p>
        <p class="title alt small">owner recovery phrase</p>
        <!-- <p class="title alt">{{newAccountOBJ.recoverPhrase}}</p> -->
        <div>
          <el-button :key="phrase" v-for="phrase in phraseArr" type="success" round size="small" style="margin-top: 4px;margin-left: 10px;">{{ phrase }}</el-button>
        </div>
        <p class="title alt small" style="margin-top: 5px;"> Please back up the recovery phrase now. Make sure to keep it private and secure, it allows full and unlimited access to the account. </p>
      </div>
      <div id="step3" v-show="create_page == 2">
        <!-- <p class="title alt small">address</p> -->
        <!-- <p class="title alt">{{newAccountOBJ.address}}</p> -->
        <!-- <el-input id="input" native-type="reset" @click="next" v-model="inputPhrase" size="small" placeholder="the account recovery phrase" style="background-color: transparent;"></el-input> -->
        <p class="title alt">Please confirm your wallet recovery phrase.</p>
        <p class="title alt small">owner recovery phrase</p>
        <el-card id="box-card-phrase" shadow="never">
          <div id="inputPhrase">
            <el-button :key="inputPhrase" v-for="inputPhrase in ownerTypeInPhrase" @click="resetPhrase(inputPhrase)" type="success" round size="small" style="margin-top: 4px;margin-left: 10px;">{{ inputPhrase }}</el-button>
          </div>
        </el-card>
        <div id="selectArea">
          <p class="title alt small" style="margin-top: 10px;">Please click recovery phrase in order and make sure your backup is correct</p>
          <div id="randomPhrase">
            <el-button :key="phrase" v-for="phrase in phraseArr" @click="setPhrase(phrase)" type="warning" round size="small" style="margin-top: 4px;margin-left: 10px;">{{ phrase }}</el-button>
          </div>
        </div>
      </div>
      <div id="step4" v-show="create_page == 3">
        <div id="success_container">
          <img id="success_logo" src="~@/assets/success.png">
        </div>
        <p class="title alt" style="text-align:center;margin-top: 20px;">{{newAccountOBJ.address}}</p>
        <p class="title alt" style="text-align:center;margin-top: 20px;">🎉CREATE ACCOUNT SUCCESS🎉</p>
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
    width: 100%;
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

  #box-card-phrase{
    width: 100%;
    height: 184px auto;
    background-color: #d6d6d6
  }

  #selectArea{
    /* position: absolute; */
    margin-top: 5%;
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
      create_page: 0,
      newAccount: {
        account_name: '',
        account_hint: '',
        password: '',
        password_repeat: '',
        balance: 0
      },
      newAccountOBJ: '',
      inputPhrase: '',
      phraseRandArr: [],
      phraseArr: [],
      ownerTypeInPhrase: [],
      confirmDisabled: true,
      showLoading: false,
      showConfirm: false,
      dialogVisible: false,
      stepPageLoading: false
    }
  },
  methods: {
    next () {
      if (this.create_page === 0) {
        if (this.newAccount.account_name && this.newAccount.password && this.newAccount.password_repeat) {
          if (this.newAccount.password.length > 7) {
            if (this.newAccount.password === this.newAccount.password_repeat) {
              this.newAccountOBJ = C.createAccount()
              this.newAccountOBJ.recoverPhrase = C.getRecoverPhrase(this.newAccountOBJ.privateKey)
              this.newAccountOBJ.recoverPhraseArr = this.newAccountOBJ.recoverPhrase.split(' ')
              this.phraseArr = this.newAccountOBJ.recoverPhraseArr
              console.log(this.phraseArr)
              this.newAccountOBJ.privateKey = C.encryptPrivKey(this.newAccount.password, this.newAccountOBJ.privateKey)
              this.showLoading = true
              this.stepPageLoading = true
              setTimeout(() => {
                this.create_page += 1
                this.stepPageLoading = false
                this.$alert('If someone gets your Recover Phrase they will get your assets directly! Please write down your Recover Phrase and keep it safe.', 'Please do not take a screenshot', {
                  confirmButtonText: 'I know',
                  type: 'warning',
                  showClose: false,
                  roundButton: true
                })
              }, 1300)
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
      } else if (this.create_page === 1) {
        this.create_page += 1
        this.dialogVisible = false
        this.phraseRandArr = C.randArr(this.phraseArr)
        console.log(this.phraseRandArr)
      } else if (this.create_page === 2) {
        var ownerTypeInPhrase = this.ownerTypeInPhrase.toString().replace(/,/g, ' ')
        console.log(ownerTypeInPhrase)
        // console.log('here', this.newAccountOBJ.recoverPhraseArr)
        if (ownerTypeInPhrase === this.newAccountOBJ.recoverPhrase) {
        // if (this.inputPhrase === '1') {
          this.$message({
            message: 'currect!',
            type: 'success'
          })
          this.create_page += 1
        } else {
          this.resetAllPhrase()
          this.$message({
            message: 'recovery phrase not match, please try again',
            type: 'error'
          })
        }
      } else if (this.create_page === 3) {
      } else {
        this.create_page += 1
      }
    },
    back () {
      this.showLoading = false
      this.create_page -= 1
    },
    goIndex () {
      this.$router.push({ path: '/' })
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
    goAccount () {
      this.$router.push({ path: '/account' })
    },
    create () {
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
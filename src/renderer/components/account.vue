<template>
  <div id="accountWrapper" v-if="isRouterAlive">
    <!-- <img id="logoSmall" src="~@/assets/logo.png" alt="electron-vue"> -->
    <img id="logoSmall" src="~@/assets/ann.png" alt="electron-vue">
      <transition name="el-fade-in-linear">
      <div id="accountButton" v-if="accountInfoShow">
        <el-button  type="success" @click="goTransaction(accountSelect)" icon="icon iconfont icon-business" round size="small"> TRANSACTION</el-button>
        <el-button  type="success" @click="useqrcode(accountSelect.address)" icon="icon iconfont icon-erweima" round size="small"> QRCODE</el-button>
        <el-button  type="success" @click="goEdit(accountSelect)" icon="icon iconfont icon-tubiao09" round size="small"> EDIT</el-button>
        <el-button  type="success" @click="goPassword" icon="icon iconfont icon-mima" round size="small"> PASSWORD</el-button>
        <!-- <el-button  type="warning" @click="goExport" icon="icon iconfont icon-icon-1" round size="small"> EXPORT</el-button> -->
        <el-popover placement="bottom" width="500" v-model="visible" style="margin-left: 10px;">
          <p style="color:#374b60;margin-top: 10px;">Export your account as a PDF file. Please enter the password linked with this account.</p>
          <p style="color:#374b60;margin-top: 10px;">Account password</p>
          <el-input v-model="exportData.password" placeholder="the password specified when creating this account" type="password"></el-input>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false" style="color:#374b60;margin-top: 10px;" icon="el-icon-close">Cancel</el-button>
            <el-button type="success" size="mini" @click="exportAccount" icon="el-icon-check">Export</el-button>
          </div>
          <el-button type="warning" icon="icon iconfont icon-icon-1" round size="small" slot="reference"> EXPORT</el-button>
        </el-popover>
        <el-popover placement="bottom" width="160" v-model="visible2" style="margin-left: 10px;">
          <p>Are you sure you want to permanently delete this account?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible2 = false" style="color:#374b60">no</el-button>
            <el-button type="danger" size="mini" @click="deleteAccount(accountSelect)">yes</el-button>
          </div>
          <el-button type="danger" icon="icon iconfont icon-shanchu" round size="small" slot="reference"> DELETE</el-button>
        </el-popover>
      </div>
      </transition>
      <div id="accountButton">
        <el-button v-if="cardShow" type="success" @click="goCreatAccount"  icon="el-icon-plus" round>creat account</el-button>
        <el-button v-if="cardShow" type="success" @click="goImportAccount" icon="el-icon-download" round style="margin-top: 10px">Import account</el-button>
      </div>
    <main>
      <el-card  v-if="cardShow" id="box-card" :key="account.account_name" v-for="account in accountList" shadow="hover" @click="accountInfo(account)">
        <div slot="header" class="clearfix">
          <span  class="title alt">{{ account.account_name }}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="accountInfo(account)">Info</el-button>
        </div>
        <div class="title alt inCard">
          {{ account.address }}
        </div>
        <div class="title alt">
          balance : {{ account.balance_OG }} OG
        </div>
      </el-card>
    </main>
      <transition name="el-fade-in-linear">
      <div v-if="accountInfoShow" style="margin-top: 80px;">
        <div class="Info-card">
          <div slot="header" class="clearfix">
            <vue-avatar :username="accountSelect.account_name"></vue-avatar>
            <span class="title alt" style="margin-left: 10px;">{{ accountSelect.account_name }}</span>
          </div>
          <div class="title alt inCard" style="margin-top: 10px;">
            {{accountSelect.address}}
          </div>
          <el-button  type="success" icon="icon iconfont icon-qian2" round size="middle" disabled plain style="margin-top: 10px;"> BALANCE: {{balance}}</el-button>
          <div >
            <canvas id="qrcode" style="margin-top: 10px;"></canvas>
          </div>
        </div>
        <div id="txTable">
          <el-table :data="transactionData" height="100%">
            <el-table-column fixed prop="txHash" label="TRANCACTIONS" width="220">
            </el-table-column>
            <el-table-column prop="cStatus" label="STATUS" width="75">
              <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.cStatus }}</el-tag>
                  </div>
              </template>
            </el-table-column>
            <el-table-column prop="cFrom" label="FROM" width="215">
            </el-table-column>
            <el-table-column prop="cTo" label="TO" width="215">
            </el-table-column>
            <el-table-column prop="ConfirmTime" label="TIMESTAMP" width="120">
            </el-table-column>
            <el-table-column prop="cAmount" label="AMOUNT (OG)" width="79">
            </el-table-column>
          </el-table>
        </div>
      </div>
      </transition>
      <div id="transactionForm">
        <!-- Form -->
        <el-dialog title="TRANSFER DETAILS" :visible.sync="transactionFromShow" :width="widthP">
          <el-form>
            <el-form-item label="type of token transfer" >
              <el-select v-model="selectValue">
                <el-option v-for="item in coin_options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="recipient address" >
              <el-input v-model="tx.to" placeholder="the recipient address"></el-input>
            </el-form-item>
            <el-form-item label="amount to transfer(in">{{selectValue}})
              <el-input v-model="tx.amount" placeholder="the recipient address"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="transactionFromShow = false;tx = {amount:0.0}" icon="el-icon-close" plain> Cancel</el-button>
            <el-button type="success" @click="toEnterPass" icon="el-icon-check"> Send</el-button>
          </div>
          <el-dialog width="60%" title="SIGNER" :visible.sync="enterPassShow" append-to-body>
            <div class="title alt inCard" style="margin-top: 10px;">
              {{accountSelect.address}}
            </div>
            <div class="title alt inCard" style="margin-top: 10px;margin-left: 50px;">
              will transfer   {{tx.amount}}{{selectValue}}   to
            </div>
            <div class="title alt inCard" style="margin-top: 10px;">
              {{tx.to}}
            </div>
            <div class="title alt small" style="margin-top: 10px;">
              enter account password
            </div>
            <el-input v-model="tx.password" placeholder="the account password" type="password"></el-input>
            <el-button id="signer-button-cancel" type="danger" @click="enterPassShow=false" icon="el-icon-close" plain style="margin-top: 20px;"> Cancel</el-button>
            <el-button id="signer-button-confirm" type="success" @click="sinerConfirm(tx)" icon="el-icon-check" style="margin-top: 20px;"> Confirm Requst</el-button>
          </el-dialog>
        </el-dialog>
      </div>
      <div id="editForm">
        <!-- Form -->
        <el-dialog title="EDIT METADATA" :visible.sync="editFromShow" :width="widthP">
          <el-form>
            <el-form-item label="account name" >
              <el-input v-model="editData.name" placeholder="the account name you want to change"></el-input>
            </el-form-item>
            <el-form-item label="(optional) password hint">
              <el-input v-model="editData.hint" placeholder="a hint to allow password recovery"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="editFromShow = false" icon="el-icon-close" plain> Cancel</el-button>
            <el-button type="success" @click="editAccount(editData)" icon="el-icon-check"> Save</el-button>
          </div>
        </el-dialog>
      </div>
      <div id="passwordForm">
        <!-- Form -->
        <el-dialog title="PASSWORD MANAGER" :visible.sync="passwordFromShow" :width="widthP">
            <vue-avatar :username="accountSelect.account_name"></vue-avatar>
            <span class="title alt" style="margin-left: 10px;">{{ accountSelect.account_name }}</span>
            <div class="title alt inCard" style="margin-top: 10px;">{{ accountSelect.address }}</div>

            <el-menu :default-active="activeIndex" background-color="#f0f9eb" active-text-color="#68c13a" class="el-menu-demo" mode="horizontal">
              <el-menu-item @click="testPasswordShow=true;changePasswordShow=false" index="1">TEST PASSWORD</el-menu-item>
              <el-menu-item @click="changePasswordShow=true;testPasswordShow=false" index="2" disabled><a>CHANGE PASSWORD</a></el-menu-item>
            </el-menu>

            <div v-if="testPasswordShow">
              <div class="title alt small" style="margin-top: 10px;">password</div>
              <el-input v-model="password.testPassword" placeholder="your account password" style="margin-top: 5px;" type="password"></el-input>
            </div>
            <div v-if="changePasswordShow">
              <div class="title alt small" style="margin-top: 10px;"> current password</div>
              <el-input v-model="password.currentPassword" placeholder="your account password" style="margin-top: 5px;" type="password"></el-input>
              <div class="title alt small" style="margin-top: 10px;">(optional) new password hint</div>
              <el-input v-model="password.newPasswordHint" placeholder="hint for thr new password" style="margin-top: 5px;" type="password"></el-input>
              <div class="title alt small" style="margin-top: 10px;">new password</div>
              <el-input v-model="password.newPassword" placeholder="the new password for this account" style="margin-top: 5px;" type="password"></el-input>
              <div class="title alt small" style="margin-top: 10px;">repeat new password</div>
              <el-input  placeholder="the new password for this account" style="margin-top: 5px;" type="password"></el-input>
            </div>

          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="passwordFromShow = false" icon="el-icon-close" plain> Cancel</el-button>
            <el-button v-if="testPasswordShow" type="success" @click="testPassword" icon="el-icon-check"> Test</el-button>
            <el-button v-if="changePasswordShow" type="success" @click="changePassword" icon="el-icon-check"> Change</el-button>
          </div>
        </el-dialog>
      </div>
      <div id="menu-icon" v-if="accountInfoShow">
        <div>back <el-button type="success" icon="icon iconfont icon-icon-" @click="goBack" circle></el-button></div>
      </div>
      <div id="menu-icon" v-if="!accountInfoShow">
        <div>account <el-button type="success" icon="icon iconfont icon-jiaoyijilu" @click="goIndex" circle></el-button></div>
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

  #back-icon{
    position: absolute;
    left: 30px;
    bottom: 30px;
    color: #2c3e51;
    font-weight: bold;
    font-family:"Arial";
  }

  #accountButton{
    position: absolute;
    right: 40px;
  }

  #logoSmall {
    height: auto;
    margin-bottom: 20px;
    width: 320px;
  }

  #box-card{
    width: 284.67px;
    height: 165px;
    margin-top: 65px;
    margin-left: 10px;
    background-color: #f0f9eb;
    /* margin-right: 5px; */
  }

  #Info-card{
    width: 80px;
    background-color: transparent;
  }

  #accountButton{
    margin-left: 200px;
  }

  #signer-button-cancel{
    /* position: absolute; */
    right: 30px;
    bottom: 30px;
  }

  #signer-button-confirm{
    position: absolute;
    right: 30px;
    bottom: 30px;
  }

  #txTable{
    position: absolute;
    right: 40px;
    top: 220px;
    width: 66%;
    height: 51%;
    margin-left:10px;
    overflow-y:scroll;
    overflow-x:scroll;
  }

  .title.alt.inCard{
    word-wrap:break-word;
    word-break:break-all;
  }

</style>

<script>
import C from '../js/common.js'
import sqlite from '../db/db.js'
import QRCode from 'qrcode'
import VueAvatar from '@lossendae/vue-avatar'
import OG from 'og-sdk'
import config from '../config/config.js'

var og = new OG()

og.setProvider(
  new OG.providers.HttpProvider(config.OG_RPC.HttpProvider)
)

export default {
  name: 'account-page',
  components: {
    QRCode: QRCode,
    VueAvatar
  },
  data () {
    return {
      isRouterAlive: true,
      accountList: [],
      cardShow: true,
      accountInfoShow: false,
      accountSelect: {},
      balance: 0,
      activeIndex: '',
      visible2: false,
      transactionFromShow: false,
      editFromShow: false,
      passwordFromShow: false,
      formLabelWidth: '150px',
      handleSelect: '',
      widthP: '80%',
      coin_options: [{
        value: 'OG',
        label: 'OG'
      }],
      selectValue: 'OG',
      enterPassShow: false,
      tx: {
        amount: 0.0
      },
      editData: {},
      testPasswordShow: true,
      changePasswordShow: false,
      password: {},
      visible: false,
      exportData: {},
      transactionData: [],
      now_address: ''
    }
  },
  created: function () {
    sqlite.query('SELECT * FROM usr').then((data) => {
      this.accountList = data.data
      console.log(this.accountList)
    })
  },
  methods: {
    goIndex () {
      this.$router.push({ path: '/' })
    },
    goCreatAccount () {
      this.$router.push({ path: '/creatAccount' })
    },
    goAccount () {
      this.$router.push({ path: '/account' })
    },
    goTransaction (account) {
      this.transactionFromShow = true
    },
    accountInfo (accountData) {
      this.cardShow = false
      this.accountInfoShow = true
      this.accountSelect = accountData
      console.log(this.accountSelect)
      var sql = 'SELECT * from txHistory where cFrom == "' + this.accountSelect.address + '"'
      sqlite.query(sql).then((data) => {
        console.log('accountInfo here', data)
        this.transactionData = data.data
        return C.getBalance(this.accountSelect.address)
      }).then((data) => {
        this.balance = data.balance
        var sql = 'UPDATE usr SET balance_OG = ' + this.balance + ' where address = ' + '"' + this.accountSelect.address + '"'
        console.log(sql)
        return sqlite.execute(sql)
      }).then().catch(function (err) {
        console.log('accountInfo err:', err)
      })
    },
    sinerConfirm (tx) {
      console.log('tx', tx)
      console.log('accountSelect', this.accountSelect)
      console.log(tx.password, this.accountSelect.privKey)
      if (tx.password.length < 7) {
        this.$message({
          message: 'the passwords length must be more than 7',
          type: 'error'
        })
      }
      var decPri = C.decryptPrivKey(tx.password, this.accountSelect.privKey)
      console.log(decPri)
      if (decPri === '') {
        console.log('err')
        this.$message({
          message: 'WRONG PASSWORD',
          type: 'error'
        })
      } else {
        console.log('in here')
        console.log('accountSelect.address', this.accountSelect.address)
        tx.from = this.accountSelect.address
        tx.pubKey = this.accountSelect.pubKey
        tx.pubKey_raw = this.accountSelect.pubKey_raw
        og.getNonce(tx.from).then((data) => {
          tx.nonce = data.nonce + 1
          var txParams = C.getTxParams(tx.from, tx.to, tx.amount, tx.pubKey, tx.pubKey_raw, tx.nonce)
          console.log('txParams', txParams)
          var signTarget = C.genRawTransaction(txParams)
          console.log('signTarget', signTarget)
          console.log(decPri)
          var signature = C.signRawTransaction(signTarget, decPri)
          console.log('signature', signature)
          var TX = C.makeUpTransaction(txParams, signature)
          console.log('TX', TX)
          return og.sendTransaction(TX)
        }).then((data) => {
          console.log(data)
          var result = JSON.parse(data.body)
          if (result.error) {
            this.$notify.error({
              title: 'transaction failed!',
              message: result.error
            })
          } else {
            this.$notify({
              title: 'transaction sended!',
              message: result.hash,
              type: 'success'
            })
            this.transactionFromShow = false
            this.enterPassShow = false
            // save transaction
            tx.status = 'pending'
            C.saveTransaction(tx, result.hash)
            // reload account page
            var sql = 'SELECT * from txHistory where cFrom == "' + this.accountSelect.address + '"'
            sqlite.query(sql).then((data) => {
              this.transactionData = data.data
            })
          }
        })
      }
    },
    goImportAccount () {
      this.$router.push({ path: '/importAccount' })
    },
    goEdit (account) {
      console.log(account)
      this.editData.name = account.account_name
      this.editFromShow = true
    },
    editAccount (data) {
      console.log(data)
      if (data.hint) {
        var sql1 = 'UPDATE usr SET account_name = "' + data.name + '", account_hint = "' + data.hint + '" where address = ' + '"' + this.accountSelect.address + '"'
        console.log(sql1)
        sqlite.execute(sql1).then((data) => {
          console.log(data)
        })
      } else {
        var sql2 = 'UPDATE usr SET account_name = "' + data.name + '" where address = ' + '"' + this.accountSelect.address + '"'
        console.log(sql2)
        sqlite.execute(sql2).then((data) => {
          console.log(data)
        })
        this.editFromShow = false
        sqlite.query('SELECT * FROM usr where address = "' + this.accountSelect.address + '"').then((data) => {
          console.log(data)
          this.accountSelect.account_name = data.data[0].account_name
        })
      }
    },
    goPassword () {
      this.passwordFromShow = true
    },
    goExport () {

    },
    exportAccount () {
      console.log(this.exportData.password, this.accountSelect.privKey)
      var a = C.decryptPrivKey(this.exportData.password, this.accountSelect.privKey)
      console.log(a)
      if (a === '') {
        console.log('err')
        this.$message({
          message: 'WRONG PASSWORD',
          type: 'error'
        })
      } else {
        var type = 'secp'
        var data = {
          address: this.accountSelect.address,
          secp_privKey: a,
          recoverPhrase: C.getRecoverPhrase(a)
        }
        C.layoutPDF(type, data)
        this.$notify({
          message: 'Account has been successfully exported!',
          type: 'success',
          duration: 8000
        })
        this.visible = false
      }
    },
    toEnterPass () {
      if (C.checkAddress(this.tx.to)) {
        this.enterPassShow = true
      } else {
        this.$message({
          message: 'Invalid format of recipient address. please check recipient address length and expect start with "0x"',
          type: 'error'
        })
      }
    },
    testPassword () {
      var a = C.decryptPrivKey(this.password.testPassword, this.accountSelect.privKey)
      if (a === '') {
        console.log('err')
        this.$message({
          message: 'WRONG PASSWORD',
          type: 'error'
        })
      } else {
        this.$message({
          message: 'This password is correct',
          type: 'success'
        })
      }
    },
    changePassword () {

    },
    useqrcode (data) {
      var canvas = document.getElementById('qrcode')
      QRCode.toCanvas(canvas, data, function (error) {
        if (error) console.error(error)
        console.log('QRCode creat success!')
      })
    },
    deleteAccount (accountSelect) {
      console.log(accountSelect)
      C.deleteAccount(accountSelect.address)
      this.accountInfoShow = false
      this.cardShow = true
      this.visible2 = false
      sqlite.query('SELECT * FROM usr').then((data) => {
        this.accountList = data.data
        console.log('here', this.accountList)
      })
      this.$notify({
        title: 'Account deleted',
        message: 'account \n' + accountSelect.account_name + ' \n has been deleted.',
        type: 'warning'
      })
    },
    goBack () {
      this.accountInfoShow = false
      this.cardShow = true
      sqlite.query('SELECT * FROM usr').then((data) => {
        this.accountList = data.data
        console.log('here', this.accountList)
      })
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
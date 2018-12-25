const OG = require('og-sdk')
const bip39 = require('bip39')
const db = require('../db/db.js')
const CryptoJS = require('crypto-js')
const promise = require('bluebird')
const pdfMake = require('pdfmake/build/pdfmake.js')
const pdfFonts = require('pdfmake/build/vfs_fonts.js')
const config = require('../config/config.js')
pdfMake.vfs = pdfFonts.pdfMake.vfs

var og = new OG()

og.setProvider(
  new OG.providers.HttpProvider(config.OG_RPC.HttpProvider)
)
var C = {}

C.creatAccount = function () {
  return og.newAccount()
}

C.getBalance = function (addr) {
  return og.getBalance(addr)
}

C.getRecoverPhrase = function (data) {
  return bip39.entropyToMnemonic(data)
}

C.recoverPrivate = function (data) {
  return bip39.mnemonicToEntropy(data)
}

C.recoveryAccount = function (privateKey) {
  return og.recoveryAccount(privateKey)
}

C.accountStorage = function (newAccount, newAccountOBJ) {
  return db.execute('INSERT INTO usr VALUES (?,?,?,?,?,?,?)', [newAccount.account_name, newAccount.account_hint, newAccountOBJ.address, newAccountOBJ.public, newAccountOBJ.public_raw, newAccountOBJ.privateKey, newAccount.balance])
}

C.deleteAccount = function (address) {
  return db.execute('DELETE FROM usr WHERE address == "' + address + '"')
}

C.checkAddress = function (address) {
  var checkPoint = '0x'
  if (address.slice(0, 2) === checkPoint && address.length === 42) {
    return true
  } else {
    return false
  }
}

C.encryptPrivKey = function (password, decpri) {
  password = password || 'abcdefg'
  var key = CryptoJS.enc.Utf8.parse(password)
  var srcs = CryptoJS.enc.Utf8.parse(decpri)
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
  return encrypted.toString()
}

C.decryptPrivKey = function (password, encpri) {
  var key = CryptoJS.enc.Utf8.parse(password)
  var decrypt = CryptoJS.AES.decrypt(encpri, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

C.getNonce = function (address) {
  og.getNonce(address).then(function (data) {
    return data
  })
}

C.saveTransaction = function (tx, hash) {
  var time = new Date().toString()
  return db.execute('INSERT INTO txHistory VALUES (?,?,?,?,?,?)', [hash, tx.status, tx.from, tx.to, tx.amount, time])
}

C.getTxParams = function (cfrom, cto, cvalue, cpublicKey, cpublicKeyRaw, cnonce) {
  var tx = {
    from: cfrom,
    to: cto,
    value: cvalue,
    publicKey: cpublicKey,
    publicKey_raw: cpublicKeyRaw,
    height: 10,
    nonce: cnonce
  }
  return tx
}

C.genRawTransaction = function (txParams) {
  return og.genRawTransaction(txParams)
}

C.signRawTransaction = function (signTarget, privateKey) {
  return og.signRawTransaction(signTarget, privateKey).signature
}

C.makeUpTransaction = function (txParams, signature) {
  return og.makeUpTransaction(txParams, signature)
}

C.layoutPDF = function (type, data) {
  // eslint-disable-next-line eqeqeq
  if (type === 'secp') {
    var docDefinition = { content: [
      { text: 'OG ACCOUNT BACKUP CARD', style: 'header' }, '\n', '\n',
      { text: 'OG account:', style: 'header' }, '\n', '\n',
      { text: 'address:', style: 'header' },
      data.address, '\n',
      { text: 'privKey:', style: 'header' },
      data.secp_privKey, '\n',
      { text: 'recoverPhrase:', style: 'header' },
      data.recoverPhrase, '\n'
    ] }
  } else if (type === 'ed') {
    console.log(type)
  } else if (type === 'pair') {
    // eslint-disable-next-line no-redeclare
    var docDefinition = { content: [
      { text: 'CHORUS WALLET ACCOUNT BACKUP CARD', style: 'header' }, '\n', '\n',
      { text: 'CHOE account:', style: 'header' }, '\n', '\n',
      { text: 'address:', style: 'header' },
      data.address, '\n',
      { text: 'privKey:', style: 'header' },
      data.secp_privKey, '\n',
      { text: 'recoverPhrase:', style: 'header' },
      data.recoverPhrase, '\n', '\n',
      { text: 'CHOP account:', style: 'header' }, '\n', '\n',
      { text: 'pubKey:', style: 'header' },
      data.pubKey, '\n',
      { text: 'pubKey:', style: 'header' },
      data.ed_privKey
    ] }
  }

  // eslint-disable-next-line new-cap
  return new promise(function (resolve, reject) {
    try {
      pdfMake.createPdf(docDefinition).download()
      resolve('success')
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = C

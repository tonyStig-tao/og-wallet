const OG = require('og-sdk')
const bip39 = require('bip39')
const db = require('../db/db.js')
const CryptoJS = require('crypto-js')
const promise = require('bluebird')
const pdfMake = require('pdfmake/build/pdfmake.js')
const pdfFonts = require('pdfmake/build/vfs_fonts.js')
pdfMake.vfs = pdfFonts.pdfMake.vfs

var og = new OG()

og.setProvider(
  new OG.providers.HttpProvider('http://localhost:8000')
)
var C = {}

C.creatAccount = function () {
  return og.newAccount()
}

C.getRecoverPhrase = function (data) {
  return bip39.entropyToMnemonic(data)
}

C.accountStorage = function (newAccount, newAccountOBJ) {
  // eslint-disable-next-line no-undef
  // var a = CryptoJS.AES.encrypt(newAccountOBJ.privateKey, newAccount.password)
  // console.log(a)
  return db.execute('INSERT INTO usr VALUES (?,?,?,?,?,?)', [newAccount.account_name, newAccount.account_hint, newAccountOBJ.address, newAccountOBJ.public, newAccountOBJ.public_raw, newAccountOBJ.privateKey])
}

C.deleteAccount = function (address) {
  return db.execute('DELETE FROM usr WHERE address == "' + address + '"')
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

C.layoutPDF = function (type, data) {
  // eslint-disable-next-line eqeqeq
  if (type === 'secp') {
    var docDefinition = { content: [
      { text: 'CHORUS WALLET ACCOUNT BACKUP CARD', style: 'header' }, '\n', '\n',
      { text: 'CHOE account:', style: 'header' }, '\n', '\n',
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

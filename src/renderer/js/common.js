const OG = require('og-sdk')

var og = new OG()

og.setProvider(
  new OG.providers.HttpProvider('http://localhost:8000')
)
var C = {}

C.creatAccount = function () {
  return og.newAccount()
}

module.exports = C

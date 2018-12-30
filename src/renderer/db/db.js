var sqlite3 = require('sqlite3').verbose()
var Promise = require('bluebird')
var path = require('path')
var { remote } = require('electron')
// eslint-disable-next-line no-path-concat
console.log(path.join(remote.app.getPath('userData')))

var db = new sqlite3.Database(path.join(remote.app.getPath('userData'), '/usr.db'), function (data) {
  // console.log(data)
})

var responseObj = {
  result: 'success',
  data: {},
  error: {}
}

var sqliteObj = {}

sqliteObj.createTable = function (sql) {
  return new Promise(function (resolve, reject) {
    db.run(sql, function (err) {
      if (!err) {
        resolve(responseObj)
      } else {
        responseObj.result = 'error'
        responseObj.error = err
        reject(responseObj)
      }
    })
  })
}

sqliteObj.execute = function (sql, varArr) {
  return new Promise(function (resolve, reject) {
    var stmt = db.prepare(sql)
    var flag = false
    // eslint-disable-next-line no-useless-call
    if (stmt.run.call(stmt, varArr)) {
      flag = true
    }
    stmt.finalize()
    if (flag) {
      resolve(responseObj)
    } else {
      responseObj.result = 'error'
      reject(responseObj)
    }
  })
}

sqliteObj.query = function (sql) {
  return new Promise(function (resolve, reject) {
    db.all(sql, function (err, row) {
      if (!err) {
        responseObj.data = row
        resolve(responseObj)
      } else {
        responseObj.result = 'error'
        responseObj.error = err
        reject(responseObj)
      }
    })
  })
}

// db.close();

module.exports = sqliteObj

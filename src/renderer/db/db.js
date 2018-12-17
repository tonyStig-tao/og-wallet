var sqlite3 = require('sqlite3').verbose()
var Promise = require('bluebird')
// eslint-disable-next-line no-path-concat
var db = new sqlite3.Database(__dirname + '/usrDB', function (data) {
  console.log(data)
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

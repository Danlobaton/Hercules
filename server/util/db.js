var mysql = require('mysql');

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
});

module.exports.check_user_id = function(userID, getData) {
  let sql = `SELECT * FROM Facebook_Ads.HerculesUsers WHERE BINARY userID = ${userID}`;
  try {
      con.query(sql, function (err, result) {
          if (err){
            throw err;
          }
          getData({ 
            user_exists: result.length ? true : false,
            permToken: result.length ? result[0].permToken: 0,
            tokenExp: result.length ? result[0].tokenExp : 0
          });
      });
  }
  catch(e) {
    return { db_error : true, message: e }
  }
}

module.exports.add_new_user = function(userID, permToken, checkInsert) {
  let sql = `INSERT INTO Facebook_Ads.HerculesUsers (userID, permToken, newUser) VALUES (${userID}, '${permToken}', 1)`;
  try {
    con.query(sql, function (err, result) {
        if (err){
          throw err;
        }
          checkInsert({success:true, valid: true, message: "Registered new user to ADM"});
    });
  }
  catch(e){
    return {db_error : true, message: e, success: false}
  }
}

module.exports.add_new_user = function(userID, permToken, checkInsert) {
  let sql = `INSERT INTO Facebook_Ads.HerculesUsers (userID, permToken, newUser) VALUES (${userID}, '${permToken}', 1)`;
  try {
    con.query(sql, function (err, result) {
        if (err){
          throw err;
        }
          checkInsert({success:true, valid: true, message: "Registered new user to ADM"});
    });
  }
  catch(e){
    return {db_error : true, message: e, success: false}
  }
}

module.exports.update_user_token = function(userID, permToken, checkInsert) {
  let sql = `UPDATE Facebook_Ads.HerculesUsers SET permToken = '${permToken}' WHERE userID = '${userID}'`;
  try {
    con.query(sql, function (err, result) {
        if (err){
          throw err;
        }
          checkInsert({success:true, valid: true, message: "Updated token for ADM user"});
    });
  }
  catch(e){
    return {db_error : true, message: e, success: false}
  }
}
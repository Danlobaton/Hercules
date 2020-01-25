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

module.exports.add_new_user = function(userID, permToken, name, email, checkInsert) {
  let sql = `INSERT INTO Facebook_Ads.HerculesUsers (userID, permToken, userName, userEmail, newUser) VALUES (${userID}, '${permToken}', '${name}', '${email}', 1)`;
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
// temporary, while there ares till users without name and email
module.exports.check_personal = function(userID, getData) {
  let sql = `SELECT userName FROM Facebook_Ads.HerculesUsers WHERE userID = '${userID}'`;
  try {
    con.query(sql, function(err, result){
      if(err) {
        throw err;
      } else {
        getData(result[0].userName.length);
      }
    })
  }
  catch(e) {
    return {db_error: true, message: e, success: false};
  }
}

// temporary, while there are still users without name and email
module.exports.update_personal = function(userID, name, email, checkInsert) {
  let sql = `UPDATE Facebook_Ads.HerculesUsers SET userName = '${name}', userEmail = '${email}' WHERE userID = '${userID}'`;
  try {
    con.query(sql, function(err, result) {
      if (err) {
        throw err;
      } else {
        checkInsert({success: true, message: 'Updated email and name for ADM user'});
      }
    })
  }
  catch(e) {
    return {db_error: true, message: e, success: false};
  }
}

module.exports.update_last_login = function(userID, checkInsert) {
  let sql = `UPDATE Facebook_Ads.HerculesUsers SET lastLogin = DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 5 HOUR) WHERE userID = ${userID}`;
  try {
    con.query(sql, function(err, result) {
      if (err) {
        throw err;
      } else {
        checkInsert({success: true, message: 'Updated Last Login'});
      }
    })
  }
  catch(e) {
    return {db_error: true, message: e, success: false};
  }
}

module.exports.check_if_current = function(view, object_id, getData) {
  let sql = `SELECT * FROM Facebook_Ads.DailyBreakdown WHERE CampaignID = ${object_id} AND Date = DATE_SUB(CURDATE(), INTERVAL 1 DAY);`;
  try {
    con.query(sql, function(err, result) {
      if(err) {
        throw err;
      } else {
        getData(result.length);
      }
    })
  }
  catch(e) {
    return {db_error: true, message: e, success: false}
  }
}

module.exports.get_last_date = function(view, object_id, getData) {
  let sql = `SELECT DATE_FORMAT(Date, "%y-%m-%d") FROM Facebook_Ads.DailyBreakdown WHERE CampaignID = ${object_id} ORDER BY Date DESC LIMIT 1;`;
  try {
      con.query(sql, function(err, result) {
      if(err) {
        throw err;
      } else {
        if (result.length !== 0) {
          let date = result[0]['DATE_FORMAT(Date, "%y-%m-%d")']
          let dateBegin = date.substring(0, 6)
          let day = (parseInt(date.substring(6, 9)) + 1).toString()
          let adjustedDate = '20' + dateBegin + day
          getData(adjustedDate)
        } else { getData(false) }
      }
    })
  }
  catch(e) {
    return {db_error: true, message: e, success: false}
  }
}

module.exports.campaign_current = function(camp_id, getData) {
  let sql = `SELECT Purchases, DATE_FORMAT(Date, "%y-%m-%d") FROM Facebook_Ads.DailyBreakdown WHERE CampaignID = ${camp_id} ORDER BY Date ASC LIMIT 60;`;
  try {
    con.query(sql, function(err, result) {
      if (err)
        throw err;
      else 
        getData({result: result})
    })
  }
  catch(e) {
    return {db_error: true, message: 3, success: false}
  }
}
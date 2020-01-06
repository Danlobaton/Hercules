var mysql = require('mysql');

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
});

module.exports.check_user_id = function(userID, getData) {
  let sql = `SELECT * FROM Facebook_Ads.HerculesUsers WHERE BINARY userID = ${userID}`;
  try {
    con.connect(function(err) {
      if (err) throw err;
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
    });
  }
  catch(e){
    return {db_error : true, message: e}
  }
}
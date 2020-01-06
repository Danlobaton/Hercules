'use strict';
const request = require('request-promise');

let build_uri = module.exports.build_uri = function(path, params = {}, fb_token) {
    path = path.replace(/^\/+/, ''); // strip any passed in preceding slashes
    params = Object.assign({
      include_headers: false,
      access_token: fb_token
    }, params); // todo make sure these won't break anything
    let limit = 5000;
    let uri = `https://graph.facebook.com/v4.0/${path}`;
    let query = `?limit=${limit}`
    for(let param in params) {
      let val = params[param];
      if(typeof val !== 'string') val = JSON.stringify(val);
      query += `&${encodeURI(param)}=${encodeURI(val)}`;
    }
  return uri + query;
}

module.exports.isTokenValid = function(permToken) {};

module.exports.onboardUser = function(user_id, tempToken) {
  let params = {
    grant_type: "fb_exchange_token",
    fb_exchange_token: tempToken,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  }
    let uri = build_uri("oauth/access_token", params,"");
    return new Promise((resolve, reject) => {
      request.get(uri, params,(err, res, body) => {
          try {
            let access_token = JSON.parse(body).access_token;
            resolve(access_token);
          } 
          catch (e) {
            let error = {
              sys_error: e,
              fb_body: JSON.parse(body)
            }
            console.log(error);
            resolve(error);
           }
        });
    });
}
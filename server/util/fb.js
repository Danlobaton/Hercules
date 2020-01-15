'use strict';
const request = require('request-promise');
const {add_new_user, update_user_token} = require('../util/db');

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
            add_new_user(user_id, access_token, function(status){
              status.success ? console.log("User successfully onboarded!") : console.log(`Error onboarding userID: ${user_id} permToken: ${access_token}`);
              resolve(status);
            });
          }
          catch (e) {
            let error = {
              sys_error: e,
              fb_body: JSON.parse(body)
            }
            console.log(error);
            reject({success: false, error: error});
           }
        })
        .catch(error => resolve(JSON.parse(error.error)))
    });
}

module.exports.isTokenValid = function(permToken) {
  let uri = build_uri("me",{}, permToken);
  return new Promise((resolve, reject) => {
    request.get(uri, {},(err, res, body) => {
      try {
        let data = JSON.parse(body);
        data.error ? (data.error.type === "OAuthException" ? resolve({valid:false}): resolve({valid : true, message: data.error})) : resolve({valid:true});
      }
      catch (e) {
        let error = {
          sys_error: e,
          fb_body: JSON.parse(body)
        }
        console.log(error);
        resolve(error);
      }
    })
    .catch(error => {});
  })
};

module.exports.getNewToken = function(userID, tempToken){
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
          update_user_token(userID, access_token, function(status){
            status.success ? console.log("token updated") : console.log(`Error onboarding userID: ${userID} permToken: ${access_token}`);
            resolve(status)
          });
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
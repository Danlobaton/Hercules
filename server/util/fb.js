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
            add_new_user(user_id, access_token, function(status) {
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
module.exports.get_obj_score = function(raw_metrics) {
      // parse score metrics and place them all under a single object
      let score_metrics;
      let score;
      if(Object.keys(raw_metrics).length !== 0){
        score_metrics = Object.assign({},{
          spend: raw_metrics.spend, 
          roas: raw_metrics.roas, 
          purchases: raw_metrics.purchases, 
          revenue: raw_metrics.revenue,
          profit: raw_metrics.revenue - raw_metrics.spend
        });
      } else {
        return false;
      }
      if(raw_metrics.actions){
        (raw_metrics.actions).forEach(elem => {
          switch(elem.action_type){
            case "omni_add_to_cart":
              score_metrics.atc = parseInt(elem.value);
              break;
            case "omni_initiated_checkout":
              score_metrics.checkouts = parseInt(elem.value);
               break;
            case "omni_view_content":
              score_metrics.content_views = parseInt(elem.value);
              break;
            case "landing_page_view":
              score_metrics.lpv = parseInt(elem.value);
              break;
            case "link_click":
              score_metrics.link_clicks = parseInt(elem.value);
              break;
          }
        });
      }
      // calculate ad object score once the score metrics have been parsed
      if(score_metrics.roas) {
        score = ((Math.pow(score_metrics.profit, 3) * Math.pow(score_metrics.purchases, 2)* score_metrics.spend)/1000)+10000000;
        if(isNaN(score)){
          console.log("roa");
          score = 10000000;
        }
        return score;
      }
      else if(score_metrics.purchases){
        let score = ((Math.pow(score_metrics.purchases, 3) * Math.pow(score_metrics.checkouts, 2)*score_metrics.spend)/1000)+1000000;
        if(isNaN(score)){
          console.log("purchases");
          score = 1000000;
        }
        return score;
      }
      else if(score_metrics.checkouts){
        let score = ((Math.pow(score_metrics.checkouts, 3) * Math.pow(score_metrics.atc, 2)*score_metrics.spend)/1000)+100000;
        if(isNaN(score)){
          console.log("checkouts");
          score = 100000;
        }
        return score;
      }
      else if(score_metrics.atc){
        let score = ((Math.pow(score_metrics.atc, 3) * Math.pow(score_metrics.content_views, 2)*score_metrics.spend)/1000)+10000;
        if(isNaN(score)){
          console.log("atc");
          score = 10000;
        }
        return score;
      }
      else if(score_metrics.content_views){
        let score = ((Math.pow(score_metrics.content_views, 3) * Math.pow(score_metrics.lpv, 2)*score_metrics.spend)/1000)+1000;
        if(isNaN(score)){
          console.log("content_views");
          score = 1000;
        }
        return score;
      }
      else if(score_metrics.lpv){
        let score = ((Math.pow(score_metrics.lpv, 3) * Math.pow(score_metrics.link_clicks, 2)*score_metrics.spend)/1000)+100;
        if(isNaN(score)){
          console.log("lpv");
          score = 100;
        }
        return score;
      }
      else if(score_metrics.reach){
        let score = ((Math.pow(score_metrics.reach, 3) * Math.pow(score_metrics.link_clicks, 2)*score_metrics.spend)/1000)+10;
        if(isNaN(score)){
          console.log("reach");
          score = 10;
        }
        return score;
      }
}

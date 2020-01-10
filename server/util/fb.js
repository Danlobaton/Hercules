'use strict';

const fb = module.exports = {

    /*
     * Helper method to simplify uri building
     * todo make more flexible so it doesn't have to use graph subdomain
     ****************************************************************************/
    build_uri(path, params = {}, fb_token) {
      path = path.replace(/^\/+/, ''); // strip any passed in preceding slashes
      params = Object.assign({
        include_headers: false,
        access_token: fb_token
      }, params); // todo make sure these won't break anything
      let limit = 5000; // https://developers.facebook.com/docs/marketing-api/reference/adgroup
      let uri = `https://graph.facebook.com/v4.0/${path}`;
      let query = `?limit=${limit}`
      for(let param in params) {
        let val = params[param];
        if(typeof val !== 'string') val = JSON.stringify(val);
        query += `&${encodeURI(param)}=${encodeURI(val)}`;
      }
      return uri + query;
    },
    get_obj_score(raw_metrics){
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
        return 0;
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
  }
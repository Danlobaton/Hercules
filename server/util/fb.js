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
    }
  }
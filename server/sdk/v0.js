'use stric';

const request = require('request-promise');
const {build_uri, get_obj_score, onboardUser} = require('../util/fb');
const {getPurchases, compare_revenue, compare_raw_score, ranker} = require('../util/helpers');


module.exports.get_view_children_data = function(object_id, view, token) {
    view = view.toLowerCase();
    let ad_view_map = {
        adaccount : [`act_${object_id}`,"campaigns"],
        campaign: [object_id,"adsets"],
        adset : [object_id, "ads"]
    };
    let params = {
        method: 'get',
        fields: ["id", "name", "status", "insights{purchase_roas, actions, spend, impressions,reach}"]
    }
    if(view === "adaccount"){
        // get only that last 60 days worth of data if it on the ad account level
        let dateObj = new Date();
        const todayDate = dateObj.toISOString().split('T')[0];
        dateObj.setDate(dateObj.getDate() - 60);
        const pastDate = dateObj.toISOString().split('T')[0];

        params = Object.assign({
            filtering: [{
              "field": "campaign.delivery_info",
              "operator": "IN",
              "value": ['active', 'inactive', 'not_delivering']
            }],
            time_range: {since: pastDate, until: todayDate}
          }, params)
    } else {
        params.data_preset = "lifetime";
    }
    let path = `${ad_view_map[view][0]}/${ad_view_map[view][1]}`;
    let uri = build_uri(path, params, token);

    return new Promise((resolve, reject) => {
        request.get(uri, params,(err, res, body) => {
            try {
                let data = JSON.parse(body).data;
                let payload = data.map(function(d) {
                    // a bit werid, but the double ternary is used to deal with Facebook's data formatting patterns
                    // I have no idea why I need the the double parseFloat(), but it wont work otherwise
                    let spend = d.insights ? parseFloat(d.insights.data[0].spend) : 0;
                    let roas = d.insights ? ( d.insights.data[0].purchase_roas ? parseFloat(parseFloat(d.insights.data[0].purchase_roas[0].value).toFixed(2)): 0) : 0;
                    let purchases = d.insights ? ( d.insights.data[0].actions ? getPurchases(d.insights.data[0].actions) : 0) : 0;
                    let revenue = parseFloat((roas * spend).toFixed(2));
                    let score_metrics = d.insights ? Object.assign(d.insights.data[0], {spend, roas, purchases, revenue}) : {};
                    let raw_score = get_obj_score(score_metrics);
                    return data_point = {
                        name: d.name,
                        id: d.id,
                        status: d.status,
                        spend,
                        purchases,
                        revenue,
                        roas,
                        raw_score
                        
                    }
                });
                let nonzero_score_objs = payload.filter(function(elem) { return elem.raw_score != 0; }),
                    zero_score_objs = payload.filter(function(elem) { return elem.raw_score == 0; }),
                    scored_objs = ranker(nonzero_score_objs.sort(compare_raw_score));
                zero_score_objs.forEach(elem => elem.score = 0);
                payload = [...scored_objs, ...zero_score_objs];
                payload.sort(compare_revenue).reverse();
                resolve(payload);
            } catch (e) {
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

module.exports.get_view_kpis = function(object_id, view, token) {
    let name_param;
    view = view.toLowerCase();
    let ad_view_map = {
        "adaccount": [`act_${object_id}`, "Ad Account"],
        "campaign": [object_id, "Campaign"],
        "adset": [object_id, "Ad Set"]
    };
    if (view === "adaccount"){
        name_param = "account_name";
    } else if (view === "campaign"){
        name_param = "campaign_name";
    } else {
        name_param = "adset_name";
    }
    let params = {
        method: 'get',
        fields: [name_param, "spend", "impressions", "reach", "clicks", "actions", "purchase_roas"]
    }
    if (view === "adaccount"){
        // get only that last 60 days worth of data if it on the ad account level
        let dateObj = new Date();
        const todayDate = dateObj.toISOString().split('T')[0];
        dateObj.setDate(dateObj.getDate() - 60);
        const pastDate = dateObj.toISOString().split('T')[0];
        params = Object.assign({time_range: {since: pastDate, until: todayDate}}, params);
    } 
    else {
        params = Object.assign({data_preset: "lifetime"}, params);
    }

    let path = `${ad_view_map[view][0]}/insights`;
    let uri = build_uri(path, params, token);

    return new Promise((resolve, reject) => {

        request.get(uri, params,(err, res, body) => {
            try {
                let data = JSON.parse(body).data[0];
                // a bit werid, but the double ternary is used to deal with Facebook's data formatting patterns
                // I have no idea why I need the the double parseFloat(), but it wont work otherwise
                let roas = data.purchase_roas ? parseFloat(parseFloat(data.purchase_roas[0].value).toFixed(2)) : 0;
                let purchases = data.actions ? getPurchases(data.actions) : 0;
                let revenue = parseFloat((roas * data.spend).toFixed(2));
                let cost_per_purchase = parseFloat((data.spend / purchases).toFixed(2));
                let payload = {
                    name: data[name_param],
                    impressions: data.impressions,
                    clicks: data.clicks,
                    reach: data.reach,
                    spend: data.spend,
                    level: ad_view_map[view][1],
                    cost_per_purchase: (cost_per_purchase === null) ? cost_per_purchase : 0,
                    roas,
                    purchases,
                    revenue
                };
                resolve(payload);
            } catch (e) {
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

module.exports.get_adaccounts = function(user_id, token) {
    let params = {
        token,
        method: 'get',
        fields: ["account_id", "name"]
    }
    let path = `${user_id}/adaccounts`;
    let uri = build_uri(path, params, token);
    return new Promise((resolve, reject) => {
        request.get(uri, params,(err, res, body) => {
            try {
                let data = JSON.parse(body).data;
                let payload = data.map(function(d) {
                    return data_point = {
                        name: d.name,
                        id : d.account_id,
                        level: "Ad Account"
                    }
                });
                resolve(payload);
            } catch (e) {
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

module.exports.check_perm_token = function(user_id, tempToken) {
    /*
        Step 1: Does user exist on the DB- DONE
            - If token does exist on DB
                * isTokenValid ? doNothing : getNewToken;
            - Else
                * Get a new perm token and store users in DB - DONE
                * Start polling ad data
    */
   check_user_id(user_id, function(user_status){
       if(user_status.user_exists){
            // check if the user access token is still valid
            isTokenValid(user_status.permToken)
            .then(r => {
                r.valid ? 0 : getNewToken();
            })
            .catch(r => {
                console.log(r)
                return {fail: r};
            })
       } 
       else {
            // creating new users
            // telemetry data point here
            onboardUser(user_id, tempToken);
            // start polling for ad data if user was onboarded successfully
        }
   });
}
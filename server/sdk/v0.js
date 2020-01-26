'use stric';

const request = require('request-promise');
const {build_uri, get_obj_score, onboardUser, isTokenValid, getNewToken} = require('../util/fb');
const {check_user_id, check_if_current, ad_object_current, get_last_date, check_personal, update_personal, update_last_login} = require('../util/db')
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
        fields: ["id", "name", "status", "insights.date_preset(lifetime){purchase_roas, actions, spend, impressions,reach}"]
    }
    if(view === "adaccount") {
        // get only that last 60 days worth of data if it on the ad account level
        let dateObj = new Date();
        const todayDate = dateObj.toISOString().split('T')[0];
        dateObj.setDate(dateObj.getDate() - 60);
        const pastDate = dateObj.toISOString().split('T')[0];

        params = Object.assign({
            // filtering: [{
            //   "field": "campaign.delivery_info",
            //   "operator": "IN",
            //    "value": ['active', 'inactive', 'not_delivering'],
            // }],
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
                zero_score_objs.forEach(elem => elem.score = false);
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
    if (view === "adaccount") {
        name_param = "account_name";
    } else if (view === "campaign") {
        name_param = "campaign_name";
    } else {
        name_param = "adset_name";
    }
    let params = {
        method: 'get',
        fields: [name_param, "spend", "impressions", "reach", "clicks", "actions", "purchase_roas"]
    }
    if (view === "adaccount") {
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
                let response = JSON.parse(body).data;
                let data = JSON.parse(body).data[0];
                if (response.length === 0) {
                    let noload = {
                        name: null,
                        impressions: 0,
                        clicks: 0,
                        reach: 0,
                        spend: 0,
                        level: null,
                        cost_per_purchase: 0,
                        roas: 0,
                        purchases: 0,
                        revenue: 0
                    };
                    resolve(noload)
                } else {
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
                        cost_per_purchase: (cost_per_purchase) ? cost_per_purchase : 0,
                        roas,
                        purchases,
                        revenue
                    };
                    resolve(payload);
                }
               
                // a bit werid, but the double ternary is used to deal with Facebook's data formatting patterns
                // I have no idea why I need the the double parseFloat(), but it wont work otherwise
                
                
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

module.exports.check_perm_token = function(user_id, tempToken, name, email) {
   return new Promise((resolve, reject) => {
        check_user_id(user_id, function(user_status) {
            if(user_status.user_exists) {
                // updates last-login
                update_last_login(user_id, function(user_status) {
                    if (user_status.success) {
                        console.log(user_status.message);
                    } else {
                        console.log('Something went wrong :(');
                    }
                })

                // updates personal information
                check_personal(user_id, function(upToDate) {
                    if (upToDate) {
                        console.log('User info up-to-date');
                    } else {
                        update_personal(user_id, name, email, function(user_status) {
                            if(user_status.success) {
                                console.log(user_status.message);
                            }
                        })
                    }
                })

                // check if the user access token is still valid
                isTokenValid(user_status.permToken)
                .then(r => {
                    r.valid ?  resolve({valid: true}) : resolve(getNewToken(user_id, tempToken));
                })
                .catch(r => {
                    console.log(r)
                    resolve({error: r});
                })
             }
            else {
                // creating new users
                // telemetry data point here
                onboardUser(user_id, tempToken, name, email)
                .then(r => {
                    update_last_login(user_id, function(user_status) {
                        if (user_status.success) {
                            console.log(user_status.message);
                        } else {
                            console.log('Something went wrong :(');
                        }
                    })
                    console.log(r);
                    resolve(r)
                })
                .catch(r => {
                    console.log(r)
                    resolve({error: r});
                })
                // start polling for ad data if user was onboarded successfully
            }
        })
   })
}

module.exports.returnCurrent = function(object_id, view, user_id, parent_id) {
    return new Promise ((resolve, reject) => {
        var coordinates = [], counter = 0
        // checks if data is current
        check_if_current(view, object_id, function(isValid) {
            if (isValid) {
                ad_object_current(view, object_id, function(campaign) {
                    // formats into desired coordinates
                    campaign.result.map(camp => {
                        coordinates.push({'x': counter, 'y': camp.Purchases, 'day': camp['DATE_FORMAT(Date, "%y-%m-%d")']});
                        counter += 1;
                    })
                    resolve(coordinates)
                })
            } else {
                get_last_date(view, object_id, function(date) {
                    if(date) {
                        let fullPath = `https://hercdata.herokuapp.com/fill_values?obj_id=${object_id}&parent_id=${parent_id}&user_id=${user_id}&last_date=${date}obj_level${view}`
                        request.get(fullPath,(err, res, body) => {
                            let updated = JSON.parse(body)
                            coordinates = []
                            if (updated.success) {
                                ad_object_current(view, object_id, function(campaign) {
                                    // formats into desired coordinates
                                    campaign.result.map(camp => {
                                        coordinates.push({'x': counter, 'y': camp.Purchases, 'day': camp['DATE_FORMAT(Date, "%y-%m-%d")']});
                                        counter += 1;
                                    })
                                    resolve(coordinates)
                                })                      
                            } else { 
                                console.log(updated.message)
                                resolve([])
                            }
                        })
                    } else { 
                        let path = `https://hercdata.herokuapp.com/populate_ad_object?obj_id=${object_id}&parent_id=${parent_id}&user_id=${user_id}&obj_level=${view}`
                        request.get(path, (err, res, body) => {
                            let updated = JSON.parse(body);
                            console.log(updated.message)
                            if (updated.success) {
                                ad_object_current(view, object_id, function(campaign) {
                                    // formats into desired coordinates
                                    campaign.result.map(camp => {
                                        coordinates.push({'x': counter, 'y': camp.Purchases, 'day': camp['DATE_FORMAT(Date, "%y-%m-%d")']});
                                        counter += 1;
                                    })
                                    resolve(coordinates)
                                })                      
                            } else { 
                                console.log(update.message)
                                resolve([]) 
                            }
                        })
                    }
                })
            }
        })
    })
}
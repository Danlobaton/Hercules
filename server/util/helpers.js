'use stric';

module.exports.getPurchases = function(actions) {
    let purchases = 0;
    actions.forEach(element => {
        if (element.action_type === "omni_purchase"){
            purchases = parseInt(element.value);
        }
    });
    return purchases;
}

module.exports.compare_revenue = function(a, b) {
    if (a.revenue < b.revenue)
     return -1;
    if (a.revenue > b.revenue)
    return 1;
  return 0;
}

module.exports.compare_raw_score = function(a, b) {
    if (a.raw_score < b.raw_score)
     return -1;
    if (a.raw_score > b.raw_score)
    return 1;
  return 0;
}

module.exports.ranker = function(ad_objects){
    let percentile_space = Math.trunc(ad_objects.length * 0.33),
        offset = ad_objects.length % 3,
        lower_percentile = ad_objects.slice(0 , percentile_space),
        middle_percentile = ad_objects.slice(percentile_space, percentile_space * 2);
        upper_percentile =  ad_objects.slice(percentile_space * 2, (percentile_space * 3) + offset);
        
    // assign an under-performing score to the lower-percentiles
    lower_percentile.forEach(elem => elem.score = 0.2);
    // assign an neutral-performing score to the middle-percentiles
    middle_percentile.forEach(elem => elem.score = 0.5);
    // assign an over-performing score to the upper-percentiles
    upper_percentile.forEach(elem => elem.score = 0.9);
    return [...lower_percentile, ...middle_percentile, ...upper_percentile];
}
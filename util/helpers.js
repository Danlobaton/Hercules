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

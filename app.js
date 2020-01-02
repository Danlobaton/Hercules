'use stric';

var request = require('request-promise');
var express = require('express');
var cors = require('cors');
var url = require('url');
var sdk = require('./sdk/v0');

const port = process.env.PORT || 5000;
var app = express();
app.listen(port, function() { 
    console.log(`Listening to port ${port}`);
});

app.use(cors());
app.get('/getKpis', getKpis);
app.get('/getView', getView);

function getAccount(req, res) {
    request({
        method: "GET",
        url: "https://devhercules.herokuapp.com/account_state",
        resolveWithFullResponse: true
    })
    .then((response) => {
        res.send(JSON.parse(response.body))
    })
    .catch()
}

function getView(req, res) {
    let {object_id, view, token} = req.query;
    sdk.get_view_children_data(object_id, view, token)
    .then(r => res.json(r))
    .catch(r => {
        console.log(r)
            res.json({fail: r})
        })
}

function getKpis(req, res) {
    let {object_id, view, token} = req.query;
    sdk.get_view_kpis(object_id, view, token)
    .then(r => res.json(r))
    .catch(r => {
        console.log(r)
            res.json({fail: r})
        })
}
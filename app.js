'use stric';

require('dotenv').config()
var express = require('express');
var cors = require('cors');
var path = require('path');
var sdk = require('./server/sdk/v0');
var https = require('https');
var fs = require('fs');
var app = express();

// set up middleware
app.use(cors());
app.use(express.static(path.join(__dirname,'client','build')));
const port = process.env.PORT || 5000;

if(process.env.DEV_ENV == "false") {
    app.listen(port, function() { 
        console.log(`Listening to port ${port}`);
    });
} else {
    https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.crt')
    }, app).listen(port, () => {
        console.log(`Listening to port ${port}`)
    })
}

// routes
app.get('/getKpis', getKpis);
app.get('/getView', getView);
app.get('/getAccounts', getAccounts);
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname,'client' ,'build', 'index.html'));
});

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

function getAccounts(req, res) {
  let {user_id, token} = req.query;
  sdk.get_adaccounts(user_id, token)
  .then(r => res.json(r))
  .catch(r => {
      console.log(r)
          res.json({fail: r})
      })
}

sdk.check_perm_token("10220792625024921", function(x){
    console.log(x);
});
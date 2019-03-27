const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const request = require('request');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/userlocation.beacon.registry'];

// const app = express();
// const port = 3000;

// app.use(cookieParser());
// app.use(session({secret: "Shh, its a secret!"}));


// app.get('/', function(req, res){
//   res.send("Welcome to express!");
// });

// app.get('/auth/google',function(req, res){


//   res.send('/auth/google');
// });

// app.get('/auth/google/callback',function(req, res){
//   console.log(req.query);
//   res.send('/auth/google/callback');
// });

// app.listen(port, function(){
//   console.log('Server started on port : ' + port);
// });



var token = 'Bearer ya29.Glu9BunDac9YS_AvosOnx6xXjyzSGYS8Q7JT43XYv-xgXoXeS3WsVfHNCl8kMZZzWD6a8ZJt5mdXXckVk77hPiaXnXo11wt27ckl25oU4kmZ2t4qcIFJ0Pte1GiN';
//var Url = 'https://proximitybeacon.googleapis.com/v1beta1/beacons/3!fe1595fe82b66453467415c05b36f6d2/attachments';
var Url = 'https://proximitybeacon.googleapis.com/v1beta1/beacons';
//var Url = 'https://proximitybeacon.googleapis.com/v1beta1/MintGreen/attachments'

var bodyData = {
  "namespacedType":"beconizer/advertisement",
  "data":"c2FnYXI="
};

request({
  headers: {
    'Authorization': token,
    'Content-Type': 'application/json'
  },
  uri: Url,
 // body: JSON.stringify(bodyData),
  method: 'GET'
}, (error, response, body) => {
	console.log(response.statusCode);
  if (!error && response.statusCode == 200) {
  	console.log('@@ IF');
    var info = JSON.parse(body);
    console.log(info);
  } else {
  	console.log('@@ ELSE');
  	console.log(body);
  }
});
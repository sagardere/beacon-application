const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const opn = require('opn');
const request = require('request');
const destroyer = require('server-destroy');
const {
  google
} = require('googleapis');
const TOKEN_PATH = path.join(__dirname, 'token.json');
const KEY_PATH = path.join(__dirname, 'oauth2.keys.json');
const CODE_PATH = path.join(__dirname, 'code.json');
let countOne = 0,
  countTwo = 0;
module.exports = () => {
  let helpers = {};
  helpers.stringToDate = (date) => {
    darr = date.split("-");
    console.log(darr)
    var dobj = new Date(parseInt(darr[2]), parseInt(darr[1]) - 1, parseInt(darr[0]));
    let ISOdate = dobj.toISOString();
    //console.log(ISOdate)
    return ISOdate;
  }
  helpers.getNewToken = (oAuth2Client, callback) => {
    console.log('Inside getNewToken.')
    const SCOPES = ['https://www.googleapis.com/auth/userlocation.beacon.registry'];
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      approval_prompt: 'auto'
    });
    const server = http.createServer(async (req, res) => {
      try {
        if (req.url.indexOf('/oauth2callback') > -1) {
          const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
          res.end('Authentication successfull ! Please return to the console.');
          server.destroy();
          var code = qs.get('code');
          oAuth2Client.getToken(code, (err, token) => {
            if (err)
              callback('Error while trying to retrieve access token', null);
            else {
              oAuth2Client.setCredentials(token);
              // Store the token to disk for later program executions
              fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err)
                  console.error(err);
                callback(null, JSON.stringify(token));
              });
            }
          });
        }
      } catch (e) {
        callback(null, oAuth2Client);
      }
    }).listen(3000, () => {
      opn(authorizeUrl, {
        wait: false
      }).then(cp => cp.unref());
    });
    destroyer(server);
  }
  helpers.refreshToken = (callback) => {
    console.log('Within refresh Token................');
    fs.readFile(KEY_PATH, (err, credentials) => {
      if (err)
        callback('Error loading client secret file.', null);
      credentials = JSON.parse(credentials);
      var bodyData = {
        grant_type: 'refresh_token',
        client_id: credentials.web.client_id,
        client_secret: credentials.web.client_secret,
        refresh_token: credentials.web.refresh_token
      }
      var options = {
        method: 'POST',
        url: 'https://oauth2.googleapis.com/token',
        headers: {
          'content-type': 'application/json'
        },
        body: bodyData,
        json: true
      };
      request(options, function(error, response, body) {
        if (error) callback(error);
        fs.writeFile(TOKEN_PATH, JSON.stringify(body), (err) => {
          if (err) {
            console.log('Error saving refresh token in token file.');
            callback(err)
          } else {
            console.log('body', body);
            callback(null, body);
          }
        })
      });
    })
  }
  helpers.authorize = (flag, callback) => {
    fs.readFile(KEY_PATH, (err, credentials) => {
      if (err)
        callback('Error loading client secret file.', null);
      credentials = JSON.parse(credentials);
      const {
        client_secret,
        client_id,
        redirect_uris
      } = credentials.web;
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
          console.log("Error reading file in authorize");
          helpers.getNewToken(oAuth2Client, (err, oAuth2Client) => {
            if (err)
              callback(err, null);
            else {
              console.log("Returning Token ", token);
              callback(null, oAuth2Client);
            }
          });
        } else if (flag == true) {
          helpers.getNewToken(oAuth2Client, (err, oAuth2Client) => {
            if (err)
              callback(err, null);
            else
              callback(null, oAuth2Client);
          });
        } else {
          oAuth2Client.setCredentials(JSON.parse(token));
          callback(null, oAuth2Client);
        }
      });
    });
  }
  helpers.insertBeaconDataOnGoogle = (beaconName, campId, callback) => {
    console.log("Inside insertBeaconDataOnGoogle");
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        helpers.authorize(false, helpers.insertBeaconDataOnGoogle);
      } else {
        token = JSON.parse(token);
        let access_token = 'Bearer ' + token['access_token'];
        console.log('access_token');
        console.log(access_token);
        var options = {
          method: 'POST',
          url: 'https://proximitybeacon.googleapis.com/v1beta1/' + beaconName + '/attachments',
          headers: {
            'Authorization': access_token,
            'content-type': 'application/json'
          },
          body: {
            namespacedType: 'beconizer/advertisement',
            data: campId
          },
          json: true
        };
        request(options, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            //var info = JSON.parse(body);
            let resData = {
              success: true,
              data: body
            };
            callback(null, resData);
          } else {
            let resData = {
              success: false,
              data: body
            };
            callback(null, resData);
          }
        });
      }
    });
  }
  helpers.getBeaconsFromGoogle = (token, callback) => {
    console.log("Inside getBeaconsFromGoogle");
    token = JSON.parse(token);
    //token = JSON.stringify(token);
    console.log(token);
    let access_token = 'Bearer ' + token['access_token'];
    console.log('access_token');
    console.log(access_token);
    const uri = 'https://proximitybeacon.googleapis.com/v1beta1/beacons';
    request({
      headers: {
        'Authorization': access_token,
        'Content-Type': 'application/json'
      },
      uri: uri,
      method: 'GET'
    }, (error, response, body) => {
      console.log('response.statusCode')
      console.log(response.statusCode);
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        let resData = {
          success: true,
          statusCode: response.statusCode,
          data: info
        };
        callback(null, resData);
      } else {
        var resData = {
          success: false,
          statusCode: response.statusCode,
          data: body
        };
        callback(null, resData);
      }
    });
  };
  helpers.stringToDate = (date) => {
    darr = date.split("-");
    //console.log(darr)
    var dobj = new Date(parseInt(darr[2]), parseInt(darr[1]) - 1, parseInt(darr[0]));
    let ISOdate = dobj.toISOString();
    //console.log(ISOdate)
    return ISOdate;
  }
  helpers.getAge = (dob) => {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    //console.log("age:" + age)
    return age;
  }
  return helpers;
};
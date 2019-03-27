// var base64 = require('base-64');
// var utf8 = require('utf8');

// var text = 'sagar';
// var bytes = utf8.encode(text);
// var encoded = base64.encode(bytes);
// console.log(encoded);


const {google} = require('googleapis');
 
const oauth2Client = new google.auth.OAuth2(
  "1061661315432-ft4gsv3fh49j4g21e676cb4ccguodok1.apps.googleusercontent.com",
  "l95heQuJqgyyuAhU-TcPd2_K",
  ["http://localhost:3000/oauth2callback", "https://developers.google.com/oauthplayground", "http://localhost:3000/auth/google/callback"]
);
 //console.log(oauth2Client);
// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = ['https://www.googleapis.com/auth/userlocation.beacon.registry'];
 
const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
 
  // If you only need one scope you can pass it as a string
  scope: scopes
});
console.log(url);

const {tokens} = oauth2Client.getToken(code)
console.log({tokens});
oauth2Client.setCredentials(tokens);
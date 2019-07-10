const mongoose = require('mongoose');
const _ = require('lodash');
let models = require('../models/index')();
let User = models.user();
let Campaign = models.campaign();
let Advertisement = models.advertisement();
let Beacon = models.beacon();
const asyncmodel = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
var helper = require('../lib/helper')();
const path = require('path');
const fs = require('fs');
const base64 = require('base-64');
const utf8 = require('utf8');
const {
  google
} = require('googleapis');
const TOKEN_PATH = path.join(__dirname, '/../lib/token.json');
const KEY_PATH = path.join(__dirname, '/../lib/oauth2.keys.json');
const CODE_PATH = path.join(__dirname, '/../lib/code.json');
module.exports = () => {
  var result = {};
  result.campaignList = async (req, res) => {
    console.log("Inside campaignsList");
    try {
      const userId = req.body.id;
      var list = [];
      let campaignData = await Campaign.find({
        userId: userId
      });
      asyncmodel.eachSeries(campaignData, async (campaign, eachCB) => {
        let obj = {};
        obj.campaignId = campaign._id;
        obj.campaignTitle = campaign.campaignTitle;
        obj.startDate = campaign.schedule.startDate;
        obj.endDate = campaign.schedule.endDate;
        obj.startTime = campaign.schedule.startTime;
        obj.endTime = campaign.schedule.endTime;
        obj.daysOfWeek = campaign.schedule.daysOfWeek;
        let advertisementId = new ObjectId(campaign.advertisementId);
        let beaconId = campaign.beaconId;
        let advertisementTitle = await Advertisement.findOne({_id: advertisementId}, 
          {advertisementTitle: 1,_id: 0});
        let name = await Beacon.find({_id: beaconId}, 
          {name: 1,_id: 0});
        if (!advertisementTitle) advertisementTitle = '';
        if (!name) name = '';
        obj.advertisementTitle = advertisementTitle;
        obj.name = name;
        list.push(obj);
        //eachCB();
      }, (err, data) => {
        console.log('Done For All.');
        res.json({
          success: true,
          data: list
        });
      });
    } catch (err) {
      console.log(err)
      return res.json({
        success: false,
        message: err.toString()
      })
    }
  }

    result.usercampaignsList = async (req, res) => {
    console.log("Inside user campaigns list");
    try {
      const userId = req.body.id;
      const pagenumber = req.body.pagenumber;
      var list = [];
      
      if(pagenumber == 1){
        console.log("page number 1");
        let campaignData = await Campaign.find({
        userId: userId
      }).limit(20).sort({'schedule.startDate':-1});
        main(campaignData);
      } else if(pagenumber == 2){
        console.log("page number 2");
        let campaignData = await Campaign.find({
        userId: userId
      }).skip(20).limit(20).sort({'schedule.startDate':-1});
        main(campaignData);
      }

      function main(data) {
        asyncmodel.eachSeries(data, async (campaign, eachCB) => {
        let obj = {};
        obj.campaignId = campaign._id;
        obj.campaignTitle = campaign.campaignTitle;
        obj.startDate = campaign.schedule.startDate;
        obj.endDate = campaign.schedule.endDate;
        obj.startTime = campaign.schedule.startTime;
        obj.endTime = campaign.schedule.endTime;
        obj.daysOfWeek = campaign.schedule.daysOfWeek;
        let advertisementId = new ObjectId(campaign.advertisementId);
        let beaconId = campaign.beaconId;
        let advertisementTitle = await Advertisement.findOne({_id: advertisementId}, 
          {advertisementTitle: 1,_id: 0});
        let name = await Beacon.find({_id: beaconId}, 
          {name: 1,_id: 0});
        if (!advertisementTitle) advertisementTitle = '';
        if (!name) name = '';
        obj.advertisementTitle = advertisementTitle;
        obj.name = name;
        list.push(obj);
        //eachCB();
      }, (err, data) => {
        console.log(list)
        // var sort =  _.sortBy(list,(campaigns) => {
        //   return campaigns.startDate
        // }).reverse();
        // console.log(sort);
        res.json({
          success: true,
          data: list
        });
      });
      }
    } catch (err) {
      console.log(err)
      return res.json({
        success: false,
        message: err.toString()
      })
    }
  }
  //****************************************************************************************
  //Post
  result.newCampaigns = async (req, res, next) => {
    console.log("Inside newCampaigns");
    // var startTime;
    // var endTime;
    try {
      if (!req.body || !req.body.advertisementId) {
        throw new Error('advertisementId not defined.');
      }
      if (!req.body || !req.body.campaignTitle) {
        throw new Error('campaignTitle not defined.');
      }
      if (!req.body || !req.body.startDate) {
        throw new Error('startDate not defined.');
      }
      if ((req.body.startDate != "") && (req.body.startDate != undefined)) {
        var startDate = helper.stringToDate(req.body.startDate);
      }
      if (!req.body || !req.body.endDate) {
        throw new Error('endDate not defined.');
      }
      if ((req.body.endDate != "") && (req.body.endDate != undefined)) {
        var endDate = helper.stringToDate(req.body.endDate);
      }
      if ((req.body.startTime != "") && (req.body.startTime != undefined)) {
        console.log("in if part")
        var startTime = new Date(startDate);
        //startTime.setHours(parseInt(req.body.startTime));
        var a = helper.splittime(req.body.startTime);
        startTime.setHours(a[0],a[1]);
      }
      if ((req.body.endTime != "") && (req.body.endTime != undefined)) {
        console.log("in if part")
        var endTime = new Date(endDate);
        //endTime.setHours(parseInt(req.body.endTime));
        var b = helper.splittime(req.body.endTime);
        endTime.setHours(b[0],b[1]);
      }
      let userId = req.body.id || '';
      let advertisementId = req.body.advertisementId || '';
      let beaconId = req.body.beaconId || '';
      let campaignTitle = req.body.campaignTitle || '';
      let daysOfWeek = req.body.daysOfWeek || 'allday';
      let gender = req.body.gender || 'any';
      let minage = req.body.minage || '-1';
      let maxage = req.body.maxage || '100';
      let status = req.body.status || '';
      let campaign = new Campaign({
        userId: userId,
        advertisementId: advertisementId,
        beaconId: [],
        campaignTitle: campaignTitle,
        schedule: {
          startTime: startTime,
          endTime: endTime,
          startDate: startDate,
          endDate: endDate,
          daysOfWeek: daysOfWeek
        },
        gender: gender,
        targetAge: {
          minage: minage,
          maxage: maxage
        },
        status: status
      });
      console.log(campaign)
      let newCampaign = await campaign.save();
      if (!newCampaign) throw new Error('Error in campaign saving.');
      res.json({
        success: true,
        message: "Campaign added Successfully.",
        data: newCampaign
      });
    } catch (err) {
      return res.json({
        success: false,
        message: err.toString()
      })
    }
  }
  // ***************************************************************************
  result.campaignDetails = async (req, res, next) => {
    console.log('Inside campaignDetails');
    try {
      if (!req.body || !req.body.campaignId) {
        throw new Error('campaignId not defined.');
      }
      let campaignId = req.body.campaignId;
      let campaignData = await Campaign.find({
        _id: campaignId
      });
      if (!campaignData) campaignData = '';
      res.json({
        success: true,
        data: campaignData
      });
    } catch (err) {
      return res.json({
        success: false,
        message: "Error in getting Campaign Details.."
      })
    }
  }
  //****************************************************************************************
  result.updateCampaign = async (req, res, next) => {
    console.log('Inside updateCampaign');
    try {
      if (!req.body || !req.body.campaignId) {
        throw new Error('campaignId not defined.');
      }
      if (!req.body || !req.body.startDate) {
        throw new Error('startDate not defined.');
      }
      if (!req.body || !req.body.endDate) {
        throw new Error('endDate not defined.');
      }
      if ((req.body.startDate != "") && (req.body.startDate != undefined)) {
        var startDate = helper.stringToDate(req.body.startDate);
      }
      if ((req.body.endDate != "") && (req.body.endDate != undefined)) {
        var endDate = helper.stringToDate(req.body.endDate);
      }
      if ((req.body.startTime != "") && (req.body.startTime != undefined)) {
        console.log("in if part")
        var startTime = new Date(startDate);
        var a = helper.splittime(req.body.startTime);
        startTime.setHours(a[0],a[1]);
      }
      if ((req.body.endTime != "") && (req.body.endTime != undefined)) {
        console.log("in if part")
        var endTime = new Date(endDate);
        var b = helper.splittime(req.body.endTime);
        endTime.setHours(b[0],b[1]);
      }
      let campaignId = req.body.campaignId;
      let advertisementId = req.body.advertisementId || '';
      //let beaconId = req.body.beaconId || '';
      let campaignTitle = req.body.campaignTitle || '';
      let daysOfWeek = req.body.daysOfWeek || 'allday';
      let gender = req.body.gender || 'any';
      let minage = req.body.minage || '-1';
      let maxage = req.body.maxage || '100';
      let status = req.body.status || '';
      let obj = {
        advertisementId: advertisementId,
        campaignTitle: campaignTitle,
        schedule: {
          startTime: startTime,
          endTime: endTime,
          startDate: startDate,
          endDate: endDate,
          daysOfWeek: daysOfWeek
        },
        gender: gender,
        targetAge: {
          minage: minage,
          maxage: maxage
        },
        status: status
      }
      let query = {
        $set: obj
      }
      let updateCampaign = await Campaign.findOneAndUpdate({_id: campaignId},
       query, {new: true});
      if (!updateCampaign) throw new Error('Error in updating campaign..');
      res.json({
        success: true,
        message: 'Campaign updated...',
        data: updateCampaign
      });
    } catch (err) {
      return res.json({
        success: false,
        message: err.toString()
      })
    }
  }
  result.assignBeacon = async (req, res, next) => {
    console.log('Inside assignBeacon');
    if (!req.body || !req.body.campaignId) {
      throw new Error('campaignId not defined...');
    }
    if (!req.body || !req.body.beaconId) {
      throw new Error('beaconId not defined...');
    }
    const campaignId = req.body.campaignId;
    //const beaconId = req.body.beaconId;
    var bytes = utf8.encode(campaignId);
    var base64campaignId = base64.encode(bytes);
    asyncmodel.waterfall([(wCb) => {
      (async () => {
        let beaconsData = await Beacon.find({
          '_id': req.body.beaconId
        });
        if (beaconsData && beaconsData.length > 0 && beaconsData[0].name) {
          console.log('first waterfall ', beaconsData[0].name);
          wCb(null, beaconsData[0].name);
          //wCb(null, dbBeaconName);
        } else {
          wCb('Beacon not found by id.');
        }
      })();
    }, (dbBaconName, wCb) => {
      console.log('Second waterfall');
      //Read token file
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
          //No token
          console.log("No Token file. Calling authorize");
          helper.authorize(false, (err, token) => {
            if (err) {
              console.log('Error in authorize1....');
            } else {
              var jsontoken = JSON.parse(token);
              console.log('refresh token at first time login :', jsontoken['refresh_token']);
              fs.readFile(KEY_PATH, (err, data) => {
                if (err) console.log('Error in reading key file...');
                else {
                  var latestData = JSON.parse(data);
                  var newtoken = 'refresh_token';
                  latestData.web[newtoken] = jsontoken['refresh_token'];
                  fs.writeFile(KEY_PATH, JSON.stringify(latestData), (err) => {
                    if (err) console.log('Error in append refresh token...');
                    console.log('Refresh Token append...');
                  })
                }
              })
              helper.getBeaconsFromGoogle(token, function(err, beacons) {
                if (err) console.log('Error in second waterfall ', err);
                console.log('beacons : ', beacons);
                if (beacons.success == true) {
                  wCb(null, dbBaconName, beacons.data.beacons);
                } else {
                  wCb(beacons.data)
                }
              });
            }
          });
        } else {
          //We have the token
          console.log("Token ", token);
          helper.getBeaconsFromGoogle(token, function(err, beacons) {
            console.log('beacons');
            console.log(beacons);
            if (err || beacons.statusCode == 401) {
              console.log('Authentication Error ');
              helper.refreshToken((err, newToken) => {
                if (err) {
                  console.log('Error in getting new token...');
                  wCb(err);
                } else {
                  console.log('newToken : ', newToken['access_token']);
                  helper.getBeaconsFromGoogle(JSON.stringify(newToken), function(err, beacons) {
                    if (err) console.log('Error in getting beacons after refresh token ', err);
                    console.log('beacons : ', beacons);
                    if (beacons.success == true) {
                      wCb(null, dbBaconName, beacons.data.beacons);
                    } else {
                      wCb(beacons.data)
                    }
                  });
                }
              });
            } else {
              console.log('beacons : ', beacons);
              if (beacons.success == true) {
                wCb(null, dbBaconName, beacons.data.beacons);
              } else {
                wCb(beacons.data)
              }
            }
          });
        }
      });
    }, (dbBaconName, googleBeconData, wCb) => {
      if (googleBeconData.length > 0) {
        for (let i = 0; i < googleBeconData.length; i++) {
          if (googleBeconData[i].description == dbBaconName) {
            return wCb(null, googleBeconData[i]);
          }
        }
        wCb('Same beacon not found on google dev console.');
      } else {
        return wCb('No beacons found on google dev console.')
      }
    }, (beaconFound, wCb) => {
      console.log(beaconFound)
      helper.insertBeaconDataOnGoogle(beaconFound.beaconName, base64campaignId, (err, insertedBeaconData) => {
        console.log(" inserted beacon data ");
        console.log(insertedBeaconData)
        if (insertedBeaconData.success == true) {
          wCb(null, insertedBeaconData);
        } else {
          wCb(insertedBeaconData.data)
        }
      });
    }], (err, result) => {
      if (err) {
        res.json({
          'success': false,
          'err': err.toString()
        });
      } else {
       // var d = base64.decode(result.data['data']);
        let obj = {
          "beaconId": req.body.beaconId
        }
        let query = {
          $push: obj
        }
        Campaign.findOneAndUpdate({
          "_id": campaignId
        }, query, {
          new: true
        }, (err, updatedData) => {
          if (err) return next(err);
          console.log(updatedData);
        });
        res.json({
          'success': true,
          'message': 'Beacon assigned....',
          'data': result
        });
      }
    });
  }
  return result;
}
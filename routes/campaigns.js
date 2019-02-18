const mongoose = require('mongoose');
let models = require('../models/index')();
let User = models.user();
let Campaign = models.campaign();
let Advertisement = models.advertisement();
let Beacon = models.beacon();
const async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
var helper = require('../lib/helper')();
module.exports = () => {
  var result = {};
  
  result.campaignList = async (req, res) => {
    console.log("Inside campaignsList");
    try {
      
      const userId = req.body.id;
      var list = [];
      
      let campaignData = await Campaign.find({
        userId: userId
      }).lean();

      async.eachSeries(campaignData,async function(campaign, eachCB) {
          let obj = {};
          obj.campaignId = campaign._id;
          obj.campaignTitle = campaign.campaignTitle;
          obj.startDate = campaign.schedule.startDate;
          obj.endDate = campaign.schedule.endDate;
          obj.startTime = campaign.schedule.startTime;
          obj.endTime = campaign.schedule.endTime;
          obj.daysOfWeek = campaign.schedule.daysOfWeek;

        let advertisementId = new ObjectId(campaign.advertisementId);
        let beaconId = new ObjectId(campaign.beaconId);
        

       let {advertisementTitle} = await Advertisement.findOne({
        _id: advertisementId
        },{advertisementTitle:1, _id: 0});
       
        let {name} = await Beacon.findOne({
        _id: beaconId
        },{name:1, _id: 0});
        
        if(!advertisementTitle) advertisementTitle = '';
        if(!name) name = '';
        

        obj.advertisementTitle= advertisementTitle;
        obj.name = name;

        list.push(obj);
        
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
//****************************************************************************************
  //Post
  result.newCampaigns = async (req, res, next) => {
    try {
      if (!req.body || !req.body.advertisementId) {
        throw new Error('advertisementId not defined.');
      }
      // if (!req.body || !req.body.beaconId) {
      //   throw new Error('beaconId not defined.');
      // }
      if (!req.body || !req.body.campaignTitle) {
        throw new Error('campaignTitle not defined.');
      }
      // if (!req.body || !req.body.startDate) {
      //   throw new Error('startDate not defined.');
      // }
      // if (!req.body || !req.body.endDate) {
      //   throw new Error('endDate not defined.');
      // }

        console.log(req.body.startDate);
        console.log(req.body.endDate);
      
      
      if((req.body.startDate != "") && (req.body.startDate != undefined)){
          var startDate = helper.stringToDate(req.body.startDate);
          //console.log(startDate);
      }

      if((req.body.endDate != "") && (req.body.endDate != undefined)){
          var endDate = helper.stringToDate(req.body.endDate);
          //console.log(endDate);
      }
      if (!req.body || !req.body.targetAge) {
        throw new Error('targetAge not defined.');
      }
     
      let userId = req.body.id || '';
      let advertisementId = req.body.advertisementId || '';
      let beaconId = req.body.beaconId || '';
      let campaignTitle = req.body.campaignTitle || '';
      let startTime = req.body.startTime || '';
      let endTime = req.body.endTime || '';
      // let startDate = req.body.startDate || '';
      // let endDate = req.body.endDate || '';
      let daysOfWeek = req.body.daysOfWeek || '';
      let gender = req.body.gender || '';
      let targetAge = req.body.targetAge || '';
      let status = req.body.status || '';
      let campaign = new Campaign({
        userId: userId,
        advertisementId: advertisementId,
        beaconId: beaconId,
        campaignTitle: campaignTitle,
        schedule: {
          startTime: startTime,
          endTime: endTime,
          startDate: startDate,
          endDate: endDate,
          daysOfWeek: daysOfWeek
        },
        gender: gender,
        targetAge: targetAge,
        status: status
      });
      
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
// ************************************************************************************
  result.assignBeacon = async (req, res, next) => {
    try {
      if (!req.body || !req.body.campaignId) {
        throw new Error('campaignId not defined...');
      }
      if (!req.body || !req.body.beaconId) {
        throw new Error('beaconId not defined...');
      }
      let campaignId = req.body.campaignId;
      let beaconId = req.body.beaconId;

      Campaign.findOne({
        _id: campaignId
      },function(err,result){
        if(err){ 
          res.send("Campaign not found");
        } 
        else {
        result.beaconId = beaconId;
        //console.log(result);
        result.save();
        res.json({
          success: true,
          message: 'Beacon assigned...',
          data: {beaconId:result.beaconId}
        });
        }
        
      })
    } catch (err) {
      return res.json({
        success: false,
        message: err.toString()
      })
    }
  }
  return result;
}
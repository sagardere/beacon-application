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
      });
      

      async.eachSeries(campaignData, async(campaign, eachCB) =>{
        
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

       let {advertisementTitle} = await Advertisement.findOne({
        _id: advertisementId
        },{advertisementTitle:1, _id: 0});
       
        let name = await Beacon.find({
        _id: beaconId
        },{name:1, _id: 0});
        
        if(!advertisementTitle) advertisementTitle = '';
        if(!name) name = '';

        obj.advertisementTitle= advertisementTitle;
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
      // if (!req.body || !req.body.beaconId) {
      //   throw new Error('beaconId not defined.');
      // }
      if (!req.body || !req.body.campaignTitle) {
        throw new Error('campaignTitle not defined.');
      }
      
      if((req.body.startDate != "") && (req.body.startDate != undefined)){
          var startDate = helper.stringToDate(req.body.startDate);
      }

      if((req.body.endDate != "") && (req.body.endDate != undefined)){
          var endDate = helper.stringToDate(req.body.endDate);
      }
    
      if((req.body.startTime == "")){
         var startTime = new Date(startDate);
       
  
      startTime.setHours(0);
      startTime.setMinutes(0);
     
      }
      
       else if((req.body.startTime != "") && (req.body.startTime != undefined)){
        var startTime = new Date(startDate);
      startTime.setHours(parseInt(req.body.startTime));
      }

      if((req.body.endTime == "")){
       var endTime = new Date(endDate);
        
      startTime.setHours(23);
      startTime.setMinutes(59);
      }

      else if((req.body.endTime != "") && (req.body.endTime != undefined)){
         var endTime = new Date(endDate);
      endTime.setHours(parseInt(req.body.endTime));
      }

      let userId = req.body.id;
      let advertisementId = req.body.advertisementId;
      let beaconId = req.body.beaconId || '';
      let campaignTitle = req.body.campaignTitle || '';
      let daysOfWeek = req.body.daysOfWeek;
      let gender = req.body.gender || '';
      let minage = req.body.minage || '';
      let maxage = req.body.maxage || ''
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
          minage:minage,
          maxage:maxage
        },
        status: status
      });
      
      //console.log(campaign)
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
result.campaignDetails = async(req, res, next)=>{
  console.log('Inside campaignDetails');
  try{

     if (!req.body || !req.body.campaignId) {
        throw new Error('campaignId not defined.');
      }
      let campaignId = req.body.campaignId;
      
      let campaignData = await Campaign.find({
            _id: campaignId
          });
     
      if(!campaignData) campaignData= '';
      res.json({
          success: true,
          data: campaignData
        });

  }catch (err) {
      return res.json({
        success: false,
        message: "Error in getting Campaign Details.."
      })
    }
}
//****************************************************************************************
result.updateCampaign = async (req, res, next)=>{
     console.log('Inside updateCampaign');
     try{

      if (!req.body || !req.body.campaignId) {
        throw new Error('campaignId not defined.');
      }
      if((req.body.startDate != "") && (req.body.startDate != undefined)){
          var startDate = helper.stringToDate(req.body.startDate);
          //console.log(startDate);
      }

      if((req.body.endDate != "") && (req.body.endDate != undefined)){
          var endDate = helper.stringToDate(req.body.endDate);
          //console.log(endDate);
      }

       if((req.body.startTime != "") && (req.body.startTime != undefined)){
        console.log("in if part")
       var startTime = new Date(startDate);
      //console.log(startTime);
      startTime.setHours(parseInt(req.body.startTime));
      //console.log(startTime)
      }

      if((req.body.endTime != "") && (req.body.endTime != undefined)){
        console.log("in if part")
       var endTime = new Date(endDate);
      //console.log(endTime);
      endTime.setHours(parseInt(req.body.endTime));
      //console.log(endTime)
      }

      let campaignId = req.body.campaignId;
      let advertisementId = req.body.advertisementId || '';
      let beaconId = req.body.beaconId || '';
      let campaignTitle = req.body.campaignTitle || '';
      let daysOfWeek = req.body.daysOfWeek || '';
      let gender = req.body.gender || '';
      let minage = req.body.minage || '';
      let maxage = req.body.maxage || '';
      let status = req.body.status || '';

      let obj = {
      advertisementId:advertisementId,
      beaconId:beaconId,
      campaignTitle:campaignTitle,
      schedule:{
      startTime:startTime,
      endTime:endTime,
      startDate:startDate,
      endDate:endDate,
      daysOfWeek:daysOfWeek
    },
      gender:gender,
      targetAge:{
      minage:minage,
      maxage:maxage
    },
      status:status

    }
    //console.log(obj);
    let query = {
      $set: obj
    }

    let updateCampaign = await Campaign.findOneAndUpdate({
                    _id : campaignId
                  },query,{new: true});
    //console.log(updateCampaign);
    
        if (!updateCampaign) throw new Error('Error in updating campaign..');
        res.json({
          success:true,
          message:'Campaign updated...',
          data:updateCampaign
         });

     }catch (err) {
      return res.json({
        success: false,
        message: err.toString()
      })
    }
}
//****************************************************************************************
  result.assignBeacon = async (req, res, next) => {
    console.log('Inside assignBeacon');
    try {
      if (!req.body || !req.body.campaignId) {
        throw new Error('campaignId not defined...');
      }
      if (!req.body || !req.body.beaconId) {
        throw new Error('beaconId not defined...');
      }
      let campaignId = req.body.campaignId;
      let beaconId = req.body.beaconId;

      let obj ={
        "beaconId":beaconId
      }

      let query = {
      $push: obj    
      }

      let updateCampaign = await Campaign.findOneAndUpdate({
                    "_id" : campaignId
                  },query,{new: true});
      console.log(updateCampaign);
        if (!updateCampaign) throw new Error('Error in updating campaign...');
        res.json({
          success:true,
          message:'Beacon assigned...',
          data:{beaconId:updateCampaign.beaconId}
         });

    } catch (err) {
      return res.json({
        success: false,
        message: err.toString()
      })
    }
  }
  return result;
}//****************************************************************************************
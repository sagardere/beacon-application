const mongoose = require('mongoose');
let models = require('../models/index')();
const async = require('async');
let Beacon = models.beacon();
let Campaign = models.campaign();
let User = models.user();
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = () => {
  var result = {};
  
result.beaconList = async(req, res, next) => {
  console.log("Inside beaconList");
  try{
      const userId = req.body.id;
      var list = [];
      var uniqueId = 123456;
      
      let beaconData = await Beacon.find({
        userId: userId
      });

       async.eachSeries(beaconData, async function(beacon, eachCB) {
        //console.log(beacon);
          let obj = {};
          obj.name = beacon.name;
          obj.place = beacon.place;
          obj.uniqueId= uniqueId;
          uniqueId++;
          
        let beaconId = new ObjectId(beacon._id);
        let date = new Date();
        let ISOdate = date.toISOString();

        console.log(beaconId);

        let campaignTitle = await Campaign.find({ 
          $and:[{'schedule.startDate':{$lte:ISOdate}},{'schedule.endDate':{$gte:ISOdate}},{beaconId:beaconId}]
          },{campaignTitle:1, _id:0});
        console.log(campaignTitle);

        if(!campaignTitle) campaignTitle = '';

        obj.campaignTitle = campaignTitle;
        
        list.push(obj);
        //eachCB();

        
      }, (err, data) => {
        console.log('Done For All.');
        res.json({
          success: true,
          data: list
        });
      });

  }catch (err) {
      return res.json({
        success: false,
        message: err.toString()
      })
    }
}
// ***************************************************************************
result.newBeacons = async (req, res, next) => {

    try {
      
      // if (!req.body || !req.body.sqrId) {
      //   throw new Error('SqrId not defined...');
      // }

      // if (!req.body || !req.body.campaignId) {
      //   throw new Error('CampaignId not defined...');
      // }

    let userId = req.body.id || '';
    let sqrId = req.body.sqrId || '';
    let campaignId = req.body.campaignId || '';
    let campaignTitle = req.body.campaignTitle || '';
    let name = req.body.name || '';
    let place = req.body.place || '';

    let beacon = new Beacon({
      userId: userId,
      sqrId:sqrId,
      campaignId:campaignId,
      campaignTitle:campaignTitle,
      name:name,
      place:place
    });

    let newBeacon = await beacon.save();
      if (!newBeacon) throw new Error('Error in beacon saving...');
      res.json({
          success: true,
          message: "New beacon created...",
          data:newBeacon
        });
    } catch (err) {
      return res.json({
        success: false,
        message: err.toString()
      })
    }
  }
  
  return result;
}

// ***************************************************************************
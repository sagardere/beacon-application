const mongoose = require('mongoose');
let models = require('../models/index')();
const async = require('async');
let Beacon = models.beacon();
let Campaign = models.campaign();
let User = models.user();
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = () => {
  var result = {};
result.beacons = async(req, res) => {
  console.log("Inside beacons");
  try{
    const beaconId = req.body.beaconId;

    let beaconData = await Beacon.find({
        _id: beaconId
      });
     if(!beaconData) throw new Error('Error in getting data.');
    //console.log(beaconData[0].name)
    res.json({
          success: true,
          data: {name: beaconData[0].name}//beaconData
          
        });
  }catch (err) {
      return res.json({
        success: false,
        message: err.toString()
      })
    }
}
//****************************************************************************  
result.beaconList = async(req, res, next) => {
  console.log("Inside beaconList");
  try{
      const userId = req.body.id;
      var list = [];
      
      let beaconData = await Beacon.find({
        userId: userId
      });

       async.eachSeries(beaconData, async function(beacon, eachCB) {
        
          let obj = {};
          obj.beaconId = beacon._id;
          obj.name = beacon.name;
          obj.place = beacon.place;

          
        let beaconId = new ObjectId(beacon._id);
        let date = new Date();
        let ISOdate = date.toISOString();

      
        let campaignTitle = await Campaign.find({ 
          $and:[{'schedule.startDate':{$lte:ISOdate}},{'schedule.endDate':{$gte:ISOdate}},{beaconId:beaconId}]
          },{campaignTitle:1, _id:0});
        
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

//****************************************************************************
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
// ***************************************************************************
result.updateBeacons = async (req, res, next) => {
  try{
    if (!req.body || !req.body.id) {
        throw new Error('userId not defined.');
      }
      
      if (!req.body || !req.body.beaconId) {
        throw new Error('beaconId not defined.');
      }
      
      // if (!req.body || !req.body.campaignId) {
      //   throw new Error('campaignId not defined.');
      // }

      // if (!req.body || !req.body.campaignTitle) {
      //   throw new Error('campaignTitle not defined.');
      // }
      
      if (!req.body || !req.body.name) {
        throw new Error('name not defined.');
      }

      if (!req.body || !req.body.place) {
        throw new Error('place not defined.');
      }
    let beaconId = req.body.beaconId;
    let campaignId = req.body.campaignId || '';
    let userId = req.body.id || '';
    let campaignTitle = req.body.campaignTitle || '';
    let name = req.body.name || '';
    let place = req.body.place || '';
    

    let obj = {
      campaignId:campaignId,
      userId:userId,
      campaignTitle:campaignTitle,
      name:name,
      place:place
      
    }

    let query = {
      $set: obj
    }

    let updateBeacon = await Beacon.findOneAndUpdate({
                    _id : beaconId
                  },query,{new: true});
    console.log(updateBeacon);
        if (!updateBeacon) throw new Error('Error in updating beacon...');
        res.json({
          success:true,
          message:'Beacon updated...',
          data:updateBeacon
         });

  }catch (err) {
      return res.json({
        success: false,
        message: err.toString()
      })
    }
}
  
  return result;
}

// ***************************************************************************
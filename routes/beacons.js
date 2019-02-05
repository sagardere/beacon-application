const mongoose = require('mongoose');
let models = require('../models/index')();
const async = require('async');
let Beacon = models.beacon();
let User = models.user();
module.exports = () => {
  var result = {};
  result.allBeacons = async (req, res, next) => {

  console.log("getting beacons")
  // console.log(req.body.user)
  Beacon.find({
          "userId": req.body.id
        }).exec((err, beaconList) => {
          if (err) {
            res.json({
              success: false,
              message: 'Error getting beacons'
            })
          } else {
            res.json({
              success: true,
              data: beaconList
            })
          }
        })
}


// ***************************************************************************
  result.beaconList = async (req, res, next) => {
    try {
      if (!req.params || !req.params.rootId) {
        throw new Error('RootId not defined...');
      }
      let rootId = req.params.rootId;

      if(rootId == 'root'){
        let beaconsList = await Beacon.find({});
        if(!beaconsList) throw new Error('Becon list empty...');
          res.json({
            success:true,
            data:beaconsList
          });
      }
      throw new Error('Not a admin...');
    } catch (err) {
      return res.json({
        success: false,
        message: err.toString()
      })
    }
  }
// ***************************************************************************
  result.newBeacons = async (req, res, next) => {

    try {
      if (!req.body || !req.body.id) {
        throw new Error('UserId not defined...');
      }
      if (!req.body || !req.body.sqrId) {
        throw new Error('SqrId not defined...');
      }

      // if (!req.body || !req.body.campaignId) {
      //   throw new Error('CampaignId not defined...');
      // }

    let id = req.body.id;
    let sqrId = req.body.sqrId;
    //let campaignId = req.body.campaignId;
    let name = req.body.name || '';
    let place = req.body.place || '';

    let beacon = new Beacon({
      id: id,
      sqrId:sqrId,
      //campaignId:campaignId,
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
  result.updateBeacon = async (req, res, next) => {
     try {
      if (!req.body || !req.body.userId) {
        throw new Error('userId not defined...');
      }

      // if (!req.body || !req.body.campaignId) {
      //   throw new Error('Campaign id not defined...');
      // }

        let id = req.params.id;
        let userId = req.body.userId;
        //let campaignId = req.body.campaignId;
        let name = req.body.name;
        let place = req.body.place;

        let obj = {
          userId:userId,
          name:name,
          place:place,
          //campaignId:campaignId
        };
        let query = {
          $set : obj
        };

        let updateBeacon = await Beacon.findOneAndUpdate({
                    _id : id
                  },query);
        if (!updateBeacon) throw new Error('Error in updating beacons...');
        res.json({
          success:true,
          message:'Beacon updated...',
          data:updateBeacon
         });
    } catch (err) {
      return res.json({
        success: false,
        message: err.toString()
      })
    }
    // let id = req.params.id;
    // let userId = req.body.userId;
    // let Name = req.body.Name;
    // let place = req.body.place;
    // let campaignId = req.body.campaignId;
    // let obj = {
    //   userId: userId,
    //   Name: Name,
    //   place: place,
    //   campaignId: campaignId
    // };
    // let query = {
    //   $set: obj
    // };
    // Beacon.findOneAndUpdate({
    //     _id: id
    //   }, query,
    //   (err, data) => {
    //     if (err) {
    //       res.json({
    //         success: false,
    //         message: 'Error in beacon updating...'
    //       })
    //     } else {
    //       res.json({
    //         success: true,
    //         message: "Beacon updated!!!"
    //       })
    //     }
    //   })
  }
  return result;
}

// ***************************************************************************
const mongoose = require('mongoose');
let models = require('../models/index')();
let User = models.user();
let Campaign = models.campaign();
let advertisement = models.advertisement();

module.exports = () => {
  var result = {};

  //Get
  result.campaignsList = (req, res, next) => {

    Campaign.find({userId:req.body.id}).exec((err,campaignList) => {
          if(err) return next(err);
          res.json({
            success:true,
            data:campaignList
          })
        })
  }
  //Post
  result.newCampaigns = async (req, res, next) => {

    try { 
      if (!req.body || !req.body.id) {
        throw new Error('UserId not defined.');
      }

      if (!req.body || !req.body.advertisementID) {
        throw new Error('advertisementID not defined.');
      }

      if (!req.body || !req.body.beaconID) {
        throw new Error('beaconID not defined.');
      }


      if (!req.body || !req.body.advertisementName) {
        throw new Error('advertisementName not defined.');
      }


      if (!req.body || !req.body.startDate) {
        throw new Error('startDate not defined.');
      }

      if (!req.body || !req.body.endDate) {
        throw new Error('endDate not defined.');
      }


    let userId = req.body.id || '';
    let advertisementID = req.body.advertisementID || '';
    let beaconID = req.body.beaconID || '';
    let advertisementName = req.body.advertisementName || '';
    let startTime = req.body.startTime || '';
    let endTime = req.body.endTime || '';
    let startDate = req.body.startDate || '';
    let endDate = req.body.endDate || '';
    let daysOfWeek = req.body.daysOfWeek || '';
    let gender = req.body.gender || '';
    let targetAge = req.body.targetAge || '';
    let status = req.body.status || '';

    let campaign = new Campaign({
      userId: req.body.id,
      advertisementID:advertisementID,
      beaconID:beaconID,
      advertisementName:advertisementName,
      schedule:{
        startTime:startTime,
        endTime:endTime,
        startDate: startDate,
        endDate:endDate
      },
      daysOfWeek:daysOfWeek,
      gender:gender,
      targetAge:targetAge,
      status:status
    });

    console.log(campaign);

    let newCampaign = await campaign.save();
      if (!newCampaign) throw new Error('Error in campaign saving.');
      res.json({
          success: true,
          message: "Campaign added Successfully.",
          data:newCampaign
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
const mongoose = require('mongoose');
const asyncmodel = require('async');
let models = require('../models/index')();
const Campaign = models.campaign();
const Customer = models.customer();
const Advertisement = models.advertisement();
let AdvertisementData = models.advertisementData();
const _ = require('lodash');
var helper = require('../lib/helper')();
module.exports = () => {
  var result = {};

  result.pushAdvertisementDetails = async (req, res, next) => {
    console.log('Inside pushAdvertisementDetails');
    try {

      if (!req.body || !req.body.campaignId) {
        throw new Error('campaignId not defined.');
      }
      let campaignId = req.body.campaignId;
      var customerId = req.body.id;
      let date = new Date();
      console.log("date:" + date);
      let ISOdate = date.toISOString();
      asyncmodel.waterfall([
        (callback) => {
          console.log("1st function");
          Customer.find({
            "_id": customerId
          }).exec((err, customerdata) => {
            if (err) {
              callback(err);
            }
            console.log('Data');
            console.log(customerdata);
            var gender = customerdata[0]['gender'];
            var presentAge = helper.getAge(customerdata[0]['dob']);
            callback(null, presentAge, gender);
          });
        }, (presentAge, gender, callback) => {
          console.log("2nd function");
          Campaign.find({
            "_id": campaignId
          }).exec((err, data) => {
            if (err) {
              callback(err);
            }
            console.log("campaign data :",data)
            var startDate = new Date(data[0]['schedule']['startDate']);
            var ISOstartDate = startDate.toISOString();
            var endDate = new Date(data[0]['schedule']['endDate']);
            var ISOendDate = endDate.toISOString();
            var startTime = new Date(data[0]['schedule']['startTime']);
            var ISOstartTime = startTime.toISOString();
            var endTime = new Date(data[0]['schedule']['endTime']);
            var ISOendTime = endTime.toISOString();
            var daysArray = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            var todayInt = date.getDay();
            var todayStr = daysArray[todayInt];
            var day = data[0]['schedule']['daysOfWeek'].indexOf(todayStr);


            console.log(day);
            if (day == -1 && data[0]['schedule']['daysOfWeek'].indexOf("ALL") == -1) {
              res.json({
                success: false,
                message: "No campaign for today"
              });
              return next(err);
            } else if (((data[0]['targetAge']['minage'] <= presentAge) && (data[0]['targetAge']['maxage'] >= presentAge)) ) {
              if ((ISOstartDate <= ISOdate) && (ISOendDate >= ISOdate)) {
                if ((ISOstartTime <= ISOdate) && (ISOendTime >= ISOdate)) {
                  if (data[0]['gender'].includes(gender) ) {
                    let advertisementId = data[0]['advertisementId'];
                    callback(null, advertisementId);
                  } else {
                    res.json({
                      success: false,
                      message: "gender not matched"
                    });
                  }
                } else {
                  res.json({
                    success: false,
                    message: "time not matched"
                  });
                }
              } else {
                res.json({
                  success: false,
                  message: "date not matched"
                });
              }
            } else {
              res.json({
                success: false,
                message: "age not matched"
              });
            }
          });
        }, (advertisementId, callback) => {
          console.log("3rd function");
          Advertisement.find({
            "_id": advertisementId
          }).exec((err, data) => {

            if (err) {
              callback(err);
            }
            var advertisementData = data;
            console.log("advertisementData :",advertisementData)
            callback(null, advertisementData);
          });
        },
        async (advertisementData, callback) => {
          console.log("4th function");
          let advData = new AdvertisementData({
            CampaignID: campaignId,
            customerId: customerId,
            details: [{
              status: 'pushed'
            },{
              datetime:date
            }]
          });
          let newadvData = await advData.save();
          console.log(newadvData);
          if (!newadvData) throw new Error('Error in saving advertisement data.');
          res.json({
            success: true,
            data: {notification:advertisementData,campaignId:campaignId,customerId:customerId}
          });
        }
      ], (err, result) => {
        if (err) {
          console.log(err)
        }
      }); //async waterfall
    } catch (err) {
      return res.json({
        success: false,
        message: "Right now no campaign for customer..."
      })
    }
  }
  result.openAdvertisement = async (req, res, next) => {
    try {
      console.log('within openAdvertisement...')
      if (!req.body || !req.body.campaignId) {
        throw new Error('campaignId not defined.');
      }
      if (!req.body || !req.body.customerId) {
        throw new Error('customerId not defined.');
      }
      var today = new Date();
      let openAdd = new AdvertisementData({
            campaignId: req.body.campaignId,
            customerId: req.body.customerId,
            details: [{
              status: 'opened',
              datetime:today
            }]
          });
      //save Advertisement data in dbs
      let newAddOpen = await openAdd.save();
      if (!newAddOpen) throw new Error('Error in data adding...');
      res.json({
        success: true,
        message: "Advertisement data successfully added..."
        //data: openAdd
      });
    } catch (err) {
      return res.json({
        success: false,
        message: err.toString()
      })
    }
  }
  //**************************************************************************************
  result.discardAdvertisement = async (req, res, next) => {
    try {
       if (!req.body || !req.body.campaignId) {
        throw new Error('campaignId not defined.');
      }
      if (!req.body || !req.body.customerId) {
        throw new Error('customerId not defined.');
      }
      var today = new Date();
      let discardAdd = new AdvertisementData({
            CampaignID: campaignId,
            customerId: customerId,
            details: [{
              status: 'discarded',
              datetime:today
            }]
          });
      //save Advertisement data in dbs
      let newAddDiscard = await discardAdd.save();
      if (!newAddDiscard) throw new Error('Error in data adding...');
      res.json({
        success: true,
        message: "Advertisement data successfully added..."
      });
    } catch (err) {
      return res.json({
        success: false,
        message: "Error in adding data.."
      })
    }
  }
  return result;
}
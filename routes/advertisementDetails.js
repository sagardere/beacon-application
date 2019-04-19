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
            if (day == -1) {
              res.json({
                success: false,
                message: "No campaign for today"
              });
              return next(err);
            } else if (((data[0]['targetAge']['minage'] <= presentAge) && (data[0]['targetAge']['maxage'] >= presentAge)) || ((data[0]['targetAge']['minage'] == null) && (data[0]['targetAge']['maxage'] == null))) {
              if ((ISOstartDate <= ISOdate) && (ISOendDate >= ISOdate)) {
                if ((ISOstartTime <= ISOdate) && (ISOendTime >= ISOdate)) {
                  //console.log(data[0]['gender'].includes(gender));

                  if (data[0]['gender'].includes(gender)) {
                    let advertisementId = data[0]['advertisementId'];
                    callback(null, advertisementId);
                  } else {
                    res.json({
                      success: false,
                      message: "gender not matched"
                    });
                    return false;
                  }
                } else {
                  res.json({
                    success: false,
                    message: "time not matched"
                  });
                  return false;
                }
              } else {
                res.json({
                  success: false,
                  message: "date not matched"
                });
                return false;
              }
            } else {
              res.json({
                success: false,
                message: "age not matched"
              });
              return next(err);
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
            callback(null, advertisementData);
          });
        },
        async (advertisementData, callback) => {
          console.log("4th function");
          let advData = new AdvertisementData({
            campaignId: campaignId,
            customerId: customerId,
            details: {
              status: 'pushed'
            }
          });
          let newadvData = await advData.save();
          console.log(newadvData);
          if (!newadvData) throw new Error('Error in saving advertisement data.');
          res.json({
            success: true,
            data: advertisementData
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
      // if (!req.body || !req.body.date) {
      //      throw new Error('date not defined.');
      //    }
      //        if (!req.body || !req.body.time) {
      //      throw new Error('time not defined.');
      //    }
      if (!req.body || !req.body.status) {
        throw new Error('status not defined.');
      }
      var today = new Date();
      // const time =  today.getTime();
      // const date = Date.now();
      // const date = req.body.date;
      // const time = req.body.time;
      const status = req.body.status;
      const openAdd = new AdvertisementData({
        details: {
          datetime: today,
          //time:time,
          status: status
        }
      });
      console.log(today);
      //console.log(openAdd);
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
        message: "Error in adding data.."
      })
    }
  }
  //**************************************************************************************
  result.discardAdvertisement = async (req, res, next) => {
    try {
      if (!req.body || !req.body.date) {
        throw new Error('date not defined.');
      }
      if (!req.body || !req.body.time) {
        throw new Error('time not defined.');
      }
      //    if (!req.body || !req.body.status) {
      //   throw new Error('endTime not defined.');
      // }
      const date = req.body.date || '';
      const time = req.body.time || '';
      const discardAdd = new AdvertisementData({
        date: date,
        time: time
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
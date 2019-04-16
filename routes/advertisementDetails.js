const mongoose = require('mongoose');
const async = require('async');
let models = require('../models/index')();
let AdvertisementData =  models.advertisementData();
let Advertisement = models.advertisement();
let Campaign = models.campaign();
let Customer = models.customer();
var helper = require('../lib/helper')();
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = () => {
	var result = {};
//Post
// result.addAdvertisementDetails = async(req, res, next)=>{
// 	console.log('Inside addAdvertisementDetails');
// 	try{


// 	}catch (err) {
//       return res.json({
//         success: false,
//         message: "Error in adding Advertisement Details.."
//       })
//     }
// }
//****************************************************************************************
result.openAdvertisement = async(req, res, next)=>{
	try{

      if (!req.body || !req.body.advertisementId) {
        throw new Error('advertisementId not defined.');
      }

      if (!req.body || !req.body.campaignId) {
        throw new Error('campaignId not defined.');
      }

      
      let advertisementId = req.body.advertisementId || '';
      let campaignId = req.body.campaignId || '';

      const openAdd = new AdvertisementData({
        customerId:id,
        advertisementId:advertisementId,
        campaignId:campaignId,
        details:[{
      	status:'opened'
      }]
      });
      
      console.log(openAdd);

      //save Advertisement data in dbs
      let newAddOpen = await openAdd.save();

      if (!newAddOpen) throw new Error('Error in data adding...');
      res.json({
          success: true,
          message: "Advertisement data successfully added..."
          
        });
	}catch (err) {
      return res.json({
        success: false,
        message: "Error in adding data.."
      })
    }

}

//**************************************************************************************
result.discardAdvertisement = async(req, res, next)=>{
	try{

      if (!req.body || !req.body.advertisementId) {
        throw new Error('advertisementId not defined.');
      }

      if (!req.body || !req.body.campaignId) {
        throw new Error('campaignId not defined.');
      }

      
      let advertisementId = req.body.advertisementId || '';
      let campaignId = req.body.campaignId || '';

      const discardAdd = new AdvertisementData({
        customerId:id,
        advertisementId:advertisementId,
        campaignId:campaignId,
      	details:{
        status:'discarded'
      }
      });

      console.log(discardAdd);
      //save Advertisement data in dbs
      let newAddDiscard = await discardAdd.save();
      if (!newAddDiscard) throw new Error('Error in data adding...');
      res.json({
          success: true,
          message: "Advertisement data successfully added..."
        });
	}catch (err) {
      return res.json({
        success: false,
        message: "Error in adding data.."
      })
    }

}
	return result;
}
//**************************************************************************************

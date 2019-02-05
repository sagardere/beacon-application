const mongoose = require('mongoose');
const async = require('async');
let models = require('../models/index')();
let ProximityData =  models.proximityData();

module.exports = () =>{
	var result = {};
//Post
result.addData = async(req, res, next) =>{
	console.log('Inside adding ProximityData');

	try{

      if (!req.body || !req.body.userID) {
        throw new Error('userID not defined.');
      }
		  if (!req.body || !req.body.beaconID) {
        throw new Error('beaconID not defined.');
      }
      if (!req.body || !req.body.date) {
        throw new Error('date not defined.');
      }
      if (!req.body || !req.body.startTime) {
        throw new Error('startTime not defined.');
      }
      if (!req.body || !req.body.endTime) {
        throw new Error('endTime not defined.');
      }

      const userID = req.body.userID || ''
      const beaconID = req.body.beaconID || '';
      const date = req.body.date || '';
      const startTime = req.body.startTime || '';
      const endTime = req.body.endTime || '';
      

      const proximityData = new ProximityData({
        userID:userID,
      	beaconID:beaconID,
      	date:date,
      	startTime:startTime,
      	endTime:endTime
      });

      //console.log(proximityData);

      //save Proximity data in dbs
      let newProximityData = await proximityData.save();
      if (!newProximityData) throw new Error('Error in data adding...');
      res.json({
          success: true,
          message: "Proximity data successfully added..."
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


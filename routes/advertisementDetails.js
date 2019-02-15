const mongoose = require('mongoose');
const async = require('async');
let models = require('../models/index')();
let AdvertisementData =  models.advertisementData();

module.exports = () => {
	var result = {};
//Post
result.addAdvertisementDetails = async(req, res, next)=>{
	console.log('Inside addAdvertisementDetails');
	try{


	}catch (err) {
      return res.json({
        success: false,
        message: "Error in adding Advertisement Details.."
      })
    }
}
//****************************************************************************************
result.openAdvertisement = async(req, res, next)=>{
	try{
			// if (!req.body || !req.body.date) {
   //      throw new Error('date not defined.');
   //    }
   //    		if (!req.body || !req.body.time) {
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
        details:{
      	datetime:today,
      	//time:time,
      	status:status
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
			if (!req.body || !req.body.date) {
        throw new Error('date not defined.');
      }
      		if (!req.body || !req.body.time) {
        throw new Error('time not defined.');
      }
      // 		if (!req.body || !req.body.status) {
      //   throw new Error('endTime not defined.');
      // }
      const date = req.body.date || '';
      const time = req.body.time || '';

      const discardAdd = new AdvertisementData({
      	date:date,
      	time:time 
      });

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

const mongoose = require('mongoose');
let models = require('../models/index')();
let User = models.user();
let Advertisement = models.advertisement();
let Campaign = models.campaign();
var ObjectId = require('mongoose').Types.ObjectId;
async = require('async');


module.exports = () => {
  var result = {};
  
result.advertisementList = async(req, res, next) => {
  console.log("Inside advertisementList");
  try{
      const userId = req.body.id;
      var list = [];
      
      
      let advertisementData = await Advertisement.find({
        userId: userId
      });

        async.eachSeries(advertisementData,async function(advertisement, eachCB) {
          
          let obj = {};
          obj.advertisementId = advertisement._id;
          obj.advertisementTitle = advertisement.advertisementTitle;
          
          
          let advertisementId = new ObjectId(advertisement._id);

          let campaignTitle = await Campaign.find({
            advertisementId: advertisementId
          },{campaignTitle:1, _id:0});

        if(!campaignTitle) campaignTitle= '';

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
//Post
  result.newAdvertisements = async (req, res, next) => {
    try{

      if (!req.body || !req.body.advertisementTitle) {
        throw new Error('advertisementTitle not defined.');
      }
      
      if (!req.body || !req.body.advertisementContents) {
        throw new Error('advertisementContents not defined.');
      }

      // if (!req.body || !req.body.image) {
      //   throw new Error('image not defined.');
      // }
      
      // if (!req.body || !req.body.action) {
      //   throw new Error('action not defined.');
      // }

      // if (!req.body || !req.body.actionTarget) {
      //   throw new Error('actionTarget not defined.');
      // }

    let advertisementTitle = req.body.advertisementTitle || '';
    let userId = req.body.id || '';
    let advertisementContents = req.body.advertisementContents || '';
    let image = req.body.image || '';
    let action = req.body.action || '';
    let actionTarget = req.body.actionTarget || '';

    let advertisement = new Advertisement({
      advertisementTitle:advertisementTitle,
      userId: userId,
      advertisementContents:advertisementContents,
      image:image,
      action:action,
      actionTarget:actionTarget     
    });
    let newadvertisement = await advertisement.save();
      if (!newadvertisement) throw new Error('Error in advertisement saving.');
      res.json({
          success: true,
          message: "Advertisement added Successfully.",
          data:newadvertisement
        });

    }catch (err) {
      return res.json({
        success: false,
        message: err.toString()
      })
    }

}
// ***************************************************************************
result.updateAdvertisement = async (req, res, next) => {
  try{
    if (!req.body || !req.body.advertisementTitle) {
        throw new Error('advertisementTitle not defined.');
      }
      
      if (!req.body || !req.body.advertisementContents) {
        throw new Error('advertisementContents not defined.');
      }

      // if (!req.body || !req.body.image) {
      //   throw new Error('image not defined.');
      // }
      
      // if (!req.body || !req.body.action) {
      //   throw new Error('action not defined.');
      // }

      // if (!req.body || !req.body.actionTarget) {
      //   throw new Error('actionTarget not defined.');
      // }
    let advertisementId = req.body.advertisementId;
    console.log(advertisementId);
    let advertisementTitle = req.body.advertisementTitle || '';
    let userId = req.body.id || '';
    let advertisementContents = req.body.advertisementContents || '';
    let image = req.body.image || '';
    let action = req.body.action || '';
    let actionTarget = req.body.actionTarget || '';

    let obj = {
      advertisementTitle:advertisementTitle,
      userId:userId,
      advertisementContents:advertisementContents,
      image:image,
      action:action,
      actionTarget:actionTarget

    }

    let query = {
      $set: obj
    }

    let updateAdv = await Advertisement.findOneAndUpdate({
                    _id : advertisementId
                  },query,{new: true});
    console.log(updateAdv);
        if (!updateAdv) throw new Error('Error in updating advertisement...');
        res.json({
          success:true,
          message:'Advertisement updated...',
          data:updateAdv
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


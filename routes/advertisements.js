const mongoose = require('mongoose');
let models = require('../models/index')();
let User = models.user();
let Advertisement = models.advertisement();
async = require('async');


module.exports = () => {
  var result = {};
  //Get
  result.advertisementsList = (req, res) => {

    Advertisement.find({"userId":req.body.id}).exec((err,advertisementList) => {
          if(err) return next(err);
          res.json({
            success:true,
            data:advertisementList
          })
    })

  }
  
  //Post
  result.newAdvertisements = async (req, res, next) => {
    try{

      if (!req.body || !req.body.advertisementName) {
        throw new Error('advertisementName not defined.');
      }
      if (!req.body || !req.body.id) {
        throw new Error('UserId not defined.');
      }
      if (!req.body || !req.body.campaignTitle) {
        throw new Error('campaignTitle not defined.');
      }

      if (!req.body || !req.body.campaignContents) {
        throw new Error('campaignContents not defined.');
      }

      if (!req.body || !req.body.image) {
        throw new Error('image not defined.');
      }
      
      if (!req.body || !req.body.action) {
        throw new Error('action not defined.');
      }

      if (!req.body || !req.body.actionTarget) {
        throw new Error('actionTarget not defined.');
      }

    let advertisementName = req.body.advertisementName || '';
    let id = req.body.id || '';
    let campaignTitle = req.body.campaignTitle || '';
    let campaignContents = req.body.campaignContents || '';
    let image = req.body.image || '';
    let action = req.body.action || '';
    let actionTarget = req.body.actionTarget || '';

    let advertisement = new Advertisement({
      advertisementName:advertisementName,
      id: id,
      campaignTitle:campaignTitle,
      campaignContents:campaignContents,
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
 return result;
}

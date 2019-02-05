//Require all routes
const express = require('express');
let router = express.Router();

let userController = require('./users.js')();
let beaconController = require('./beacons.js')();
let advertiseController = require('./advertisements.js')();
let campaignController = require('./campaigns.js')();
let customerController = require('./customers.js')();
let proximityDataController = require('./addProximityData.js')();
let advertiseDataController = require('./advertisementDetails.js')();
let models = require('../models/index')();
let User = models.user();
let Customer = models.customer();
let ProximityData = models.proximityData();

router.get('/',function(req, res){
	res.send("HOME..");
});

//user
router.post('/login',userController.login);
router.post('/logout',isLoggedIn,userController.logout);

//beacon
router.post('/beacons',isLoggedIn,beaconController.allBeacons);
//router.post('/create_beacon',isLoggedIn,beaconController.newBeacons);

//advertisement
router.post('/advertisements',isLoggedIn,advertiseController.advertisementsList);
router.post('/create_advertisement',isLoggedIn,advertiseController.newAdvertisements);

//campaigns
router.post('/campaigns',isLoggedIn,campaignController.campaignsList);
router.post('/create_campaign',isLoggedIn,campaignController.newCampaigns);

//customer
router.post('/registerCustomer',customerController.registerCustomer);
router.post('/loginCustomer',customerController.loginCustomer);
router.post('/logoutCustomer',customerIsLoggedIn,customerController.logoutCustomer);

//proximityData
router.post('/addProximityData',proximityDataController.addData);

//advertisementDetails
router.post('/advertisementDetails', advertiseDataController.addAdvertisementDetails);
router.post('/openAdvertisement', advertiseDataController.openAdvertisement);
router.post('/discardAdvertisement',advertiseDataController.discardAdvertisement);


function isLoggedIn(req, res, next) {
    // check user is authenticated or not
    if (!req.body || !req.body.id) {
        return res.json({
                success: false,
                message: "Invalid arguments"
            })
    }
    if (!req.body || !req.body.token) {
        return res.json({
                success: false,
                message: "Invalid arguments"
         		})
    }

    let token =req.body.token

    User.findOne({
      "_id": req.body.id
    }).exec((err, userinfo)=>{
    	if(err || userinfo == null){
            return res.json({
                success: false,
                message: "Not authorized"
            })
         }else{
         	if(token == userinfo.token){
         		req.body.user=userinfo
         		next()
         	}else{
         		return res.json({
                	success: false,
                	message: "Not authorized"
         		})
         	}
         }
    })
  }
//**********************************************************************************************
  function customerIsLoggedIn(req, res, next) {
    // check user is authenticated or not
    if (!req.body || !req.body.id) {
        return res.json({
                success: false,
                message: "Invalid arguments"
            })
    }
    if (!req.body || !req.body.token) {
        return res.json({
                success: false,
                message: "Invalid arguments"
                })
    }

    let token =req.body.token

    Customer.findOne({
      "_id": req.body.id
    }).exec((err, customerInfo)=>{
        if(err || customerInfo == null){
            return res.json({
                success: false,
                message: "Not authorized"
            })
         }else{
            if(token == customerInfo.token){
                req.body.customer=customerInfo
                next()
            }else{
                return res.json({
                    success: false,
                    message: "Not authorized"
                })
            }
         }
    })
  }
//export router
module.exports = router;

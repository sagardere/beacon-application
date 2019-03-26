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
router.post('/changePassword',userController.changePassword);

//beacon
router.post('/create_beacon',beaconController.newBeacons);
router.post('/update_beacon',isLoggedIn,beaconController.updateBeacons);
router.post('/beaconsList',isLoggedIn,beaconController.beaconList);
router.post('/beacons',isLoggedIn,beaconController.beacons);

//advertisement
router.post('/create_advertisement',isLoggedIn,advertiseController.newAdvertisements);
router.post('/advertisementDetails',isLoggedIn,advertiseController.advertisementDetails);
router.post('/update_advertisement',isLoggedIn,advertiseController.updateAdvertisement);
router.post('/advertisementsList',isLoggedIn,advertiseController.advertisementList);

//campaigns
router.post('/create_campaign',isLoggedIn,campaignController.newCampaigns);
router.post('/campaignDetails',isLoggedIn,campaignController.campaignDetails);
router.post('/update_campaign',isLoggedIn,campaignController.updateCampaign);
router.post('/assignBeacon',isLoggedIn,campaignController.assignBeacon);
router.post('/campaignsList',isLoggedIn,campaignController.campaignList);


//customer
router.post('/registerCustomer',customerController.registerCustomer);
router.post('/loginCustomer',customerController.loginCustomer);
router.post('/logoutCustomer',customerIsLoggedIn,customerIsLoggedIn,customerController.logoutCustomer);
router.post('/changePasswordCustomer',customerController.changePassword);

//proximityData
router.post('/addProximityData',proximityDataController.addData);

//advertisementDetails
router.post('/addAdvertisementDetails',customerIsLoggedIn,advertiseDataController.pushAdvertisementDetails);
router.post('/openAdvertisement', customerIsLoggedIn,advertiseDataController.openAdvertisement);
router.post('/discardAdvertisement',customerIsLoggedIn,advertiseDataController.discardAdvertisement);


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

//Require all models
const mongoose = require('mongoose'),
    _ = require('lodash'),
    user = require('./user'),
    beacon = require('./beacon'),
    campaign = require('./campaign'),
    advertisement = require('./advertisement'),
    customer = require('./customer'),
    proximityData = require('./proximityData'),
    advertisementData = require('./advertisementData');


//let connections = {};

module.exports =  () => {

    let mongoModels = {};

    mongoModels.user =  () => {
        return mongoose.model('user', user);
    };
     mongoModels.beacon =  () => {
        return mongoose.model('beacon', beacon);
    };
     mongoModels.campaign =  () => {
        return mongoose.model('campaign', campaign);
    };
     mongoModels.advertisement =  () => {
        return mongoose.model('advertisement', advertisement);
    };
    mongoModels.customer =  () => {
        return mongoose.model('customer', customer);
    };
    mongoModels.proximityData =  () => {
        return mongoose.model('proximityData', proximityData);
    };
    mongoModels.advertisementData =  () => {
        return mongoose.model('advertisementData', advertisementData);
    };


  return mongoModels;
};
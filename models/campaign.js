const mongoose = require('mongoose');
var campaign = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  beaconId: [{
    type: String
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'beacon'
  }],
  advertisementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'advertisement'
  },
  campaignTitle:{
      type: String
      //allowNull: false
  },
  schedule: {
    startTime: {
      type: Date
    },
    endTime: {
      type: Date
    },
    startDate: {
      type: Date,
      allowNull: false
    },
    endDate: {
      type: Date,
      allowNull: false
    },
    daysOfWeek: [{
      type: String,
      enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday','allday']
    }]
  },
  gender: [{
    type: String,
    enum: ['male','female','any']

  }],
  targetAge: {
    minage: {
      type: Number
    },
    maxage: {
      type: Number
    }
  },

  status: {
    type: String
  }
});
module.exports = campaign;
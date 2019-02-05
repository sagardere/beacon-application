const mongoose = require('mongoose');
var campaign = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  beaconID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'beacon'
  },
  advertisementID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'advertisement'
  },
  advertisementName: {
      type: String,
      allowNull: false
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
    daysOfWeek: {
      type: String,
      enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    }
  },
  gender: {
    type: String,
    enum: ['male','female']
    //unique: true
  },
  targetAge: {
    type: Number
    //unique: true
  },

  status: {
    type: String
    //allowNull: false
    //unique: true
  }
});
module.exports = campaign;
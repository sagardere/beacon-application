const mongoose = require('mongoose');

var proximityData = new mongoose.Schema({
	
	// beaconID:{type: mongoose.Schema.Types.ObjectId,
	// 			ref: 'beacon'
	// },
	userID:{type: mongoose.Schema.Types.ObjectId,
				ref: 'user'
	},
	beaconID:{
		type:String
	},
	date:{
		type:Date
	},
	startTime:{
		type:Date
	},
	endTime:{
		type:Date
	}
});

module.exports = proximityData;


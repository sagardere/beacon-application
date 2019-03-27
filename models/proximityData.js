const mongoose = require('mongoose');

var proximityData = new mongoose.Schema({
	
	// beaconID:{type: mongoose.Schema.Types.ObjectId,
	// 			ref: 'beacon'
	// },
	customerId:{type: mongoose.Schema.Types.ObjectId,
				ref: 'customer'
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


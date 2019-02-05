const mongoose = require('mongoose');

var advertisementData = new mongoose.Schema({
	
	CampaignID:{type: mongoose.Schema.Types.ObjectId,
				ref: 'campaign'
	},
	details:{
		type:Array,

		status: {
			enum: ['pushed', 'opened', 'discarded']
		},
		date:{
			type: Date
		},
		time:{
			type:Date
		}

	}
});

module.exports = advertisementData;


const mongoose = require('mongoose');

var advertisementData = new mongoose.Schema({
	
	CampaignID:{type: mongoose.Schema.Types.ObjectId,
				ref: 'campaign'
	},
	details:[{

			status:{
			type: String,	
			enum: ['pushed', 'opened', 'discarded']
		},
		// 	date:{
		// 	type: Date
		// },
		// 	time:{
		// 	type:Date
		// }
		datetime:{
			type: Date
		}
	}]	
});

module.exports = advertisementData;


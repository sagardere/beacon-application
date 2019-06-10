const mongoose = require('mongoose');

var advertisementData = new mongoose.Schema({

	campaignId:{type: mongoose.Schema.Types.ObjectId,
				ref: 'campaign'
	},
	customerId:{type: mongoose.Schema.Types.ObjectId,
				ref: 'customer'},
	details:[{

			status:{
			type: String,
			enum: ['pushed', 'opened', 'discarded']
		},
		datetime:{
			type: Date
		}
	}]
});

module.exports = advertisementData;


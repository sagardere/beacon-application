const mongoose = require('mongoose');


var beacon = new mongoose.Schema({

	userId:{type: mongoose.Schema.Types.ObjectId,
				ref: 'user'
	},
	sqrId: {
		type: String,
		allowNull: false,
		unique: true,
	},
	name:{
		type: String,
		allowNull: false,
		unique: true
	},
	place:{
		type: String,
		allowNull: false,
		unique: true
	},
	campaignId:{type: mongoose.Schema.Types.ObjectId,
				ref: 'campaign'
	}

});

module.exports = beacon;
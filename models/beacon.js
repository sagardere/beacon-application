const mongoose = require('mongoose');


var beacon = new mongoose.Schema({

	userId:{type: mongoose.Schema.Types.ObjectId,
				ref: 'user'
	},
	campaignId:{type: mongoose.Schema.Types.ObjectId,
				ref: 'campaign'
	},
	sqrId: {
		type: String,
		allowNull: false
		//unique: true,
	},
	name:{
		type: String,
		allowNull: false
		//unique: true
	},
	place:{
		type: String,
		allowNull: false
		//unique: true
	}
	
});

module.exports = beacon;
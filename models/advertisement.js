const mongoose = require('mongoose');


var advertisement = new mongoose.Schema({

	userId:{type: mongoose.Schema.Types.ObjectId,
				ref: 'user'
	},
	campaignTitle: {
		type: String,
		allowNull: false
		//unique: true,
	},
	campaignContents:{
		type: String,
		allowNull: false
		//unique: true
	},
	image:{
		type: Array
		//allowNull: false
		//unique: true
	},
	action:{
		type: String,
		enum:['call','navigate']
		//unique: true
	},
	actionTarget: {
		type: String
		//unique: true
	}
});
module.exports = advertisement;
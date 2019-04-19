const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

var customer = new mongoose.Schema({
	username:{
		firstname:{
			type:String,
			required: true
		},
		middlename:{
			type:String
		},
		lastname:{
			type:String
		}
	},
	dob:{
		type:Date,
		required:true
	},
	mobile:{               //LoginID of Customer
		type:String,
		required:true,
		unique: true
	},
	email:{
		type:String,
		required:true,
		unique: true
	},
	gender:{
		type:String,
		enum:['male','female'],
		required:true
	},
	password:{
		type:String,
		required:true
	},
	confirmPass: {
		type:String

	},
	token:{
		type:String
	}

});

module.exports = customer;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

var user = new mongoose.Schema({
	username:{
		firstname:{
			type:String
		},
		middlename:{
			type:String
		},
		lastname:{
			type:String
		}
	},
	email:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	role:{
		type:String,
		enum:['admin','superadmin','user']
	},
	manager:{
		type:String
	},
	dob:{
		type:Date,
		required:true
	},
	gender:{
		type:String,
		required:true
	},
	token:{
		type:String
	}
});

module.exports = user;
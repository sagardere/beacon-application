const passwordHash = require('password-hash');
const mongoose = require('mongoose');
const async = require('async');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let models = require('../models/index')();
let Customer = models.customer();
var helper = require('../lib/helper')();

module.exports = () => {
  var result = {};
//Post
result.registerCustomer = async(req, res, next)=>{
	console.log('Inside Customer registration...');
	try {
      if (!req.body || !req.body.email) {
        throw new Error('Email not defined.');
      }
      if (!req.body || !req.body.password) {
        throw new Error('Password not defined.');
      }
      if (!req.body || !req.body.confirmPass) {
        throw new Error('confirm password not defined.');
      }
      if (!req.body || !req.body.firstname) {
        throw new Error('firstname not defined.');
      }
       if((req.body.dob != "") && (req.body.dob != undefined)){
          var dob = helper.stringToDate(req.body.dob);
          //console.log(dob);
      }
      if (!req.body || !req.body.mobile) {
        throw new Error('mobile number not defined.');
      }
      if (!req.body || !req.body.gender) {
        throw new Error('Gender not defined.');
      }
      

      const email = req.body.email;
      const password = req.body.password;
      const confirmPass = req.body.confirmPass;
      const firstname = req.body.firstname;
      const middlename = req.body.middlename || '';
      const lastname = req.body.lastname || '';
      //const dob = req.body.dob;
      const mobile = req.body.mobile;
      const gender = req.body.gender;

      bcrypt.compare(password, confirmPass).then((response)=>{
      	if(!response){
      		throw new Error('Passwords not matched!');
      	}  	
      });

  
      let customerExist = await Customer.findOne({
        mobile: mobile
      });

	  if (customerExist) throw new Error('mobile allready exists.');
      const hashedPassword = passwordHash.generate(password);
      const customer = new Customer({
       username:{
                  firstname:firstname,
                  middlename:middlename,
                  lastname:lastname
                },
                email:email,
                password: hashedPassword,
                dob: dob,
                mobile: mobile,
                gender:gender
                
      });

      //save Customer information in dbs
      let newCustomer = await customer.save();
      if (!newCustomer) throw new Error('Error in Customer Registration...');
      res.json({
          success: true,
          message: "Customer successfully registered..."
        });
    } catch (err) {
      return res.json({
        success: false,
        message: err.toString()
      })
    }
    }
//**********************************************************************************************
result.loginCustomer = async(req, res, next)=>{
	console.log('Inside loginCustomer');
	try{

		  if (!req.body || !req.body.mobile) {
        throw new Error('Mobile number not defined.');
      }

      if (!req.body || !req.body.password) {
        throw new Error('Password not defined.');
      }

      const mobile = req.body.mobile;
      const password = req.body.password;
      let customerExist = await Customer.findOne({
        mobile: mobile
      })

      if (!customerExist) {
        throw new Error('Customer not registered, please register.');
      }

      const newHashPass = (passwordHash.verify(password, customerExist.password));
      if (!newHashPass) throw new Error('Incorrect password.');
      const Token = jwt.sign({
                mobile: customerExist.mobile,
                _id: customerExist._id
              },
              'secretkey', {
                expiresIn: '2h'
              });

            var query = {
              $set: {token: Token}
            };
            req.session.mobile = mobile;

       let updateCustomer = await Customer.findOneAndUpdate({
              mobile: mobile
            }, query, {
              new: true
            });
       if(!updateCustomer) throw new Error('Error in updating customer.');
    res.json({
      success: true,
      data: {firstname: updateCustomer.username.firstname, token: updateCustomer.token, id: updateCustomer._id}
    });
      

	}catch (err) {
      return res.json({
        success: false,
        message: "Invalid mobile no or password"
      })
    }
}
//**********************************************************************************************
	result.logoutCustomer = async(req, res, next)=>{
		console.log('Inside logoutCustomer...');
	try{

		Customer.update({_id: req.body.id}, {
      	token: null, 
      
    }, function(err, affected, resp) {
      
      if(err){
        return res.json({
                success: false,
                message: "Error logging out"
            })
      }else{
         req.session.destroy();
        return res.json({
                success: true,
                message: "Logout successfully"
            })
      }
    })
	}catch (err) {
      return res.json({
        success: false,
        message: "Invalid userID or password"
      })
    }
	}
//**********************************************************************************************
  result.changePassword = async(req, res, next) => {
    console.log("Inside changePassword");
    try{

         if (!req.body || !req.body.mobile) {
        throw new Error('Email not defined.');
      }

      if (!req.body || !req.body.newPassword) {
        throw new Error('newPassword not defined.');
      }

      if (!req.body || !req.body.confirmPass) {
        throw new Error('confirmPass not defined.');
      }

      const mobile = req.body.mobile;
      const newPassword = req.body.newPassword;
      const confirmPass = req.body.confirmPass;
      
      let customerExist = await Customer.findOne({
        mobile: mobile
      });
      
      if (!customerExist) 
        throw new Error('Mobile not register, please signUp.');
      

      if(newPassword != confirmPass)
        throw new Error('Passwords not matched..');
        
      const hashedPassword = passwordHash.generate(confirmPass);
        
      var query = {
              $set: {password: hashedPassword}
            };
      
      let updateCustomer = await Customer.findOneAndUpdate({
        mobile:mobile
      }, query,{new:true});

      if(!updateCustomer) throw new Error('Error in changing password.');
      res.json({
      success: true,
      message: 'Password changed successfully.'
          });

    }catch (err) {
      return res.json({
        success: false,
        message: "Invalid userID or password"
      })
    }
  }
	return result;
}
//**********************************************************************************************

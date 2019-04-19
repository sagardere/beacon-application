const passwordHash = require('password-hash');
const mongoose = require('mongoose');
const async = require('async');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let models = require('../models/index')();
var helper = require('../lib/helper')();
let User = models.user();

module.exports = () => {
  var result = {};

  //post
  result.register = async (req, res, next) => {

  // let firstname = req.body.firstname;
  // let middlename = req.body.middlename;
  // let lastname = req.body.lastname;
  // let email = req.body.email;
  // let password = req.body.password;
  // let role = req.body.role;
  // let manager = req.body.manager;
  // let token = req.body.token;
  // let dob = req.body.dob;
  // let gender = req.body.gender;
  console.log('Inside registration...');
  try {
      if (!req.body || !req.body.firstname) {
        throw new Error('firstname not defined.');
      }
      if (!req.body || !req.body.middlename) {
        throw new Error('middlename not defined.');
      }
      if (!req.body || !req.body.lastname) {
        throw new Error('lastname not defined.');
      }
      if (!req.body || !req.body.email) {
        throw new Error('Email not defined.');
      }
      if (!req.body || !req.body.password) {
        throw new Error('Password not defined.');
      }
      if (!req.body || !req.body.role) {
        throw new Error('role not defined.');
      }
      if (!req.body || !req.body.manager) {
        throw new Error('manager not defined.');
      }
      // if (!req.body || !req.body.dob) {
      //   throw new Error('DOB not defined.');
      // }
      if((req.body.dob != "") && (req.body.dob != undefined)){
          var dateofbirth = helper.stringToDate(req.body.dob);
          console.log("dateofbirth", dateofbirth);
      }
      if (!req.body || !req.body.gender) {
        throw new Error('Gender not defined.');
      }

      const firstname = req.body.firstname || '';
      const middlename = req.body.middlename || '';
      const lastname = req.body.lastname || '';
      const email = req.body.email;
      const password = req.body.password;
      const role = req.body.role || '';
      const manager = req.body.manager || '';
     // const dob = req.body.dob || '';
      const gender = req.body.gender || '';

      let userExist = await User.findOne({
        email: email
      });

    if (userExist) throw new Error('Email already exists.');
      const hashedPassword = passwordHash.generate(password);
      const user = new User({
       username:{
                  firstname:firstname,
                  middlename:middlename,
                  lastname:lastname
                },
                email:email,
                password: hashedPassword,
                role:role,
                manager:manager,
                dob: dateofbirth,
                gender:gender

      });

      //save user information in db
      let newUser = await user.save();
      if (!newUser) throw new Error('Error in user Registration...');
      res.json({
          success: true,
          message: "User successfully register..."
        });
    } catch (err) {
      return res.json({
        success: false,
        message: err.toString()
      })
    }

  }
  //Post
  result.login = async (req, res, next) => {
      console.log("Inside login");

    try {
      if (!req.body || !req.body.email) {
        throw new Error('Email not defined.');
      }

      if (!req.body || !req.body.password) {
        throw new Error('Password not defined.');
      }
      const email = req.body.email;
      const password = req.body.password;
      let userExist = await User.findOne({
        email: email
      })

      if (!userExist) {
        throw new Error('Email not register, please signUp.');
      }

      // var hashedPassword = passwordHash.generate(password);
      // console.log(hashedPassword);

      const newHashPass = (passwordHash.verify(password, userExist.password));
      if (!newHashPass) throw new Error('Incorrect password.');
      const Token = jwt.sign({
                email: userExist.email,
                _id: userExist._id
              },
              'secretkey', {
                expiresIn: '2h'
              });

            var query = {
              $set: {token: Token}
            };
            req.session.email = email;
            console.log(req.session.email);
            console.log(Token);
       let updateUser = await User.findOneAndUpdate({
              email: email
            }, query, {
              new: true
            });
       if(!updateUser) throw new Error('Error in updating user.');
       console.log(updateUser);
        res.json({
          success: true,
          data: {firstname: updateUser.username.firstname, email: updateUser.email, token: updateUser.token, id: updateUser._id},
       });
    } catch (err) {
      return res.json({
        success: false,
        message: "Invalid Email or Password"
      })
    }
  }


  //Post
  result.logout = (req, res, next) => {
    console.log("Inside logout...");


    User.update({_id: req.body.id}, {
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
  }
  return result;
}
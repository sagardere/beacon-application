const passwordHash = require('password-hash');
const mongoose = require('mongoose');
const async = require('async');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let models = require('../models/index')();
let User = models.user();

module.exports = () => {
  var result = {};

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
       let updateUser = await User.findOneAndUpdate({
              email: email
            }, query, {
              new: true
            });
       console.log(updateUser)
       if(!updateUser) throw new Error('Error in updating user.');
    res.json({
      success: true,
      data: {firstname: updateUser.username.firstname, email: updateUser.email, token: updateUser.token, id: updateUser._id}
    });
    } catch (err) {
      return res.json({
        success: false,
        message: "Invalid Email or Password"
      })
    }
  }

//***************************************************************************
result.changePassword = async (req,res, next) => {
  console.log("Inside change password");
  try{
    if (!req.body || !req.body.email) {
        throw new Error('Email not defined.');
      }

      if (!req.body || !req.body.newPassword) {
        throw new Error('newPassword not defined.');
      }

      if (!req.body || !req.body.confirmPass) {
        throw new Error('confirmPass not defined.');
      }

      const email = req.body.email;
      const newPassword = req.body.newPassword;
      const confirmPass = req.body.confirmPass;
      
      let userExist = await User.findOne({
        email: email
      });
      
      if (!userExist) 
        throw new Error('Email not register, please signUp.');
      

      if(newPassword != confirmPass)
        throw new Error('Passwords not matched..');
        
      const hashedPassword = passwordHash.generate(confirmPass);
        
      var query = {
              $set: {password: hashedPassword}
            };
      
      let updateUser = await User.findOneAndUpdate({
        email:email
      }, query,{new:true});

      if(!updateUser) throw new Error('Error in changing password.');
      res.json({
      success: true,
      message: 'Password changed successfully.'
          });

  } catch (err) {
      return res.json({
        success: false,
        message: "Invalid Email or Password"
      })
    }
}
//***************************************************************************
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
//***************************************************************************
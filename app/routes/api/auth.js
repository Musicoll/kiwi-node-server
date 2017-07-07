let router = require('express').Router();
let jwt = require('jsonwebtoken');
let utils = require('./utils');

const util = require('util')

const PRIVATE_KEY = require('config').private_key

// Get the user model
let User = require('../../models/User');

/**
 * POST /api/login endpoint route
 * Send a POST HTTP request to this endpoint providing a valid email/password key-pair to get an API access token.
 * @return {Object} A JSON object with an api access token if success,
 * otherwise a JSON Authentication failed message
 */
module.exports.login = function(req, res, next) {

  // find the user by email or username
  User.findOne({ $or:
    [ {email: req.body.email}, {username: req.body.username}]
  })
  .select('_id email +password')
  .then(user => {

    if(user) {

      user.comparePassword(req.body.password)
      .then(is_valid => {
        if(is_valid) {

          user = user.toObject();

          // think to remove the password field from the payload !
          //delete user['password'];

          const payload = {id: user._id}

          // user is found and password is right, create and return the token
          let token = jwt.sign(payload, PRIVATE_KEY, {
            expiresIn: '24h'
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Authentication success!',
            token: token
          });
        }
        else {
          console.log(`Authentication failed. Wrong password !`);
          utils.sendJsonError(res, "Authentication failed.", 401);
        }
      })
      .catch(err => {
        console.log(`Authentication failed. Wrong password ! ${err}`);
        utils.sendJsonError(res, "Authentication failed.", 401);
      })
    }
    else {
      console.log("Authentication failed. User not found.");
      utils.sendJsonError(res, "Authentication failed.", 401);
    }
  })
  .catch(err => {
    console.log(`Authentication failed. Error : ${err}`);
    utils.sendJsonError(res, "Authentication failed.", 401);
  })
}

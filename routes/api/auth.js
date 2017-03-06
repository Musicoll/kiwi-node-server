let router = require('express').Router();
let jwt = require('jsonwebtoken');
let utils = require('./utils');

const util = require('util')

const PRIVATE_KEY = require('../../private/config').private_key

// Get the user model
let User = require('../../models/User');

/**
 * POST /api/auth endpoint route
 * Send a POST HTTP request to this endpoint providing a valid email/password key-pair to get an API access token.
 * @return {Object} A JSON object with an api access token if success,
 * otherwise a JSON Authentication failed message
 */
router.post('/', (req, res) => {

  // find the user
  User.findOne({ email: req.body.email }).then((user) => {

    if(user) {

      user.comparePassword(req.body.password)
      .then((is_valid) => {
        if(is_valid) {

          user = user.toObject();

          // remove the password field from the token
          delete user['password'];

          // user is found and password is right, create and return the token
          let token = jwt.sign(user, PRIVATE_KEY, {
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
          utils.sendJsonError(res, "Authentication failed.", 500);
        }
      })
      .catch((err) => {
        console.log(`Authentication failed. Wrong password ! ${err}`);
        utils.sendJsonError(res, "Authentication failed.", 500);
      })
    }
    else {
      console.log("Authentication failed. User not found.");
      utils.sendJsonError(res, "Authentication failed.", 404);
    }
  })
  .catch((err) => {
    console.log(`Authentication failed. Error : ${err}`);
    utils.sendJsonError(res, "Authentication failed.", 404);
  })
});

/**
 * Verify the validity of a an access token
 */
function check() {
  return function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      // verifies secret and checks expiration date
      jwt.verify(token, PRIVATE_KEY, function(err, decoded) {
        if (err) {
          utils.sendJsonError(res, `Failed to authenticate token: ${err}`, 403);
        }
        else {

          // if everything is good, save to request for use in other routes
          req.authenticated = true;
          console.log(util.inspect(decoded, {showHidden: false, depth: null}))
          //req.user = decoded.user;
          console.log(`decoded.user : ${decoded.email}`);
          return next();
        }
      });
    }
    else {
      // if there is no token
      // return an error
      utils.sendJsonError(res, "No token provided", 403);
    }
  }
}

module.exports = {
  router: router,
  check: check
}

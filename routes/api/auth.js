let router = require('express').Router();
let jwt = require('jsonwebtoken');
let utils = require('./utils');

const PRIVATE_KEY = require('../../private/config').private_key

// Get the user model
let User = require('../../models/User');

// GET /
router.post('/', (req, res) => {

  // find the user
  User.findOne({ email: req.body.email }).then((user) => {

    if(user) {
      user.comparePassword(req.body.password)
      .then((is_valid) => {

        if(is_valid) {
          // user is found and password is right, create and return the token
          let token = jwt.sign(user, PRIVATE_KEY, {
            expiresIn: 86400 // expires in 24 hours
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

module.exports = router;

let router = require('express').Router();
let jwt = require('jsonwebtoken');
let utils = require('./utils');

const util = require('util')
const passport = require('passport')

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

  passport.authenticate('local', {session: false}, function(err, user, info) {
    if (err) { return next(err) }
    if (!user) { return res.status(401).json(info); }

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
  })(req, res, next);

}

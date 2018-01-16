const passport = require('passport')
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = require('config').private_key

const User = require('../../models/User').User;

/**
 * POST /api/login endpoint route
 * Send a POST HTTP request to this endpoint providing a valid email/password key-pair to get an API access token.
 * @return {Object} A JSON object with an api access token if success,
 * otherwise a JSON Authentication failed message
 */
module.exports.login = function(req, res, next) {

  passport.authenticate('local', {session: false}, function(err, auth_user, info) {
    if (err) { return next(err) }
    if (!auth_user) { return res.status(401).json(info); }

    User.findById(auth_user._id)
      .then(user => {

        const payload = {id: user._id}

        let user_obj = user.toObject();

        // user is found and password is right, create and return the token
        user_obj.token = jwt.sign(payload, PRIVATE_KEY, {
          expiresIn: '24h'
        });

        // Return user informations with the JWT.
        res.json({ user: user_obj });
      })
      .catch(err => {
        console.log(`User ${req.params.id} can not be find : ${err}`);
        utils.sendJsonError(res, `User ${req.params.id} can not be find`, 404);
      });

  })(req, res, next);

}

// auth.js

const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtStrategyParams = {
    secretOrKey: require('config').private_key,
		jwtFromRequest: ExtractJwt.fromExtractors([
			ExtractJwt.fromAuthHeaderWithScheme('JWT'),
		]),
};

const User = require('./models/User');

passport.use(new JwtStrategy(jwtStrategyParams, function(jwt_payload, done) {

	User.findOne({_id: jwt_payload.id}, function(err, user) {

		if (err || !user) {
			return done(err, false, {msg: "User not found!"});
		}

		return done(null, user);
	});
}))

module.exports = function() {

  return {
    initialize: () => passport.initialize(),

		authenticate: () => {
			return (req, res, next) => {

				passport.authenticate('jwt', (err, user, info) => {
					// err is useless here (always null !)

					if (info instanceof Error) {
						// (Code smell Warning) handle 'No Auth Token' error special case
						if(info.message && info.message == 'No auth token') {
								return res.status(403).json({
									name: 'NoAuthTokenError',
									message: 'Auth token is malformed or missing'
								});
						}
						else {
							return res.status(403).json(info);
						}
					}

					req.user = user;
					next();

				})(req, res, next)
			}
		}
  }

};

// auth.js

const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtStrategyParams = {
    secretOrKey: require('config').private_key,
		jwtFromRequest: ExtractJwt.fromExtractors([
			ExtractJwt.fromAuthHeaderWithScheme('JWT'),
		]),
};

const User = require('./models/User').User;

passport.use(new LocalStrategy({usernameField: 'username' }, function(username, password, done) {

	User.findOne({ $or: [ {email: username}, {username: username}] })
	.select('_id +password')
  .then(user => {

		if (!user) {
			// can't find username
			return done(null, false, { message: 'Bad email/username and password' });
		}

		user.comparePassword(password)
		.then(isMatch => {
			if (isMatch) {

				user = user.toObject();

		    // remove the password field from the payload !
		    delete user['password'];

				return done(null, user);
			}
			else {
				return done(null, false, { message: 'Invalid password.  Please try again.' });
			}
		})
		.catch(err => {
			return done(null, false, { message: 'Invalid password.  Please try again.' });
		});
	})
	.catch(err => {
		return done(null, false, { message: "can't find user" });
	})

}));

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

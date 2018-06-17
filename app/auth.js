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
	.select('_id + password + blacklisted')
  .then(user => {

		if (!user) {
			// can't find username
			return done(null, false, { message: 'Bad email/username and password' });
		}
        else if(user.blacklisted == true){
            return done(null, false, {message: 'User is blacklisted'});
        }

		user.comparePassword(password)
		.then(isMatch => {
			if (isMatch) {

				user = user.toObject();

		    // remove the password field from the payload !
		    delete user['password'];
            delete user['blacklisted'];

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

    User.findOne({_id: jwt_payload.id})
    .select('_id + blacklisted')
    .then(user => {

        if (user && user.blacklisted == false){
            return done(null, {_id: user._id})
        }
        else {
            return done(null, false, new Error("User is blacklisted"));
        }
    })
    .catch(err => {
        return done(err, false, {msg: "User not found!"});
    })
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

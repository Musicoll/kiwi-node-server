let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('./models/User');

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy({usernameField: 'email' }, function(email, password, done) {

	User.findOne({ email: email })
	.select('_id email +password')
  .then(user => {

		if (!user) {
			return done(null, false, { msg: 'No user with the email ' + email + ' was found.' });
		}

		user.comparePassword(password)
		.then(isMatch => {
			if (isMatch) {
				return done(null, user);
			}
			else {

				return done(null, false, { msg: 'Invalid password.  Please try again.' });
			}
		})
		.catch(err => {
			return done(null, false, { msg: 'Invalid password.  Please try again.' });
		});
	})
	.catch(err => {
		return done(null, false, { msg: "can't find user" });
	})

}));

exports.isAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	//req.flash('info', { msg: "You must be logged in to visit that page." });
	res.redirect('/login');
};

var LocalStrategy		= require('passport-local').Strategy,
	User				= require('../models/user'),
	msg					= require('../config/messages_constants'),
	db					= require('../config/database'),
	flashConstants		= require('../config/flash_constants'),
	passportConstants	= require('../config/passport_constants');
	
module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	
	passport.use(passportConstants.local_signup, new LocalStrategy({
		usernameField : db.username_field,
		passwordField : db.password_field,
		passReqToCallback : true
	},
	function(req, email, password, done) {
		process.nextTick(function() {
			User.findOne(User.generateSearchObject(email), function(err, user) {
				if (err) return done(err);
				if (user) return done(null, false, req.flash(flashConstants.signup, msg.email_taken));
				var newUser = new User();
				newUser.local.email = email;
				newUser.local.password = newUser.generateHash(password);
				newUser.local.admin = false;
				newUser.save(function(err) {
					if (err) throw err;
					return done(null, newUser);
				});
			});
		});
	}));
	
	passport.use(passportConstants.local_login, new LocalStrategy({
		usernameField : db.username_field,
		passwordField : db.password_field,
		passReqToCallback : true
	},
	function(req, email, password, done) {
		User.findOne(User.generateSearchObject(email), function(err, user) {
			if (err) return done(err);
			if (!user) return done(null, false, req.flash(flashConstants.login, msg.no_user));
			if (!user.validPassword(password)) return done(null, false, req.flash(flashConstants.login, msg.bad_password));
			return done(null, user);
		});
	}));
};
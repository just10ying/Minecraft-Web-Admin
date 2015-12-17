var fs 					= require('fs'),
	flashConstants		= require('../config/flash_constants'),
	passportConstants 	= require('../config/passport_constants');

module.exports = function(app, passport) {
	app.get('/', function(req, res) {
		res.render('index.ejs', { user: req.user,
								  message: req.flash(flashConstants.login)
								});
	});
	
	app.get('/login', function(req, res) {
		res.render('login.ejs', {
								  message: req.flash(flashConstants.login)
								});
	});
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash(flashConstants.signup) });
	});
	
	app.post('/signup', passport.authenticate(passportConstants.local_signup, {
		successRedirect : '/',
		failureRedirect : '/signup',
		failureFlash : true
	}));
	
	app.post('/login', passport.authenticate(passportConstants.local_login, {
		successRedirect : '/',
		failureRedirect : '/login',
		failureFlash : true
	}));
};
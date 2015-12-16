var fs = require('fs');

module.exports = function(app, passport) {
	app.get('/', function(req, res) {
		res.render('index.ejs', { admin: false,
								  user: req.user,
								  message: req.flash('loginMessage')
								});
	});
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});
	
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/',
		failureRedirect : '/signup',
		failureFlash : true
	}));
	
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/',
		failureRedirect : '/',
		failureFlash : true
	}));
};
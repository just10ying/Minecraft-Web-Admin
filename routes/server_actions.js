var express 			= require('express'),
	msg					= require('../config/messages_constants'),
	minecraftService 	= require('../config/minecraft_service'),
	router 				= express.Router();

// ----------------------------------- Routing ----------------------------------- //
router.get('/server_status', function(req, res) {
	res.send(minecraftService.getStatus());
});

router.post('/start_server', isLoggedIn, function(req, res) {
	minecraftService.create().then(function() {
		res.send(msg.success);
	}, function() {
		res.send(msg.failure);
	});
});

router.post('/stop_server', isLoggedIn, function(req, res) {
	minecraftService.stop().then(function() {
		res.send(msg.success);
	}, function() {
		res.send(msg.failure);
	});
});

router.post('/exec_command', isLoggedIn, function(req, res) {
	minecraftService.sendCommand(req.body.command).then(function() {
		res.send(msg.success);
	}, function() {
		res.send(msg.failure);
	});
});

module.exports = router;

// ----------------------------------- Helper Functions ----------------------------------- //

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated() && req.user.local.admin) return next();
	res.send(msg.admin_required);
}
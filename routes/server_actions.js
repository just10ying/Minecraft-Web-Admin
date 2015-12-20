var express 			= require('express'),
	msg					= require('../config/messages_constants'),
	minecraftService 	= require('../services/minecraft_service'),
	router 				= express.Router();

// ----------------------------------- Routing ----------------------------------- //
router.get('/server_status', function(req, res) {
	res.send(minecraftService.getStatus());
});

router.get('/online_players', function(req, res) {
	res.send(minecraftService.getPlayers());
});

router.post('/start_server', isLoggedIn, function(req, res) {
	minecraftService.create().then(
		respondSuccess.bind(res), 
		respondFailure.bind(res)
	);
});

router.post('/stop_server', isLoggedIn, function(req, res) {
	minecraftService.stop().then(
		respondSuccess.bind(res), 
		respondFailure.bind(res)
	);
});

router.post('/exec_command', isLoggedIn, function(req, res) {
	minecraftService.sendCommand(req.body.command).then(function(output) {
		res.send(output);
	},	respondFailure.bind(res));
});

module.exports = router;

// ----------------------------------- Helper Functions ----------------------------------- //

// Note: to use respondSuccess and respondFailure,
// you'll have to bind the response object to these functions.
function respondSuccess() {
	this.send(msg.success);
}

function respondFailure() {
	this.send(msg.failure);
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated() && req.user.local.admin) return next();
	res.send(msg.admin_required);
}
var express 	= require('express'),
	minecraft	= require('../config/minecraft'),
	msg			= require('../config/messages_constants'),
	appSettings	= require('../config/app_settings'),
	server		= require('http').createServer(),
	spawn		= require('child_process').spawn,
	io 			= require('socket.io')(server),
	router 		= express.Router();
	
var minecraftProcess = null;

// ----------------------------------- Routing ----------------------------------- //
router.get('/server_status', function(req, res) {	
	res.send(minecraftProcess == null ? msg.offline : msg.online);
});

router.post('/start_server', isLoggedIn, function(req, res) {
	if (minecraftProcess == null) {
		minecraftProcess = createNewMinecraftProcess();
		updateServerStatus(minecraft.server_online);
		res.send(msg.success);
	}
	else {
		res.send(msg.failure);
	}
});

router.post('/stop_server', isLoggedIn, function(req, res) {	
	if (minecraftProcess != null) {
		minecraftProcess.kill('SIGINT');
		updateServerStatus(minecraft.server_offline);
		minecraftProcess = null;
		res.send(msg.success);
		
	}
	else {
		res.send(msg.failure);
	}
});

router.post('/exec_command', isLoggedIn, function(req, res) {
	if (minecraftProcess != null) {
		var command = req.body.command;
		minecraftProcess.stdin.write('/say hello\n');
		res.send(msg.success);
	}
	else {
		res.send(msg.failure);
	}	
});

module.exports = router;

// ----------------------------------- Websockets ----------------------------------- //
var serverStatus = null;
function updateServerStatus(newStatus) {
	serverStatus = newStatus;
	io.sockets.emit(minecraft.state_change, serverStatus);
}

server.listen(appSettings.websocketPort);

// ----------------------------------- Helper Functions ----------------------------------- //
function createNewMinecraftProcess() {
	var server = spawn(minecraft.server_start_cmd, 
				 	   minecraft.server_start_args,
					   {cwd: minecraft.server_directory});
	server.stdin.setEncoding('utf-8');
	return server;
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated() && req.user.local.admin) return next();
	res.send(msg.admin_required);
}
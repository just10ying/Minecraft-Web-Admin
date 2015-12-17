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
		createNewMinecraftProcess();
		res.send(msg.success);
	}
	else {
		res.send(msg.failure);
	}
});

router.post('/stop_server', isLoggedIn, function(req, res) {	
	if (minecraftProcess != null) {
		killMinecraftProcess();
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
	server.stdout.on('data', function(buf) {
		if (buf.toString().match(minecraft.server_online_regex) !== null) {
			// When we find a match that indicates the server is online, broadcast this event.
			updateServerStatus(minecraft.server_online);
		}
	});
	minecraftProcess = server;
	updateServerStatus(minecraft.server_starting);
}

function killMinecraftProcess() {
	minecraftProcess.kill('SIGINT');
	updateServerStatus(minecraft.server_offline);
	minecraftProcess = null;
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated() && req.user.local.admin) return next();
	res.send(msg.admin_required);
}
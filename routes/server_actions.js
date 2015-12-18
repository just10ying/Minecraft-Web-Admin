var express 	= require('express'),
	minecraft	= require('../config/minecraft'),
	msg			= require('../config/messages_constants'),
	appSettings	= require('../config/app_settings'),
	server		= require('http').createServer(),
	spawn		= require('child_process').spawn,
	io 			= require('socket.io')(server),
	router 		= express.Router();
	
server.listen(appSettings.websocketPort);

// ----------------------------------- Minecraft Server Singleton ----------------------------------- //
var minecraftProcess = (function() {
	var process = null; // Initially no process
	var server_status = minecraft.state.offline; // Initially offline
	var shutdownCallback = null;
	var setStatus = function(newStatus) {
		server_status = newStatus;
		io.sockets.emit(minecraft.state_change, server_status);
	};
	
	var publicMethods = new Object;
	publicMethods.create = function() {
		process = spawn(minecraft.server_start_cmd, 
					   minecraft.server_start_args,
				       {cwd: minecraft.server_directory});
					   process.stdin.setEncoding('utf-8');
		process.stdout.on('data', function(buf) {
			// When we find a match that indicates the server is online, broadcast this event.
			if (buf.toString().match(minecraft.server_online_regex) !== null) {
				setStatus(minecraft.state.online);
			}
		});
		process.on('exit', function() {
			process = null;
			setStatus(minecraft.state.offline);
			if (shutdownCallback !== null) {
				shutdownCallback();
				shutdownCallback = null;
			}
		});
		setStatus(minecraft.state.starting);
	};
	
	publicMethods.sendCommand = function(command) {
		if (process != null) {
			process.stdin.write(command + '\n');
		}
	};
	
	publicMethods.getStatus = function() {
		return server_status;
	};
	
	publicMethods.stop = function(callback) {
		setStatus(minecraft.state.stopping);
		this.sendCommand(minecraft.server_stop_cmd);
		shutdownCallback = callback;
	};
	return publicMethods;
})();

// ----------------------------------- Routing ----------------------------------- //
router.get('/server_status', function(req, res) {
	res.send(minecraftProcess.getStatus());
});

router.post('/start_server', isLoggedIn, function(req, res) {
	if (minecraftProcess.getStatus() === minecraft.state.offline) {
		minecraftProcess.create();
		res.send(msg.success);
	}
	else {
		res.send(msg.failure);
	}
});

router.post('/stop_server', isLoggedIn, function(req, res) {	
	if (minecraftProcess.getStatus() === minecraft.state.online) {
		minecraftProcess.stop(function() {
			res.send(msg.success);
		});
	}
	else {
		res.send(msg.failure);
	}
});

router.post('/exec_command', isLoggedIn, function(req, res) {
	if (minecraftProcess.getStatus() === minecraft.state.online) {
		minecraftProcess.sendCommand(req.body.command);
		res.send(msg.success);
	}
	else {
		res.send(msg.failure);
	}	
});

module.exports = router;

// ----------------------------------- Helper Functions ----------------------------------- //

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated() && req.user.local.admin) return next();
	res.send(msg.admin_required);
}
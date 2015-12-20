var minecraft	= require('../config/minecraft'),
	appSettings	= require('../config/app_settings'),
	msg			= require('../config/messages_constants'),
	spawn		= require('child_process').spawn,
	server		= require('http').createServer(),
	minecraftIO	= require('../services/minecraft_stdio_service'),
	io			= require('socket.io')(server);
	
server.listen(appSettings.websocketPort);

var process = null; // Initially no process
var serverStatus = minecraft.state.offline; // Initially offline
var onlinePlayers = [];

// -------------------------------- Private Handler Functions -------------------------------- //
function setStatus(newStatus) {
	serverStatus = newStatus;
	io.sockets.emit(minecraft.socket.server_state_change, serverStatus);
}

// ------------------------------ Register Handlers ----------------------------- //

var stdoutHandlers = {
	handlers: [],
	add: function(regex, callback) {
		stdoutHandlers.handlers.push({
			regex: regex,
			callback: callback
		});
	}
};

stdoutHandlers.add(minecraft.regex.server_online, function() {
	setStatus(minecraft.state.online);
});

stdoutHandlers.add(minecraft.regex.player_join, function(match) {
	var name = match[1];
	onlinePlayers.push(name);
	io.sockets.emit(minecraft.socket.users_change, onlinePlayers);
});

stdoutHandlers.add(minecraft.regex.player_leave, function(match) {
	var name = match[1];
	var index = onlinePlayers.indexOf(name);
	onlinePlayers.splice(index, 1);
	io.sockets.emit(minecraft.socket.users_change, onlinePlayers);
});


// -------------------------------- Public Service -------------------------------- //
module.exports = {
	create: function() {
		return new Promise(function(fulfill, reject) {
			if (serverStatus !== minecraft.state.offline) {
				reject();
			}
			else {
				process = spawn(minecraft.server_start_cmd, 
								minecraft.server_start_args,
								{cwd: minecraft.server_directory});
								process.stdin.setEncoding('utf-8');
				minecraftIO.registerProcess(process);
				
				// Register stdout handlers:
				stdoutHandlers.handlers.forEach(function(handler) {
					minecraftIO.onStdout(handler.regex, handler.callback);
				});
				process.on('exit', function() {
					process = null;
					setStatus(minecraft.state.offline);
				});
				setStatus(minecraft.state.starting);
				fulfill();
			}
		});
	},
	
	sendCommand: function(command) {
		return new Promise(function(fulfill, reject) {
			if (process === null || serverStatus !== minecraft.state.online) {
				reject();
			}
			else {
				minecraftIO.sendStdin(command + '\n').then(function(response) {
					fulfill(response);
				}, reject);
			}
		});
	},
	
	getStatus: function() {
		return serverStatus;
	},
	
	getPlayers: function() {
		return onlinePlayers;
	},
	
	stop: function() {
		return new Promise(function(fulfill, reject) {
			module.exports.sendCommand(minecraft.server_stop_cmd).then(function() {
				setStatus(minecraft.state.stopping);
				fulfill();
			}, reject);
		});
	}
};
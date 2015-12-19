var minecraft	= require('../config/minecraft'),
	appSettings	= require('../config/app_settings'),
	msg			= require('../config/messages_constants'),
	spawn		= require('child_process').spawn,
	server		= require('http').createServer(),
	minecraftIO	= require('../services/minecraft_stdio_service'),
	io			= require('socket.io')(server);
	
server.listen(appSettings.websocketPort);

var process = null; // Initially no process
var server_status = minecraft.state.offline; // Initially offline

function setStatus(newStatus) {
	server_status = newStatus;
	io.sockets.emit(minecraft.state_change, server_status);
}

module.exports = {
	create: function() {
		return new Promise(function(fulfill, reject) {
			if (server_status !== minecraft.state.offline) {
				reject();
			}
			else {
				process = spawn(minecraft.server_start_cmd, 
								minecraft.server_start_args,
								{cwd: minecraft.server_directory});
								process.stdin.setEncoding('utf-8');
				minecraftIO.registerProcess(process);
				minecraftIO.onStdout(minecraft.server_online_regex, function() {
					setStatus(minecraft.state.online);
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
			if (process === null || server_status !== minecraft.state.online) {
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
		return server_status;
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
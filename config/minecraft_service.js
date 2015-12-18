var minecraft	= require('./minecraft'),
	appSettings	= require('./app_settings'),
	msg			= require('./messages_constants'),
	spawn		= require('child_process').spawn,
	server		= require('http').createServer(),
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
				process.stdout.on('data', function(buf) {
					// When we find a match that indicates the server is online, broadcast this event.
					if (buf.toString().match(minecraft.server_online_regex) !== null) {
						setStatus(minecraft.state.online);
					}
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
				process.stdin.write(command + '\n');
				fulfill();
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
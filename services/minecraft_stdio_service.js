var minecraftConstants = require('../config/minecraft');

var stdoutListeners = [];
var commandQueue = [];
var process = null;
var messageBuffer = null;

function getCommandDelay(command) {
	var delay = minecraftConstants.commandDelays[command];
	if (typeof delay === 'undefined') return minecraftConstants.default_command_delay;
	return delay;
}

module.exports = {
	registerProcess: function(proc) {
		process = proc;
		
		process.stdout.on('data', function(buf) {
			var outString = buf.toString();
			stdoutListeners.forEach(function(listener) {
				if (outString.match(listener.regex)) {
					listener.callback();
				}
			});
			
			if (messageBuffer !== null) {
				messageBuffer += outString;
			}
		});
	},
	
	// Register a listener on stdout:
	// Whenever stdout contains the given regex, the callback will fire.
	onStdout: function(regex, callback) {
		stdoutListeners.push({ regex: regex,
							   callback: callback });
	},
	
	// Sends a command on stdin.
	// Returns the next n milliseconds of stdout to the callback function.
	// Not the best way of getting data back, but it'll do for now.
	sendStdin: function(command, n) {
		return new Promise(function(fulfill, reject) {
			if (messageBuffer != null) {
				reject();
			}
			else {
				messageBuffer = '';
				process.stdin.write(command);
				var delay = (typeof n === 'undefined') ? getCommandDelay(command) : n;
				setTimeout(function() {
					var msg = messageBuffer.substring(0, messageBuffer.length);
					messageBuffer = null;
					fulfill(msg);
				}, delay);
			}
		});
	}
};


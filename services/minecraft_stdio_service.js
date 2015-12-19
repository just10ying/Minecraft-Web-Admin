// This is a singleton object (or should be).
// Any registration of a process overwrites any existing process.

var minecraftConstants = require('../config/minecraft');

var stdoutListeners = [];
var process = null;
var messageBuffer = null;

function getCommandDelay(command) {
	var delay = minecraftConstants.command_delays[command];
	if (typeof delay === 'undefined') return minecraftConstants.default_command_delay;
	return delay;
}

module.exports = {
	registerProcess: function(proc) {
		process = proc;
		messageBuffer = null;
		
		process.stdout.on('data', function(buf) {
			var outString = buf.toString();
			stdoutListeners.forEach(function(listener) {
				var matches = outString.match(listener.regex);
				if (matches) {
					listener.callback(matches, outString);
				}
			});
			
			if (messageBuffer !== null) {
				messageBuffer += outString;
			}
		});
	},
	
	// Register a listener on stdout:
	// Whenever stdout contains the given regex, the callback will fire.
	// Callback is passed an array:
		// The first argument is the entire string that matched the regex
		// The second argument is just the portion of that expression that was requested.
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


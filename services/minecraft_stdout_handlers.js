var minecraft	= require('../config/minecraft');
var io = null;
var publicAttributes = {
	handlers: [],
	add: function(regex, callback) {
		publicAttributes.handlers.push({
			regex: regex,
			callback: callback
		});
	}
};

module.exports = function(socketIO) {
	io = socketIO;
	return publicAttributes;
};

/* ---------------------------- Player Count Handler ---------------------------- */
(function() {
	var onlinePlayers = [];
	
	var broadcastData = function() {
		io.sockets.emit(minecraft.socket.users_change, {
			onlinePlayers: onlinePlayers,
		});
	};
	
	publicAttributes.add(minecraft.regex.player_join, function(match) {
		var playerName = match[1];
		onlinePlayers.push(playerName);
		broadcastData();
	});
	
	publicAttributes.add(minecraft.regex.player_leave, function(match) {
		var playerName = match[1];
		var index = onlinePlayers.indexOf(playerName);
		onlinePlayers.splice(index, 1); // Remove players from online players.
		broadcastData();
	});
})();
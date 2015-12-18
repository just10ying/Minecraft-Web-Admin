var fs			= require('fs'),
	minecraft 	= require('./minecraft'),
	msg			= require('./messages_constants'),
	constPath	= './public/constants.js';
	
var constData = (function(){
	var startString = 'var constants = {\n';
	var dataString = '';
	var endString	= '};';
	
	var publicMethods = new Object();
	publicMethods.addObject = function(key, value) {
		dataString += '    ' + key + ': ' + JSON.stringify(value) + ',\n';
	};
	
	publicMethods.toOutputString = function() {
		return startString + dataString.substring(0, dataString.length - 2) + '\n' + endString;
	};
	
	return publicMethods;
	
})();

constData.addObject('server_state', minecraft.state);
constData.addObject('server_state_change', minecraft.state_change);
constData.addObject('result', {
	success: msg.success,
	failure: msg.failure
});

fs.writeFileSync(constPath, constData.toOutputString(), {flags: 'w+'});
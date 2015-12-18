var fs			= require('fs'),
	minecraft 	= require('./minecraft')
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

fs.writeFileSync(constPath, constData.toOutputString(), {flags: 'w+'});
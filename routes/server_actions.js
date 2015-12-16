var express 	= require('express'),
	constants	= require('../constants'),
	spawn		= require('child_process').spawn;
var router = express.Router();

var minecraftProcess = null;

router.get('/server_status', function(req, res) {	
	res.send(minecraftProcess == null ? 'offline' : 'online');
});

router.post('/start_server', function(req, res) {
	if (minecraftProcess == null) {
		minecraftProcess = createNewMinecraftProcess();
		res.send('Server spawned.');
	}
	else {
		res.send('Server already active.');
	}
});

router.post('/stop_server', function(req, res) {	
	if (minecraftProcess != null) {
		minecraftProcess.kill('SIGINT');
		minecraftProcess = null;
		res.send('Server stopped.');
		
	}
	else {
		res.send('No server running.');
	}
});

router.post('/exec_command', function(req, res) {
	if (minecraftProcess != null) {
		minecraftProcess.stdin.write('/say hello\n');
	}
	else {
		
	}	
	var command = req.body.command;
	res.send('Command acknowledged.');
});

function createNewMinecraftProcess() {
	var server = spawn(constants.server_start_cmd, 
				 	   constants.server_start_args,
					   {cwd: constants.server_directory});
	server.stdin.setEncoding('utf-8');
	return server;
}

module.exports = router;
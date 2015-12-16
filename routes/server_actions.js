var express 	= require('express'),
	minecraft	= require('../config/minecraft'),
	spawn		= require('child_process').spawn;
var router = express.Router();

var minecraftProcess = null;

router.get('/server_status', function(req, res) {	
	res.send(minecraftProcess == null ? 'offline' : 'online');
});

router.post('/start_server', isLoggedIn, function(req, res) {
	if (minecraftProcess == null) {
		minecraftProcess = createNewMinecraftProcess();
		res.send('Server spawned.');
	}
	else {
		res.send('Server already active.');
	}
});

router.post('/stop_server', isLoggedIn, function(req, res) {	
	if (minecraftProcess != null) {
		minecraftProcess.kill('SIGINT');
		minecraftProcess = null;
		res.send('Server stopped.');
		
	}
	else {
		res.send('No server running.');
	}
});

router.post('/exec_command', isLoggedIn, function(req, res) {
	if (minecraftProcess != null) {
		minecraftProcess.stdin.write('/say hello\n');
	}
	else {
		
	}	
	var command = req.body.command;
	res.send('Command acknowledged.');
});

function createNewMinecraftProcess() {
	var server = spawn(minecraft.server_start_cmd, 
				 	   minecraft.server_start_args,
					   {cwd: minecraft.server_directory});
	server.stdin.setEncoding('utf-8');
	return server;
}

function isLoggedIn(req, res, next) {
	console.log(req.isAuthenticated());
	if (req.isAuthenticated() && req.user.admin) return next();
	res.send('You must log in as an administrator to perform this action.');
}

module.exports = router;
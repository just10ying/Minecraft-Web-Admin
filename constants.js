function define(name, value) {
	Object.defineProperty(exports, name, {
		value:	value,
		enumerable: true
	});
}

define('port', 3000);
define('debug', true);
define('server_directory', '/home/just10ying/minecraft');
define('server_start_cmd',  'java');
define('server_start_args', ['-Xmx1024M', '-Xms1024M', '-jar', 'minecraft_server.1.8.9.jar', 'nogui']);
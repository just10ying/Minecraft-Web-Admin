module.exports = {
	state_change: 'state_change',
	server_online_regex: 'For help, type "help"',
	state: {
		offline: 'offline',
		starting: 'starting',
		online: 'online',
		stopping: 'stopping'
	},
	server_directory: '/home/just10ying/minecraft',
	server_start_cmd: 'java',
	server_stop_cmd: 'stop',
	server_start_args: [
		'-Xmx1024M', '-Xms1024M', '-jar', 'minecraft_server.1.8.9.jar', 'nogui'
	]
};
var regex_base = '\\[.*\\] \\[.*\\]: ';

module.exports = {
	socket: {
		server_state_change: 'state_change',
		users_change: 'users_change'
	},
	regex: {
		server_online: 'For help, type "help"',
		player_join: regex_base + '(.*) joined the game',
		player_leave: regex_base + '(.*) left the game'
	},
	default_command_delay: 50,
	command_delays: {
		'/example': 150
	},
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
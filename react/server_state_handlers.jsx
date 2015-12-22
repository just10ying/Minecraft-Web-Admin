var serverStateHandlers = {
	getInitialState: function() {
		return {
			serverState: null
		};
	},
	
	// Factory: React will use .bind() on this function to pass in the correct context.
	makeComponentDidMount: function() {
		return function() {
			socket.on('connect', function(msg) {
				$.get('/server_status', function(data) {
					this.setState({
						serverState: data
					});
				}.bind(this));
			}.bind(this));
			socket.on(constants.socket.server_state_change, function(msg){
				this.setState({
					serverState: msg
				});
			}.bind(this));
			socket.on('disconnect', function() {
				this.setState({
					serverState: null
				});
			}.bind(this));
		};
	}
};
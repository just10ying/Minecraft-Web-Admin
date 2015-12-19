
var serverStateHandlers = {
	getInitialState: function() {
		return {
			serverState: null
		};
	},
	
	// Factory: React will use .bind() on this function to pass in the correct context.
	makeComponentDidMount: function() {
		return function() {
			$.get('/server_status', function(data) {
				this.setState({
					serverState: data
				});
			}.bind(this));
			socket.on(constants.socket.server_state_change, function(msg){
				this.setState({
					serverState: msg
				});
			}.bind(this));
		};
	}
};
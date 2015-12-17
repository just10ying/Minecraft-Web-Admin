
var ServerStatus = React.createClass({displayName: "ServerStatus",
	getInitialState: function() {
		return {
			server_state: null
		};
	},
	
	componentDidMount: function() {
		$.get('/server_status', function(data) {
			this.setState({
				server_state: data
			});
		}.bind(this));
		socket.on(SERVER_STATE_CHANGE, function(msg){
			this.setState({
				server_state: msg
			});
		}.bind(this));
	},
	
	currentState: function() {
		if (this.state.server_state == null) return 'fetching...';
		return this.state.server_state;
	},
	
	getStatusStyle: function() {
		var color = 'red';
		if (this.state.server_state == null) color = 'yellow';
		else if (this.state.server_state == 'online') color = 'green';
		
		return {
			color: color
		};
	},

	render: function() {
		return (
			React.createElement("span", null, 'Server status: ', 
				React.createElement("span", {style: this.getStatusStyle()}, 
					this.currentState()
				)
			)
		);
	}
});

ReactDOM.render(React.createElement(ServerStatus, null), 
				document.getElementById('server-status-container'));

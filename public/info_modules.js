
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
		if (this.state.server_state == null) return 'Fetching...';
		return this.state.server_state;
	},

	render: function() {
		return (
			React.createElement("h1", null, "Server status: ", this.currentState())
		);
	}
});

ReactDOM.render(React.createElement(ServerStatus, null), 
				document.getElementById('info-container'));
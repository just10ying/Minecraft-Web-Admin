var ServerStatus = React.createClass({
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
			<h1>Server status: {this.currentState()}</h1>
		);
	}
});

ReactDOM.render(<ServerStatus />, 
				document.getElementById('info-container'));
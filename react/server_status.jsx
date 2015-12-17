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
		if (this.state.server_state == null) return 'fetching...';
		return this.state.server_state;
	},
	
	getStatusStyle: function() {
		var color = 'yellow'; // By default, color for unlisted states is yellow.
		if (this.state.server_state == 'offline') color = 'red';
		else if (this.state.server_state == 'online') color = 'green';
		
		return {
			color: color
		};
	},

	render: function() {
		return (
			<span>{'Server status: '}
				<span style={this.getStatusStyle()}>
					{this.currentState()}
				</span>
			</span>
		);
	}
});

ReactDOM.render(<ServerStatus />, 
				document.getElementById('server-status-container'));

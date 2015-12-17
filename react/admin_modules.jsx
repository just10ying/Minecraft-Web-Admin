var StartButton = React.createClass({

	getInitialState: function() {
		return {server_state: null};
	},
	
	componentDidMount: function() {
		$.get('/server_status', function(data) {
			this.setState({
				server_state: data
			});
		}.bind(this));
	},
	
	startServer: function() {
		$.post('/start_server', function(data) {
			alert(data);
		});
	},
	
	render: function() {
		return (
			<button className="startButton" onClick={this.startServer} 
					disabled={this.state.server_state != 'offline'} >
				Start Server
			</button>
		);
	}
});

var StopButton = React.createClass({
	render: function() {
		return (
			<button className="startButton">Stop Server</button>
		);
	}
});


ReactDOM.render(<div>
					<StartButton />
					<StopButton />
				</div>, 
				document.getElementById('admin-container'));
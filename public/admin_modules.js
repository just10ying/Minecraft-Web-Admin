
var StartButton = React.createClass({displayName: "StartButton",

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
			React.createElement("button", {className: "startButton", onClick: this.startServer, 
					disabled: this.state.server_state != 'offline'}, 
				"Start Server"
			)
		);
	}
});

var StopButton = React.createClass({displayName: "StopButton",
	render: function() {
		return (
			React.createElement("button", {className: "startButton"}, "Stop Server")
		);
	}
});


ReactDOM.render(React.createElement("div", null, 
					React.createElement(StartButton, null), 
					React.createElement(StopButton, null)
				), 
				document.getElementById('admin-container'));
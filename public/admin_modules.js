
var StartServerButton = React.createClass({displayName: "StartServerButton",

	getInitialState: function() {
		return {server_state: null};
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
	
	startServer: function() {
		$.post('/start_server', function(data) {
			
		}.bind(this));
	},
	
	isDisabled: function() {
		return this.state.server_state !== 'offline';
	},
	
	render: function() {
		return (
			React.createElement("button", {className: "startServerButton btn btn-success", onClick: this.startServer, 
					disabled: this.isDisabled()}, 
				"Start Server"
			)
		);
	}
});

var StopServerButton = React.createClass({displayName: "StopServerButton",
	getInitialState: function() {
		return {server_state: null};
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
	
	stopServer: function() {
		$.post('/stop_server', function(data) {
			
		}.bind(this));
	},
	
	isDisabled: function() {
		return this.state.server_state !== 'online';
	},

	render: function() {
		return (
			React.createElement("button", {className: "stopServerButton btn btn-danger", onClick: this.stopServer, 
					disabled: this.isDisabled()}, 
				"Stop Server"
			)
		);
	}
});


ReactDOM.render(React.createElement("div", null, 
					React.createElement(StartServerButton, null), 
					React.createElement(StopServerButton, null)
				), 
				document.getElementById('admin-container'));
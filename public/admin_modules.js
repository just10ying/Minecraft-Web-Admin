
// Dependency: serverStateHandlers

var StartServerButton = React.createClass({displayName: "StartServerButton",

	getInitialState: serverStateHandlers.getInitialState,
	componentDidMount: serverStateHandlers.makeComponentDidMount(),
	
	startServer: function() {
		$.post('/start_server');
	},
	
	isDisabled: function() {
		return this.state.server_state !== constants.server_state.offline;
	},
	
	render: function() {
		return (
			React.createElement("button", {className: "btn btn-success", 
					onClick: this.startServer, 
					disabled: this.isDisabled()}, 
					
					"Start Server"
					
			)
		);
	}
});

var StopServerButton = React.createClass({displayName: "StopServerButton",
	getInitialState: serverStateHandlers.getInitialState,
	componentDidMount: serverStateHandlers.makeComponentDidMount(),
		
	stopServer: function() {
		$.post('/stop_server');
	},
	
	isDisabled: function() {
		return this.state.server_state !== constants.server_state.online;
	},

	render: function() {
		return (
			React.createElement("button", {className: "btn btn-danger", 
					onClick: this.stopServer, 
					disabled: this.isDisabled()}, 
				
					"Stop Server"
					
			)
		);
	}
});

var adminContainer = document.getElementById('admin-container');
if (typeof adminContainer !== 'undefined') {
	ReactDOM.render(React.createElement("div", null, 
						React.createElement(StartServerButton, null), 
						React.createElement(StopServerButton, null)
					), 
					adminContainer);
}
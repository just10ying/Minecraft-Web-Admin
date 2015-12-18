
// Dependency: serverStateHandlers

var ServerButtonStyle = {
	width: '50%'
};

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
					style: ServerButtonStyle, 
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
					style: ServerButtonStyle, 
					disabled: this.isDisabled()}, 
				
					"Stop Server"
					
			)
		);
	}
});

var ServerCommandInput = React.createClass({displayName: "ServerCommandInput",
	getInitialState: function() {
		var defaultState = serverStateHandlers.getInitialState();
		defaultState.commandInFlight = false;
		defaultState.commandValue = '';
		return defaultState;
	},
	componentDidMount: serverStateHandlers.makeComponentDidMount(),
	
	isDisabled: function() {
		return this.state.server_state !== constants.server_state.online || this.state.commandInFlight;
	},
	
	handleCommandChange: function(e) {
		this.setState({ commandValue : e.target.value });
	},
	
	handleSubmit: function(e) {
		e.preventDefault();
		if (this.state.commandValue.length > 0) {
			this.setState({ commandInFlight : true });
			$.post('/exec_command', { command : this.state.commandValue }, function(data) {
				this.setState({
					commandValue : '',
					commandInFlight : false
				});
				if (data !== constants.result.success) alert('Error: command failed!');
				React.findDOMNode(this.refs.commandInput).focus();
			}.bind(this));
		}
	},
	
	render: function() {
		return (
			React.createElement("form", {role: "form", onSubmit: this.handleSubmit}, 
				React.createElement("div", {className: "input-group"}, 
					React.createElement("span", {className: "input-group-addon", id: "command-addon"}, "Command:"), 
					React.createElement("input", {type: "text", 
						ref: "commandInput", 
						className: "form-control", 
						placeholder: "Enter a command here", 
						"aria-describedby": "command-addon", 
						disabled: this.isDisabled(), 
						value: this.state.commandValue, 
						onChange: this.handleCommandChange}), 
					React.createElement("span", {className: "input-group-btn"}, 
						React.createElement("button", {type: "submit", 
							className: "btn btn-default", 
							disabled: this.isDisabled()}, 
							"Execute"
						)
					)
				)
			)
		);
	}
});

var adminContainer = document.getElementById('admin-container');
if (typeof adminContainer !== 'undefined') {
	ReactDOM.render(
	
	React.createElement("div", null, 
		React.createElement("div", null, 
			React.createElement(StartServerButton, null), 
			React.createElement(StopServerButton, null)
		), 
		React.createElement(ServerCommandInput, null)
	),
	
	adminContainer);
}

// Dependency: serverStateHandlers.
// USE REQUIRE ASAP

var ServerButtonStyle = {
	width: '50%'
};

var StartServerButton = React.createClass({displayName: "StartServerButton",	
	startServer: function() {
		$.post('/start_server');
	},
	
	isDisabled: function() {
		return this.props.serverState !== constants.server_state.offline;
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
	stopServer: function() {
		$.post('/stop_server');
	},
	
	isDisabled: function() {
		return this.props.serverState !== constants.server_state.online;
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

var CommandOutputContainer = React.createClass({displayName: "CommandOutputContainer",
	render : function() {
		var serverMessages = this.props.commandOutputs.map(function(commandOutput) {
			var commands = commandOutput.split('\n').map(function(command) {
				return (
					React.createElement("div", null, command)
				);
			});
			return commands;
		});
		return (
			React.createElement("div", {className: "server-output"}, 
				serverMessages
			)
		);
	}
});

var CommandServerForm = React.createClass({displayName: "CommandServerForm",
	getInitialState: function() {
		return {
			commandInFlight: false,
			commandValue: '',
			commandOutputs: []
		};
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
				if (data === constants.result.failure) {
					alert('Error: command failed!  Please try again.');
				}
				else {
					this.setState({ 
						commandOutputs: [data].concat(this.state.commandOutputs)
					});
				}
				ReactDOM.findDOMNode(this.refs.commandInput).focus();
			}.bind(this));
		}
	},
	
	isDisabled: function() {
		return this.props.serverState !== constants.server_state.online || this.state.commandInFlight;
	},
	
	render: function() {
		return (
			React.createElement("div", null, 
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
				), 
				React.createElement(CommandOutputContainer, {commandOutputs: this.state.commandOutputs})
			)
		);
	}
});

var ServerAdminModule = React.createClass({displayName: "ServerAdminModule",
	getInitialState: serverStateHandlers.getInitialState,
	componentDidMount: serverStateHandlers.makeComponentDidMount(),
		
	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement(StartServerButton, {serverState: this.state.serverState}), 
				React.createElement(StopServerButton, {serverState: this.state.serverState}), 
				React.createElement(CommandServerForm, {serverState: this.state.serverState})
			)
		);
	}
});

var adminContainer = document.getElementById('admin-container');
if (typeof adminContainer !== 'undefined') {
	ReactDOM.render(
		React.createElement(ServerAdminModule, null)	
	, adminContainer);
}
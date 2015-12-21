
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
		var serverMessages = this.props.commandOutputs.map(function(commandOutput, index) {
			var commands = commandOutput.split('\n').map(function(command, index) {
				return (
					React.createElement("div", {key: index}, command)
				);
			});
			return (
				React.createElement("li", {className: "list-group-item", key: index}, commands)
			);
		});
		return (
			React.createElement("div", {className: "col-sm-9 status-column"}, 
				React.createElement("ul", {className: "server-output list"}, 
					React.createElement("li", {className: "list-group-item active"}, "Command Output"), 
					React.createElement("div", {className: "log-output"}, 
						serverMessages
					)
				)
			)
		);
	}
});

var CommandServerForm = React.createClass({displayName: "CommandServerForm",
	getInitialState: function() {
		return {
			commandInFlight: false,
			commandValue: '',
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
					this.props.commandDataHandler(data);
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
				)
			)
		);
	}
});

var OnlinePlayers = React.createClass({displayName: "OnlinePlayers",
	getInitialState: function() {
		return {
			users: [],
			maxUsers: null
		};
	},
	componentDidMount: function() {
		$.get('/online_players', function(data) {
			this.setState({
				users: data
			});
		}.bind(this));
		socket.on(constants.socket.users_change, function(data){
			this.setState({
				users: data
			});
		}.bind(this));
	},
	
	kickPlayer: function(name) {
		return function() {
			$.post('/exec_command', {command : 'kick ' + name});
		};
	},

	render: function() {
		var userElements = this.state.users.map(function(user) {
			return (
			React.createElement("li", {className: "list-group-item", key: user}, 
			    React.createElement("span", {className: "badge kick", onClick: this.kickPlayer(user)}, "x"), 
				user
			) );
		}.bind(this));
		return (
			React.createElement("div", {className: "col-sm-3 status-column"}, 
				React.createElement("ul", {className: "list-group user-list"}, 
					React.createElement("li", {className: "list-group-item active"}, "Online Players"), 
					React.createElement("div", {className: "online-players"}, 
						userElements
					)
				)
			)
		);
	}
});

var ServerAdminModule = React.createClass({displayName: "ServerAdminModule",
	getInitialState: function() {
		var defaultState = serverStateHandlers.getInitialState();
		defaultState.commandData = [];
		return defaultState;
	},
	componentDidMount: serverStateHandlers.makeComponentDidMount(),
	
	setCommandData: function(data) {
		this.setState({ 
			commandData: [data].concat(this.state.commandData)
		});
	},
		
	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement("div", null, 
					React.createElement(StartServerButton, {serverState: this.state.serverState}), 
					React.createElement(StopServerButton, {serverState: this.state.serverState}), 
					React.createElement(CommandServerForm, {serverState: this.state.serverState, commandDataHandler: this.setCommandData})
				), 
				React.createElement("div", null, 
					React.createElement(OnlinePlayers, null), 
					React.createElement(CommandOutputContainer, {commandOutputs: this.state.commandData})
				)
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
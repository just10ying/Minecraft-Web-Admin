// Dependency: serverStateHandlers.
// USE REQUIRE ASAP

var ServerButtonStyle = {
	width: '50%'
};

var StartServerButton = React.createClass({	
	startServer: function() {
		$.post('/start_server');
	},
	
	isDisabled: function() {
		return this.props.serverState !== constants.server_state.offline;
	},
	
	render: function() {
		return (
			<button className="btn btn-success"
					onClick={this.startServer}
					style={ServerButtonStyle}
					disabled={this.isDisabled()} >
					
					Start Server
					
			</button>
		);
	}
});

var StopServerButton = React.createClass({
	stopServer: function() {
		$.post('/stop_server');
	},
	
	isDisabled: function() {
		return this.props.serverState !== constants.server_state.online;
	},

	render: function() {
		return (
			<button className="btn btn-danger" 
					onClick={this.stopServer}
					style={ServerButtonStyle}
					disabled={this.isDisabled()} >
				
					Stop Server
					
			</button>
		);
	}
});

var CommandOutputContainer = React.createClass({
	render : function() {
		var serverMessages = this.props.commandOutputs.map(function(commandOutput, index) {
			var commands = commandOutput.split('\n').map(function(command, index) {
				return (
					<div key={index}>{command}</div>
				);
			});
			return (
				<li className="list-group-item" key={index}>{commands}</li>
			);
		});
		return (
			<div className="col-sm-9 status-column">
				<ul className="server-output list">
					<li className="list-group-item active">Command Output</li>
					<div className="log-output">
						{serverMessages}
					</div>
				</ul>
			</div>
		);
	}
});

var CommandServerForm = React.createClass({
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
			<div>
				<form role="form" onSubmit={this.handleSubmit}>
					<div className="input-group">
						<span className="input-group-addon" id="command-addon">Command:</span>
						<input type="text"
							ref="commandInput"
							className="form-control"
							placeholder="Enter a command here"
							aria-describedby="command-addon"
							disabled={this.isDisabled()}
							value={this.state.commandValue}
							onChange={this.handleCommandChange} />
						<span className="input-group-btn">
							<button type="submit"
								className="btn btn-default"
								disabled={this.isDisabled()} >
								Execute
							</button>
						</span>
					</div>
				</form>
			</div>
		);
	}
});

var OnlinePlayers = React.createClass({
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
		var userElements = this.state.users.map(function(user, index) {
			return (
			<li className="list-group-item" key={index}>
			    <span className="badge kick" onClick={this.kickPlayer(user)}>x</span>
				{user}
			</li> );
		}.bind(this));
		return (
			<div className="col-sm-3 status-column">
				<ul className="list-group user-list">
					<li className="list-group-item active">Online Players</li>
					<div className="online-players">
						{userElements}
					</div>
				</ul>
			</div>
		);
	}
});

var ServerAdminModule = React.createClass({
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
			<div>
				<div>
					<StartServerButton serverState={this.state.serverState}/>
					<StopServerButton serverState={this.state.serverState} />
					<CommandServerForm serverState={this.state.serverState} commandDataHandler={this.setCommandData}/>
				</div>
				<div>
					<OnlinePlayers />
					<CommandOutputContainer commandOutputs={this.state.commandData} />
				</div>
			</div>
		);
	}
});

var adminContainer = document.getElementById('admin-container');
if (typeof adminContainer !== 'undefined') {
	ReactDOM.render(
		<ServerAdminModule />	
	, adminContainer);
}
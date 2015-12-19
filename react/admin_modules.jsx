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
		var serverMessages = this.props.commandOutputs.map(function(commandOutput) {
			var commands = commandOutput.split('\n').map(function(command) {
				return (
					<div>{command}</div>
				);
			});
			return commands;
		});
		return (
			<div className="server-output">
				{serverMessages}
			</div>
		);
	}
});

var CommandServerForm = React.createClass({
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
				<CommandOutputContainer commandOutputs={this.state.commandOutputs} />
			</div>
		);
	}
});

var ServerAdminModule = React.createClass({
	getInitialState: serverStateHandlers.getInitialState,
	componentDidMount: serverStateHandlers.makeComponentDidMount(),
		
	render: function() {
		return (
			<div>
				<StartServerButton serverState={this.state.serverState}/>
				<StopServerButton serverState={this.state.serverState} />
				<CommandServerForm serverState={this.state.serverState}/>
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
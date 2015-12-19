// Dependency: serverStateHandlers

var ServerButtonStyle = {
	width: '50%'
};

var StartServerButton = React.createClass({

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
			<button className="btn btn-danger" 
					onClick={this.stopServer}
					style={ServerButtonStyle}
					disabled={this.isDisabled()} >
				
					Stop Server
					
			</button>
		);
	}
});

var ServerCommandInput = React.createClass({
	getInitialState: function() {
		var defaultState = serverStateHandlers.getInitialState();
		defaultState.commandInFlight = false;
		defaultState.commandValue = '';
		defaultState.commandOutputs = [];
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
				if (data === constants.result.failure) {
					alert('Error: command failed!');
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
	
	render: function() {
		var serverMessages = this.state.commandOutputs.map(function(commandOutput) {
			return (
				<div>{commandOutput}</div>
			);
		});
		
		return (
			<div>
				<StartServerButton />
				<StopServerButton />
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
				<div className="server-output">
					{serverMessages}
				</div>
			</div>
		);
	}
});

var adminContainer = document.getElementById('admin-container');
if (typeof adminContainer !== 'undefined') {
	ReactDOM.render(
		<ServerCommandInput />	
	, adminContainer);
}
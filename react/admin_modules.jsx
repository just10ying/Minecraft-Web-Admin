// Dependency: serverStateHandlers

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
					disabled={this.isDisabled()} >
				
					Stop Server
					
			</button>
		);
	}
});

var adminContainer = document.getElementById('admin-container');
if (typeof adminContainer !== 'undefined') {
	ReactDOM.render(<div>
						<StartServerButton />
						<StopServerButton />
					</div>, 
					adminContainer);
}
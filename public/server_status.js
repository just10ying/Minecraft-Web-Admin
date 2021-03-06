
// Dependency: serverStateHandlers

var ServerStatus = React.createClass({displayName: "ServerStatus",
	getInitialState: serverStateHandlers.getInitialState,
	componentDidMount: serverStateHandlers.makeComponentDidMount(),
	
	getStatusStyle: function() {
		switch(this.state.serverState) {
			case constants.server_state.offline:
				return { color : 'red' };
			case constants.server_state.online:
				return { color : 'green' };
			default:
				return { color : 'yellow' };
		}
	},
	
	getServerStateString: function() {
		return this.state.serverState == null ? 'Attempting to reach server...' : this.state.serverState;
	},

	render: function() {
		return (
			React.createElement("span", {style: this.getStatusStyle()}, 
				this.getServerStateString()
			)
		);
	}
});

ReactDOM.render(React.createElement(ServerStatus, null), document.getElementById('server-status-container'));

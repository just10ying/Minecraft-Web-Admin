// Dependency: serverStateHandlers

var ServerStatus = React.createClass({
	getInitialState: serverStateHandlers.getInitialState,
	componentDidMount: serverStateHandlers.makeComponentDidMount(),
	
	getStatusStyle: function() {
		switch(this.state.server_state) {
			case constants.server_state.offline:
				return { color : 'red' };
			case constants.server_state.online:
				return { color : 'green' };
			default:
				return { color : 'yellow' };
		}
	},
	
	getServerStateString: function() {
		return this.state.server_state == null ? '' : this.state.server_state;
	},

	render: function() {
		return (
			<span style={this.getStatusStyle()}>
				{this.getServerStateString()}
			</span>
		);
	}
});

ReactDOM.render(<ServerStatus />, document.getElementById('server-status-container'));

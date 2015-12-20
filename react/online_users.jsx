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

	render: function() {
		var userElements = this.state.users.map(function(user) {
			return <li className="list-group-item">{user}</li>
		});
		return (
			<div className="col-md-3">
				<ul className="user-list">
					<li className="list-group-item active">Online Players</li>
					{userElements}
				</ul>
			</div>
		);
	}
});

ReactDOM.render(<OnlinePlayers />, document.getElementById('online-players-container'));
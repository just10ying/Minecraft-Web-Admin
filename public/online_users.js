
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

	render: function() {
		var userElements = this.state.users.map(function(user) {
			return React.createElement("li", {className: "list-group-item"}, user)
		});
		return (
			React.createElement("div", {className: "col-md-3"}, 
				React.createElement("ul", {className: "user-list"}, 
					React.createElement("li", {className: "list-group-item active"}, "Online Players"), 
					userElements
				)
			)
		);
	}
});

ReactDOM.render(React.createElement(OnlinePlayers, null), document.getElementById('online-players-container'));
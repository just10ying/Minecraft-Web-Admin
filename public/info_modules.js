
var ServerInfo = React.createClass({displayName: "ServerInfo",
	render: function() {
		return (
			React.createElement(ServerStatus, null)
		);
	}
});

var ServerStatus = React.createClass({displayName: "ServerStatus",
	render: function() {
		return (
			React.createElement("div", null, "Server status: offline")
		);
	}
});

var socket = io.connect(':3001');
socket.on('state_change', function(msg) {
	console.log(msg);
});

ReactDOM.render(React.createElement(ServerInfo, null), 
				document.getElementById('info-container'));
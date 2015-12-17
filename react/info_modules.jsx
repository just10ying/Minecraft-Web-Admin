var ServerInfo = React.createClass({
	render: function() {
		return (
			<ServerStatus />
		);
	}
});

var ServerStatus = React.createClass({
	render: function() {
		return (
			<div>Server status: offline</div>
		);
	}
});

var socket = io.connect(':3001');
socket.on('state_change', function(msg) {
	console.log(msg);
});

ReactDOM.render(<ServerInfo />, 
				document.getElementById('info-container'));
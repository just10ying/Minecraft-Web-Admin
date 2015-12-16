var express 		= require('express'),
	expressLess		= require('express-less'),
	path			= require('path'),
	bodyParser		= require('body-parser'),
	jsxCompile		= require('express-jsx'),
	
	constants		= require('./constants'),
	startServer		= require('./routes/server_actions');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(jsxCompile(path.join(__dirname, 'public')));
app.use(express.static(path.join( __dirname, 'public' )));
app.use('/css', expressLess(__dirname + '/less'));
app.use(startServer);


var server = app.listen(constants.port, function() {
	console.log('Server started successfully.');
});

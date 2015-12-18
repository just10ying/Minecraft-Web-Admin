var express 		= require('express'),
	expressLess		= require('express-less'),
	path			= require('path'),
	bodyParser		= require('body-parser'),
	jsxCompile		= require('express-jsx'),
	
	mongoose		= require('mongoose'),
	passport		= require('passport'),
	flash			= require('connect-flash'),
	morgan			= require('morgan'),
	cookieParser	= require('cookie-parser'),
	session			= require('express-session'),
	configDB		= require('./config/database.js'),
	
	msg				= require('./config/messages_constants'),
	appSettings		= require('./config/app_settings.js'),
	clientConstants	= require('./config/client_constants'),
	serverActions	= require('./routes/server_actions');

var app = express();

// Authentication
require('./services/passport')(passport);
mongoose.connect(configDB.url);

app.set('view engine', appSettings.view_engine);
app.use(morgan(appSettings.log_level));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: appSettings.secret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./routes/auth')(app, passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(jsxCompile(path.join(__dirname, 'react'), {
	dest: path.join(__dirname, 'public')
}));
app.use(express.static(path.join( __dirname, 'public' )));
app.use('/css', expressLess(__dirname + '/less'));

app.use(serverActions);

var server = app.listen(appSettings.port, function() {
	console.log(msg.server_start_success);
});

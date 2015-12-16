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
	
	ports			= require('./config/ports'),
	startServer		= require('./routes/server_actions');

var app = express();

// Authentication
require('./config/passport')(passport);
mongoose.connect(configDB.url);
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'believeitornotitsjohnlee' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./routes/auth')(app, passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(jsxCompile(path.join(__dirname, 'public')));
app.use(express.static(path.join( __dirname, 'public' )));
app.use('/css', expressLess(__dirname + '/less'));
app.use(startServer);


var server = app.listen(ports.listenPort, function() {
	console.log('Server started successfully.');
});

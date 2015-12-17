var	mongoose	= require('mongoose'),
	configDB	= require('./config/database.js'),
	User		= require('./models/user');

var command = process.argv[2].split('=');
var username = command[0];
var makeAdmin = command[1] === 'true';

mongoose.connect(configDB.url);

User.findOneAndUpdate(User.generateSearchObject(username), 
					 { $set: { 'local.admin' : makeAdmin }},
					 { new: true },
					 function(err, user) {
						if (err) throw err;
						console.log(username + ' successfully updated to admin = ' + makeAdmin);
						mongoose.disconnect();
					 });
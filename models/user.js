var mongoose 	= require('mongoose'),
	bcrypt		= require('bcrypt-nodejs');
	
var userSchema = mongoose.Schema({
	local: {
		email: String,
		password: String,
		admin: Boolean
	}
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
	
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

userSchema.statics.generateSearchObject = function(email) {
	var object = new Object();
	object['local.email'] = email;
	return object;
}

module.exports = mongoose.model('User', userSchema);
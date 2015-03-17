////////////
// SERVER //
////////////

var mongoose = require('mongoose');
var User = require('./user.js');

var tempUserSchema = mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	messages: [{
		timestamp: {type: Date, default: Date.now},
		message: String
	}],
	accepted: {
		type: Boolean,
		default: false
	},
	weddings: [User]
});

var TempUser = mongoose.model('TempUser', tempUserSchema);

module.exports = TempUser;
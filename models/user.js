////////////
// SERVER //
////////////

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
	// role is 'host' or 'guest'
	role: {
		type: String,
		default: 'guest'
	},
	incomplete: {
		type: Boolean,
		default: false
	},
	fbId: {
		type: String
	},
	//////////////
	// TWITTER //
	//////////////
	twitterId: {
		type: String
	},
	twitterToken: String,
	twitterUserName: String,
	// general data
	displayName: String,
	firstName: {
		type: String/*,
		required: true*/
	},
	lastName: {
		type: String/*,
		required: true*/
	},
	email: {
		type: String,
		// required: true,
		unique: true
	},
	password: {
		type: String/*,
		required: true,*/
	},
	age: Number,
	profilePic: String,
	////////////////
	// HOST DATA //
	////////////////
	hostType: String,
	hostFianceFirstName: String,
	hostFianceLastName: String,
	// this will change once passport is set up
	hostWedLocation: String,
	hostWedVenue: String,
	// how should i store the date?
	hostWedDate: Date,
	hostWedTime: String,
	hostReceptionVenue: String,
	hostReceptionTime: String,
	hostSite: String,
	// only will contain guests
	party: [userSchema],
	// only contain host ids
	myWeddings: [userSchema],
	messages: [{
		timestamp: {type: Date, default: Date.now},
		message: String,
		from: mongoose.Schema.Types.ObjectId,
		to: mongoose.Schema.Types.ObjectId
	}],
	/////////////////
	// GUEST DATA //
	/////////////////
	hometown: String,
	guestFriendsOf: String,
	guestBackgroundStory: String,
	guestWeddingStory: String,
	timestamp: {type: Date, default: Date.now}
});

// this allows us to hook into the pre-save DB flow
// our cb will be called whenever a new user is about to
// be saved to the db so that we can encrypt the password
userSchema.pre('save', function(next) {
	// check if this is a new password
	if(!this.isModified('password')){
		return next();
	}

	// if we make it this far, user has modified the password
	// time for encryption
	
	// store access to 'this', which represents the current user document
	var user = this;

	// generate an encryption 'salt', this is a special way of increasing
	// the encryption power by wrapping the given string in a secret string
	// something like 'secretpasswordsecret' and then encrypting that result
	bcrypt.genSalt(10, function(err, salt){
		if(err) return next(err);
		// if we reach this point, we have a successful salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
			// successfully hashed password
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, next) {
	// compare the saved, ecncrypted password to the user-entered one
	bcrypt.compare(
		candidatePassword, 
		this.password,
		function(err, isMatch) {
			if(err) return next(err);
			// if no error, hand off the 'isMatch' value:
			next(null, isMatch);
		});
};

var User = mongoose.model('User', userSchema);

module.exports = User;
////////////
// SERVER //
////////////

var passport = require('passport');
var LocalStrategy = require('passport-local').
	Strategy;
var FacebookStrategy = require('passport-facebook').
	Strategy;
var User = require('../models/user');

// dummy user for local strategy testing
var user = new User({
	firstName: 'Johnny',
	lastName: 'Quest',
	email: 'johnnyquest@gmail.com',
	password: 'test',
	role: 'guest'
});

user.save(function(err, user) {
	if(err) console.log('there was an error:', err);
	console.log('seeded user');
});

// session serialization
passport.serializeUser(function(user, next) {
	// convert user object to session-storing id
	next(null, user._id);
});
passport.deserializeUser(function(id, next) {
	// convert session-stored id into a user object
	User.findById(id, function(err, user) {
		next(err, user);
	});
});

// ensure authentication method
module.exports = {
	ensureAuthenticated: function(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}
		// if it doesn't return next, go back to login page
		res.redirect('/login');
	}
};

////////////////
// STRATEGIES //
////////////////

// local login to app
var localStrategy = new LocalStrategy(
	function(email, password, next){
		console.log('this is before User.findOne');
		User.findOne({email: email}, function(err, user) {
			console.log('inside localStrategy:', user, err);
			if(err) return next(err);
			if(!user) {
				// no error but unsuccessful signing in
				return next(null, false);
			}
			// given email matches a database doc, then:
			user.comparePassword(password, function(err, isMatch) {
				if(err) return next(err);
				if(isMatch) {
					// pass user because they have successfully come back from the
					// db and been authenticated
					return next(null, user);
				} 
				else {
					return next(null, false);
				}
			});
		});
	}
);

passport.use(localStrategy);


// fb login to app
var fbStrategy = new FacebookStrategy({
	clientID: '433029926860844',
	clientSecret: '2796f5e4113e40d44e9b109e7c3d455c',
	callbackURL: 'http://localhost:7160/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, next) {
	User.findOne({fbId: profile.id}, function(err, user) {
		console.log(err);
		if(user){
			// user was found already, allow access
			next(null, user);
		} else {
			// user was not found, save and allow access
			var newUser = new User({
				fbId: profile.id,
				firstName: profile.first_name,
				lastName: profile.last_name,
				email: profile.emails[0].value,
				hometown: profile.hometown,
				profilePic: profile.photos[0].value
			});
			newUser.save(function(err, user) {
				if(err) throw err;
				next(null, user);
			});
		}
	});
});

passport.use(fbStrategy);
////////////
// SERVER //
////////////

var passport = require('passport');
var LocalStrategy = require('passport-local').
	Strategy;
var FacebookStrategy = require('passport-facebook').
	Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');
var fbapi = require('facebook-api');

// dummy user for local strategy testing
/*var user = new User({
	firstName: 'Johnny',
	lastName: 'Quest',
	email: 'johnnyquest@gmail.com',
	password: 'test',
	role: 'host',
	profilePic: 'http://thestalkingmoon.weebly.com/uploads/1/1/5/4/11544757/3616540_orig.png?303'
});

var otherUser = new User ({
	firstName: 'Mason',
	lastName: 'Goetz',
	email: 'masonlgoetz@gmail.com',
	password: '1234',
	role: 'guest',
	myWeddings: [user._id]
});

user.save(function(err, user) {
	if(err) console.log('there was an error:', err);
	console.log('seeded user');
});

otherUser.save(function(err, user) {
	if(err) console.log(err);
	console.log('seeded the otherUser');
});*/

// session serialization
// This small subset of code will take a user object, used
// in our JS, and convert it into a small, unique, string
// which is represented by the id, and store it into the
// session.

//  Essentially the inverse of above. This will take a user
//  id out of the session and convert it into an actual
//  user object.
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
	clientID: process.env.clientID,
	clientSecret: process.env.clientSecret,
	fbCallbackURL: process.env.fbCallbackURL
}, function(accessToken, refreshToken, profile, next) {
	User.findOne({fbId: profile.id}, function(err, user) {
		console.log('err inside of findOne fbStrategy:', err);
		if(user){
			// user was found already, allow access
			next(null, user);
		} else {
			// user was not found, save and allow access
			console.log('user profile returned from fb:', profile);
			// photo callback to fb api to get the photos, wrap the new user creation in this
			
			/*var viewback = function (err, data) { 
			    if(err) { 
			        console.log("Error: ", err); 
			    } else { 
			        console.log("Data: ", data); 
			    }
			};

			var client = fbapi.user(accessToken);
			console.log('client.me.info(viewback):', client.me.info(viewback));*/
			var newUser = new User({
				fbId: profile.id,
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				email: profile.emails[0].value,
				hometown: profile.location,
				profilePic: "https://graph.facebook.com/" + profile.id + "/picture?", //make sure to always add back in width=200&height=200
				incomplete: true
			});
			/*console.log('this is what \'user\' is:', user);
			console.log('this is the err from fbStrategy, but out of save: ', err);*/
			newUser.save(function(err, user) {
				/*console.log('this is the err inside newUser.save: ', err);
				console.log('this is the user inside newUser.save: ', user);*/
				if(err) console.log('there was an error attempting to save a new user (facebook) to the db: ', err);
				next(null, user);
			});
		}
	});
});

passport.use(fbStrategy);


// twitter login to app
var twitterStrategy = new TwitterStrategy({
	consumerKey: process.env.consumerKey,
	consumerSecret: process.env.consumerSecret,
	twitterCallbackURL: process.env.twitterCallbackURL
}, function(token, tokenSecret, profile, next) {
	User.findOne({twitterId: profile.id}, function(err, user) {
		if(err) return next(err);
		if(user) {
			// user was found in the db, allow access
			return next(null, user);
		} else {
			// no user, so create them
			var newUser = new User({
				twitterId: profile.id,
				displayName: profile.displayName,
				twitterToken: token,
				incomplete: true
			});
			newUser.save(function(err, user) {
				if(err) console.log('there was an error attempting to save a new user (twitter) to the db: ', err);
				console.log('this is the user returned from twitter after registration: ', user);
				next(null, user);
			});
		}
	});
});

passport.use(twitterStrategy);
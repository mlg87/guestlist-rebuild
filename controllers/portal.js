////////////
// SERVER //
////////////

var mongoose = require('mongoose');
var schema = require('../models/schemas.js');
var User = require('../models/user.js');
var passport = require('passport');

var portalController = {
	guestRegister: function(req, res, next) {
		var data = req.body;
		console.log(data);

		User.findOne({email: data.guestEmail}, function(err, user) {
			if(err) return next(err);
			if(!user) {
				var newUser = new User({
					role: 'guest',
					firstName: data.guestFirstName,
					lastName: data.guestLastName,
					email: data.guestEmail,
					password: data.guestPassword,
					age: data.guestAge,
					profilePic: data.guestProfilePic,
					// still need to figure out how to add them to a specific wedding party
					hometown: data.guestHometown,
					guestFriendsOf: data.guestFriendsOf,
					guestBackgroundStory: data.guestBackgroundStory,
					guestWeddingStory: data.guestWeddingStory
				});
				newUser.save(function(err, user) {
					if(err) console.log('there was an error in guestRegister: ', err);
					console.log('added user: ', newUser);
					req.login(user, function(err) {
						if(err) console.log('there was an err, horray! ', err);
						res.redirect('/guest-portal');
					});
				});
			}
		});

		/*var newGuest = new schema.Guest(req.body);
		newGuest.save(function(err) {
			if (err) console.log(err);
			res.redirect('/guest-portal');
		});*/
	},

	guestUpdateInfo: function(req, res) {
		var data = req.body;
		var id = req.user._id;
		console.log('this is req.body in guestUpdateInfo: ', req.user);
		User.findById(id, function(err, user) {
			if (err) return handleErr(err);
			user.profilePic = data.profilePic || user.profilePic;
			user.hometown = data.hometown || user.hometown;
			user.age = data.age || user.age;
			user.guestFriendsOf = data.friendsOf || user.guestFriendsOf;
			user.guestBackgroundStory = data.backgroundStory || user.guestBackgroundStory;
			user.guestWeddingStory = data.weddingStory || user.guestWeddingStory;
			user.incomplete = false;
			user.save(function(err, user) {
				if(err) return handleErr(err);
				res.send(user);
			});
		});
		// res.redirect('/guest-portal');
	},

	// might not need this now that passport has been implemented
	guestLoggedIn: function(req, res) {
		console.log(schema.Guest.findOne());
		res.render('guest-portal', {user: req.user});
	},

	hostRegister: function(req, res, next) {
		var data = req.body;
		console.log(data);

		User.findOne({email: data.hostEmail}, function(err, user) {
			if(err) return next(err);
			if(!user) {
				var newUser = new User({
					role: 'host',
					firstName: data.hostFirstName,
					lastName: data.hostLastName,
					email: data.hostEmail,
					password: data.hostPassword,
					age: data.hostAge,
					profilePic: data.hostProfilePic,
					hostType: data.hostType,
					hostFianceFirstName: data.hostFianceFirstName,
					hostFianceLastName: data.hostFianceLastName,
					hostProfilePic: data.hostWeddingLocation,
					hostWedVenue: data.hostWeddingVenue,
					hostWedDate: data.hostWeddingDate,
					hostWedTime: data.hostWeddingTime,
					hostReceptionVenue: data.hostReceptionVenue,
					hostReceptionTime: data.hostReceptionTime,
					hostSite: data.hostWeddingSite
				});
				newUser.save(function(err, user) {
					if(err) console.log('there was an error in hostRegister: ', err);
					console.log('added user(host): ', newUser);
					req.login(user, function(err) {
						if(err) console.log('there was an err, horray! ', err);
						res.redirect('/host-portal');
					});
				});
			}
		});
	},

	hostUpdateInfo: function(req, res) {
		var data = req.body;
		var id = req.user._id;
		console.log('this is req.body in hostUpdateInfo: ', req.user);
		User.findById(id, function(err, user) {
			if (err) return handleErr(err);
			user.profilePic = data.profilePic || user.profilePic;
			user.hostWedLocation = data.hostWedLocation || user.hostWedLocation;
			user.hostWedVenue = data.hostWedVenue || user.hostWedVenue;
			user.hostWedVenue = data.hostWedVenue || user.hostWedVenue;
			user.hostWedTime = data.hostWedTime || user.hostWedTime;
			user.hostReceptionVenue = data.hostReceptionVenue || user.hostReceptionVenue;
			user.hostReceptionTime = data.hostReceptionTime || user.hostReceptionTime;
			user.hostSite = data.hostSite || user.hostSite;
			user.save(function(err, user) {
				if(err) return handleErr(err);
				res.send(user);
			});
		});
	},

	// might not need this either
	hostLoggedIn: function(req, res) {
		console.log(schema.Host.findOne());
		res.render('host-portal', {user: req.user});
	},

	// handles user authentication when they sign in using the localStrategy
	userPortal: function(req, res, next) {
		console.log('inside userPortal:', req.body);
		passport.authenticate('local', function(err, user, info) {
			if(err) return next(err);
			if(!user) {
				console.log('there is not a user your\'re looking for', arguments);
				return res.redirect('/login');
			}
			// if we make it to this point, the user has successfully 
			// authenticated with the app
			req.login(user, function(err){
				if(err) return next(err);
				// user has successfully logged in
				console.log('this is a user.role for a successfully logged in user:', user.role);
				if(user.role === 'host') {
					return res.redirect('/host-portal');
				}
				else {
					return res.redirect('/guest-portal');
				}
			});
		}) (req, res, next);
	},

	userLogout: function(req, res) {
		var userToLogOut = req.user;
		req.logout();
		console.log('user successfully logged out:', userToLogOut);
		res.redirect('/');
	},

	fbAuth: function(req, res) {
		console.log('res: ', res);
		app.use('/guest-portal', function(req, res) {
			res.redirect()
		});
	},

	/////////////////
	// NEW MEHTOD //
	/////////////////

	userRegister: function(req, res) {
		var data = req.body;
		var newUser = new user.User(data);
		newUser.save(function(err) {
			if(err) console.log('there was an error creating a new user:', err);
			if(newUser.role === 'Guest') {
				console.log('A NEW GUEST WAS JUST CREATED', newUser);
				res.redirect('/guest-portal');
			} else {
				console.log('A NEW HOST WAS JUST CREATED', newUser);
				res.redirect('/host-portal');
			}
		});
	}

};

module.exports = portalController;
////////////
// SERVER //
////////////

var mongoose = require('mongoose');
var schema = require('../models/schemas.js');
var User = require('../models/user.js');
var TempUser = require('../models/temp-user.js');
var passport = require('passport');
var _ = require('underscore');

// mailgun
var domain = 'plus1me.com';
var mailgun = require('mailgun-js')({apiKey: process.env.apiKey, domain: domain});

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
			user.role = data.userRole || user.role;
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

	guestLoggedIn: function(req, res) {
		console.log(req.session.temp_id);
		console.log(schema.Guest.findOne());
		if(req.session.temp_id) {
			TempUser.findById(req.session.temp_id, function(err, user) {
				// loop through all of the weddings on the temp user and accept each wedding (add them to their myWeddings)
				user.weddings.forEach(function(el, i, arr) {
					console.log('inside guestLoggedIn: ', user, ' has been invited to ', el, ' wedding');
					req.user.myWeddings.push(el);
					User.findById(el, function(err, user) {
						console.log('user in guestloggedin find by id dick:',user);
						if(err) console.log('err attempting to push a new user into a host\'s party in guestLoggedIn: ', err);
						user.party.push(req.user._id);
						user.save();
					});
				});
				req.user.save(function(err, user) {
					if(err) return next(err);
					console.log('this user has been logged in, moved from TempUser to User: ', user);
				});
				TempUser.findByIdAndRemove(user._id, function(){});
			});

		}
		req.session.temp_id = null;
		res.render('guest-portal', {user: req.user});
	},

	guestInvite: function(req, res, next) {
		var data = req.body;
		var wedding = req.user._id;

		data.guestEmail.forEach(function(el, i, arr) {
			TempUser.findOne({email: el}, function(err, user) {
				if(err) return next(err);
				if(!user) {
					var invitedUser = new TempUser ({
						email: el,
						messages: [{message: data.messageBody}],
						weddings: [wedding]
					});
					invitedUser.save(function(err, user) {
						if(err) return next(err);
						var emailData = {
							from: 'Plus1 <masonlgoetz@gmail.com>',
							to: el,
							subject: 'Join My Wedding Party of Singles on Plus1',
							text: data.messageBody + ' http://plus1me.com/login?id=' + user._id
							// use this url for production:
							// http://plus1me.com/login?id=
							// this url for testing:
							// http://localhost:7160/login?id=
						};
						mailgun.messages().send(emailData, function(err, body) {
							if(err) console.log('err occured in mailgun when sending an invite to a new user: ', err);
							console.log('body from mailgun message(guestInvite): ', body);
						});
					});
				}
				else {
					user.messages.push({message: data.messageBody});
					user.weddings.push(wedding);
					user.save(function(err, user) {
						if(err) return next(err);
						var emailData = {
							from: 'Plus1 <masonlgoetz@gmail.com>',
							to: el,
							subject: 'Join My Wedding Party of Singles on Plus1',
							text: data.messageBody + ' http://plus1me.com/login?id=' + user._id
							// use this url for production:
							// http://plus1me.com/login?id=
							// this url for testing:
							// http://localhost:7160/login?id=
						};
						mailgun.messages().send(emailData, function(err, body) {
							if(err) console.log('err occured in mailgun when sending an invite to an existing user: ', err);
							console.log('body from mailgun message: ', body + ' http://plus1me.com/login?id=' + user._id);
						});
					});
				}
			});
		});
		
		res.send(data);
	},

	hostRegister: function(req, res, next) {
		var data = req.body;
		// console.log(data);

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
					hostWedLocation: data.hostWeddingLocation,
					hostWedVenue: data.hostWeddingVenue,
					hostWedDate: data.hostWeddingDate,
					hostWedTime: data.hostWeddingTime,
					hostReceptionVenue: data.hostReceptionVenue,
					hostReceptionTime: data.hostReceptionTime,
					hostSite: data.hostWeddingSite
				});
				newUser.save(function(err, user) {
					if(err) console.log('there was an error in hostRegister: ', err);
					console.log('added user(host): ', newUser.firstName);
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
		console.log('this is id in hostUpdateInfo: ', id);
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
		// console.log(schema.Host.findOne());
		res.render('host-portal', {user: req.user});
	},

	// handles user authentication when they sign in using the localStrategy
	userPortal: function(req, res, next) {
		// console.log('inside userPortal:', req.body);
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
		// var userToLogOut = req.user;
		req.logout();
		// console.log('user successfully logged out:', userToLogOut);
		res.redirect('/');
	},

	fbAuth: function(req, res) {
		// console.log('res: ', res);
		app.use('/guest-portal', function(req, res) {
			res.redirect();
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
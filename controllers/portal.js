////////////
// SERVER //
////////////

var mongoose = require('mongoose');
var schema = require('../models/schemas.js');
var User = require('../models/user.js');
var passport = require('passport');

var portalController = {
	guestRegister: function(req, res, next) {
		data = req.body;
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
					res.redirect('/guest-portal');
				});
			}
		});

		/*var newGuest = new schema.Guest(req.body);
		newGuest.save(function(err) {
			if (err) console.log(err);
			res.redirect('/guest-portal');
		});*/
	},

	// might not need this now that passport has been implemented
	guestLoggedIn: function(req, res) {
		console.log(schema.Guest.findOne());
		res.render('guest-portal', {user: req.user});
	},

	hostRegister: function(req, res) {
		data = req.body;
		console.log('this is the data from hostRegister: ', data);
		var newHost = new schema.Host(req.body);
		newHost.save(function(err) {
			if (err) console.log(err);
			res.redirect('/host-portal');
		});
	},

	// might not need this either
	hostLoggedIn: function(req, res) {
		console.log(schema.Host.findOne());
		res.render('host-portal');
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
				return res.redirect('/guest-portal', {user: req.user});
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
		data = req.body;
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
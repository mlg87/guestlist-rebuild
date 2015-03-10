////////////
// SERVER //
////////////

var mongoose = require('mongoose');
var schema = require('../models/schemas.js');
var user = require('../models/user.js');
var passport = require('passport');

var portalController = {
	guestRegister: function(req, res) {
		data = req.body;
		console.log(data);
		var newGuest = new schema.Guest(req.body);
		newGuest.save(function(err) {
			if (err) console.log(err);
			res.redirect('/guest-portal');
		});
	},

	guestLoggedIn: function(req, res) {
		console.log(schema.Guest.findOne());
		res.render('guest-portal');
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
				return res.redirect('/guest-portal');
			});
		}) (req, res, next);
	},

	userLogout: function(req, res) {
		var userToLogOut = req.user;
		req.logout();
		console.log('user successfully logged out:', userToLogOut);
		res.redirect('/');
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
////////////
// SERVER //
////////////

var mongoose = require('mongoose');
var User = require('../models/user.js');

var profileController = {
	currentUser: function(req, res, next) {
		var userId = req.params._id;
		User.findById(userId, function(err, user) {
			if(err) return handleErr(err);
			console.log('user inside of currentUser: ', user.firstName);
			res.render('guest-profile', {user: user});
		});
	},
	givenUser: function(req, res, next) {
		
	},
	currentWedding: function(req, res, next) {
		var weddingId = req.params._id;
		console.log('weddingId in currentWedding: ', weddingId);
		User.findById(weddingId, function(err, user) {
			if(err) next(err);
			res.render('wedding-profile', {user: user});
		});
	}
};

module.exports = profileController;


 // might not need this var
		 /*var userLoggedIn = req.user;
		 res.render('guest-profile', {user: req.user});*/
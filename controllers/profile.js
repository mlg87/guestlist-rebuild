////////////
// SERVER //
////////////

var mongoose = require('mongoose');
var User = require('../models/user.js');

var profileController = {
	currentUser: function(req, res, next) {
		var userId= req.params._id;
		User.findById(userId, function(err, user) {
			if(err) return handleErr(err);
			console.log('user inside of currentUser: ', user.firstName);
			res.render('guest-profile', {user: user});
		});
	},
	givenUser: function(req, res, next) {
		
	}
};

module.exports = profileController;


 // might not need this var
		 /*var userLoggedIn = req.user;
		 res.render('guest-profile', {user: req.user});*/
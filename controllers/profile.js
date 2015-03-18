////////////
// SERVER //
////////////

var mongoose = require('mongoose');
var User = require('../models/user.js');

// mailgun
var domain = 'plus1me.com';
var mailgun = require('mailgun-js')({apiKey: process.env.apiKey, domain: domain});

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
		console.log('user role inside of currentWedding: ', req.user.role);
		if(req.user.role === 'host') {
			var weddingId = req.params._id;
			console.log('weddingId in currentWedding: ', weddingId);
			User.findById(weddingId, function(err, user) {
				if(err) next(err);
				res.render('wedding-profile', {user: user});
			});
		}
		else if(req.user.role === 'guest') {
			console.log('users wedding at 0 index: ', req.user.myWeddings[0]);
			var newWeddingId = req.user.myWeddings[0];
			User.findById(newWeddingId, function(err, user) {
				if(err) next(err);
				// res.render('wedding-profile', {user: req.user});
				console.log('user inside of else if of currentWedding: ', user);
				// this causes a redirect loop:
				// res.redirect('/wedding-profile/' + newWeddingId);
			});
		}
		
	},
	sendMsg: function(req, res, next) {
		var data = req.body;
		var from = req.user._id;
		var to = data.to;
		var msg = data.msg;

		User.findById(to, function(err, user) {
			if(err) console.log('err attempting to find the msg receiver in profile.js.sendMsg: ', err);
			var recepient = user;
			var emailData = {
				from: req.user.firstName + ' ' + req.user.lastName + ' | Plus1 <' + req.user.email + '>',
				to: recepient.email,
				subject: req.user.firstName + ' ' + req.user.lastName + ' Messaged You On Plus1',
				text: msg
			};
			mailgun.messages().send(emailData, function(err, body) {
				console.log('body from mailgun msg(sendMsg): ', body, ' recepient email: ', recepient.email, ' sender email: ', req.user.email);
			});
			recepient.messages.push({
				message: msg,
				from: from,
				to: user._id
			});
			recepient.save(function(err) {
				if(err) console.log('err attempting to save recepient: ', err);
			});
		});

		User.findById(from, function(err, user) {
			if(err) console.log('err attempting to find the msg sender in profile.js.sendMsg: ', err);
			user.messages.push({
				message: msg,
				from: user._id,
				to: to
			});
			user.save(function(err) {
				if(err) console.log('err attempting to save sender: ', err);
			});
		});

		res.send(data);
	}
};

module.exports = profileController;


 // might not need this var
		 /*var userLoggedIn = req.user;
		 res.render('guest-profile', {user: req.user});*/
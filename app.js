var express = require('express');
var bodyParser = require('body-parser');

var indexController = require('./controllers/index.js');
var portalController = require('./controllers/portal.js');
var profileController = require('./controllers/profile.js');

var mongoose = require('mongoose');

var passport = require('passport');
var passportConfig = require('./config/passport');
var session = require('express-session');

// use the 'plus1' db
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/plus1');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({secret: 'secret key'}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', indexController.index);

// handlers for rendering registering and logging in pages
app.get('/login', indexController.login);
app.get('/guest-registration', indexController.guestReg);
app.get('/host-registration', indexController.hostReg);

// handlers for the forms on guest and host registration pages
app.post('/guest-reg-form', portalController.guestRegister);
app.post('/host-reg-form', portalController.hostRegister);

// handler for the form on the login page
app.post('/userlogin', portalController.userPortal);
// is scope for facebook where i require what i want to get from fb ok

// handler for logging in/registering with facebook
app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'user_photos']}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/guest-portal',
	failureRedirect: '/login'
}));

// handler for logging in/registering with twitter
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
	successRedirect: '/guest-portal',
	failureRedirect: '/login'
}));

// ensureAuthenticated protects routes if a given user is not logged in
// this needs to come before the portals so user's have to be logged in
app.use(passportConfig.ensureAuthenticated);

// can't log out unless already logged in
app.get('/logout', portalController.userLogout);

// handlers for getting to the given portal
app.get('/host-portal', portalController.hostLoggedIn);
app.get('/guest-portal', portalController.guestLoggedIn);

// handlers for updating profile info from the guest/host portals
app.post('/guest-update-info', portalController.guestUpdateInfo);
app.post('/host-update-info', portalController.hostUpdateInfo);

// handler for viewing 'my profile' when a user is logged in
app.get('/profile/:_id', profileController.currentUser);

// handler for viewing a wedding profile page
app.get('/wedding-profile/:_id', profileController.currentWedding);

// handler for guest msg
app.post('/profile-msg', profileController.sendMsg);

// handler for guest email invitation from host
app.post('/guest-em-invite', portalController.guestInvite);

app.post('/guest-portal', portalController.userRegister);
app.post('/host-portal', portalController.userRegister);

var port = process.env.PORT || 7160;
var server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});

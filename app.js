var express = require('express');
var bodyParser = require('body-parser');

var indexController = require('./controllers/index.js');
var portalController = require('./controllers/portal.js');

var mongoose = require('mongoose');

var passport = require('passport');
var passportConfig = require('./config/passport');
var session = require('express-session');

// use the 'plus1' db
mongoose.connect('mongodb://localhost/plus1');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({secret: 'secret key'}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', indexController.index);
app.get('/login', indexController.login);
app.get('/guest-registration', indexController.guestReg);
app.get('/host-registration', indexController.hostReg);


app.post('/userlogin', portalController.userPortal);
// is scope for facebook where i require what i want to get from fb?
app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
// ensureAuthenticated protects routes if a given user is not logged in
// this needs to come before the portals so user's have to be logged in
app.use(passportConfig.ensureAuthenticated);

app.get('/logout', portalController.userLogout);

app.get('/host-portal', portalController.hostLoggedIn);
app.get('/guest-portal', portalController.guestLoggedIn);

/////////////////////////////
// PASSPORT AUTHENTICATION //
/////////////////////////////
/*

 app.post('/login', passport.authenticate('local', { successRedirect: '/',
																										failureRedirect: '/login' }));
*/

app.post('/guest-portal', portalController.userRegister);
app.post('/host-portal', portalController.userRegister);

var server = app.listen(7160, function() {
	console.log('Express server listening on port ' + server.address().port);
});

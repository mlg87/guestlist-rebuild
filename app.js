var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', indexController.index);
app.get('/guest-registration', indexController.guestReg);
app.get('/host-registration', indexController.hostReg);

var server = app.listen(7160, function() {
	console.log('Express server listening on port ' + server.address().port);
});

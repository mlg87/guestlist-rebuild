////////////
// SERVER //
////////////

var indexController = {
	index: function(req, res) {
		res.render('index');
	},
	login: function(req, res) {
		res.render('login');
	},
	guestReg: function(req, res) {
		res.render('guest-reg');
	},
	hostReg: function(req, res) {
		res.render('host-reg');
	}
};

module.exports = indexController;
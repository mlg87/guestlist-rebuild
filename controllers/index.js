////////////
// SERVER //
////////////

var indexController = {
	index: function(req, res) {
		res.render('index', {user: req.user});
	},
	login: function(req, res) {
		res.render('login', {user: req.user});
	},
	guestReg: function(req, res) {
		res.render('guest-reg', {user: req.user});
	},
	hostReg: function(req, res) {
		res.render('host-reg', {user: req.user});
	}
};

module.exports = indexController;
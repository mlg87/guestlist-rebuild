var indexController = {
	index: function(req, res) {
		res.render('index');
	},
	guestReg: function(req, res) {
		res.render('guest-reg');
	},
	hostReg: function(req, res) {
		res.render('host-reg');
	}
};

module.exports = indexController;
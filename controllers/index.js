////////////
// SERVER //
////////////

var indexController = {
	index: function(req, res) {
		res.render('index', {user: req.user});
	},
	login: function(req, res) {
		if(req.query.id) {
			req.session.temp_id = req.query.id;
		}
		res.render('login', {user: req.user});
	},
	guestReg: function(req, res) {
		console.log(req.session.temp_id);
		res.render('guest-reg', {user: req.user});
	},
	hostReg: function(req, res) {
		res.render('host-reg', {user: req.user});
	},
	videoTest: function(req, res) {
		res.render('video_test', {user: req.user});
	}
};

module.exports = indexController;
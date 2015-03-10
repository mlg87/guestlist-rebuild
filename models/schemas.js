////////////////////////////////////////
// SERVER                             //
// might not use because of 'user.js' //
////////////////////////////////////////


// model for hosts

var mongoose = require('mongoose');

// schema for host data
var hostSchema = mongoose.Schema({
	hostFirstName: String,
	hostLastName: String,
	hostEmail: String,
	hostAge: Number,
	hostType: String,
	hostFianceFirstName: String,
	hostFianceLastName: String,
	// this will change once passport is set up
	hostProfilePic: String,
	hostWedLocation: String,
	hostWedVenue: String,
	// how should i store the date?
	hostWedDate: Date,
	hostWedTime: String,
	hostReceptionVenue: String,
	hostReceptionTime: String,
	hostSite: String,
	party: [guestSchema],
	timestamp: {type: Date, default: Date.now}
});

var Host = mongoose.model('Host', hostSchema);

var guestSchema = mongoose.Schema({
	guestFirstName: String,
	guestLastName: String,
	guestEmail: String,
	guestProfilePic: String,
	guestHometown: String,
	guestAge: Number,
	guestFriendsOf: String,
	guestBackgroundStory: String,
	guestWeddingStory: String
});

var Guest = mongoose.model('Guest', guestSchema);

module.exports = {
	Host: Host,
	Guest: Guest
};
////////////
// CLIENT //
////////////

$(document).on('ready', function() {

	$('#host-registration-form').on('submit', function() {

		var onHostSubmit = function(e) {
			var newHostData = {
				role: 'Host',
				firstName: $('#host-first-name').val(),
				lastName: $('#host-last-name').val(),
				email: $('#host-email').val(),
				password: $('#host-password').val(),
				age: $('#host-age').val(),
				type: $('#host-type').val(),
				fianceFirstName: $('#host-fiance-first-name').val(),
				fianceLastName: $('#host-fiance-last-name').val(),
				// this will change once passport is set up
				profilePic: $('#host-profile-pic').val(),
				wedLocation: $('#host-wedding-location').val(),
				wedVenue: $('#host-wedding-venue').val(),
				wedDate: $('#host-wedding-date').val(),
				wedTime: $('#host-wedding-time').val(),
				receptionVenue: $('#host-reception-venue').val(),
				receptionTime: $('#host-reception-time').val(),
				site: $('#host-wedding-site').val()
			};
			// reset the form
			$(this).reset();
			/////////////////////////////////
			// add validation here later //
			/////////////////////////////////
			
		};
	};

});
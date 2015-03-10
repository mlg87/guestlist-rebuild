////////////
// CLIENT //
////////////

$(document).on('ready', function() {

	$('#guest-registration-modal').on('submit', function() {

		var onUserSubmit = function(e) {
			var newGuestData = {
				role: 'Guest',
				firstName: $('#guest-first-name').val(),
				lastName: $('#guest-last-name').val(),
				email: $('#guest-email').val(),
				profilePic: $('#guest-profile-pic').val(),
				hometown: $('#guest-hometown').val(),
				age: $('#guest-age').val(),
				friendsOf: $('#guest-friends-of').val(),
				backgroundStory: $('#guest-background-story').val(),
				weddingStory: $('#guest-wedding-story').val()
			};
		};
		$(this).reset();

		// send the data to the server and db
		$.post
	});

});
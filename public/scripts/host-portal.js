$(document).ready(function() {
	$('#host-update-info').on('submit', function(e) {
		e.preventDefault();
		$.post('/host-update-info', $(this).serialize(), function(data){
			$('#wedding-location').text(data.hostWedLocation);
			$('#wedding-venue').text(data.hostWedVenue);
			$('#wedding-date').text(data.hostWedDate);
			$('#wedding-time').text(data.hostWedTime);
			$('#reception-venue').text(data.hostReceptionVenue);
			$('#reception-time').text(data.hostReceptionTime);
		});
		$('#user-edit-info-modal').modal('hide');
	});

	$('#guest-invite-additional-email').on('click', function() {
    var newEmail = $('.orig-guest-email-field').first().clone();
    newEmail.addClass('inactive');
    var newEmailInput = newEmail.children('#guest-invite-em-ad');
    newEmailInput.val('');
    $('.orig-guest-email-field').last().after(newEmail.fadeIn());
    newEmailInput.focus();
  });

  $('#host-invite-form').on('submit', function(e) {
  	e.preventDefault();
  	$.post('/guest-em-invite', $(this).serialize(), function(data) {
  			console.log(data);
  	});
  });
});
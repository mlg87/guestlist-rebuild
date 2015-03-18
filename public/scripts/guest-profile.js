$(document).ready(function() {
	$('#message-user').on('submit', function(e) {
		e.preventDefault();
		var to = $('#user-id').text();
		console.log(to);
		var payload = {
			to: to,
			msg: $('#profile-msg-body').val()
		};
		$.post('/profile-msg', payload, function(data) {
			console.log(data);
		});
		$('#message-modal').modal('hide');
	});
});
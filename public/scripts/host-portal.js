$(document).ready(function() {
	$('#host-update-info').on('submit', function(e) {
		e.preventDefault();
		$.post('/host-update-info', $(this).serialize(), function(data){
			$('#')
			$('#friendsOf').text(data.guestFriendsOf);
			$('#backgroundStory').text(data.guestBackgroundStory);
			$('#weddingStory').text(data.guestWeddingStory);
		});
		$('#user-edit-info-modal').modal('hide');
	});
});
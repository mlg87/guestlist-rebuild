$(document).ready(function() {
	$('#guest-update-info').on('submit', function(e) {
		e.preventDefault();
		$.post('/guest-update-info', $(this).serialize(), function(data){
			$('#friendsOf').text(data.guestFriendsOf);
			$('#backgroundStory').text(data.guestBackgroundStory);
			$('#weddingStory').text(data.guestWeddingStory);
		});
		$('#user-edit-info-modal').modal('hide');
	});
	
	$('#social-reg-update').on('submit', function(e) {
		e.preventDefault();
		$.post('/guest-update-info', $(this).serialize(), function(data){
			$('#friendsOf').text(data.friendsOf);
			$('#backgroundStory').text(data.guestBackgroundStory);
			$('#weddingStory').text(data.guestWeddingStory);
		});
		$('.social-reg').hide();
	});
});
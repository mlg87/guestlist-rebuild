$(document).on('ready', function() {

///////////////////////////////////////////////
// SET THE BACKGROUND FOR THE MAIN CONTAINER //
///////////////////////////////////////////////

  $('.bg').backstretch('https://farm8.staticflickr.com/7296/8939535066_b85b77010f_k.jpg');

// alt background image 'https://farm8.staticflickr.com/7296/8939535066_b85b77010f_k.jpg'
// http://i1136.photobucket.com/albums/n488/MasonGoetz/WeddingBurner_Big_30Blue_zps4mbq19fe.jpg

//////////////////////////////////////////
// CLICK HANDLER FOR LANDING-PAGE LOGIN //
//////////////////////////////////////////

  $('#landing-login').on('click', function() {
    $(this).addClass('inactive');
    $('#main-login-form').show();
    $('#landing-login-email').focus();
  });


////////////////////////////////////////////////////////////
// CLICK HANDLER FOR 'GUEST' AND 'HOST' BTNS IN REG-MODAL //
////////////////////////////////////////////////////////////

  $('#guest-register-landing-btn').on('click', function() {
    $('#registrationModal').modal('hide');
    $('#guest-landing-page-registration-modal').modal('show');
    $('#guest-name').focus();
  });

  $('#guest-landing-page-submit-btn').on('click', function() {
    var newGuest = new WeddingGuest (
      $('#guest-name').val(),
      $('#guest-age').val(),
      $('#guest-hometown').val(),
      $('#guest-friends-of').val(),
      $('#guest-background-story').val(),
      $('#guest-wedding-story').val(),
      $('#guest-profile-pic').val(),
      $('#guest-email').val()
    );
    drewAndSarahParty.addGuest(newGuest);
    $('#guest-landing-page-registration-modal').modal('hide');
    $('#guest-name').val('');
    $('#guest-age').val('');
    $('#guest-hometown').val('');
    $('#guest-friends-of').val('');
    $('#guest-background-story').val('');
    $('#guest-wedding-story').val('');
    $('#guest-profile-pic').val('');
    $('#guest-email').val('');
    // prevent the default behavior of the form | this will be removed in live version
    $('#guest-registration-form-landing-page').on('submit', function(e) {
      e.preventDefault();
    });
  });

  $('#host-register-landing-btn').on('click', function() {
    $('#registrationModal').modal('hide');
    $('#host-landing-page-registration-modal').modal('show');
    $('#host-name').focus();
  });

  $('#host-landing-page-submit-btn').on('click', function() {
    var newHost = new WeddingHost (
      $('#host-name').val(),
      $('#host-age').val(),
      $('#host-type').val(),
      $('#host-fiance-name').val(),
      $('#host-wedding-location').val(),
      $('#host-wedding-time').val(),
      $('#host-wedding-date').val(),
      $('#host-profile-pic').val(),
      $('#host-wedding-venue').val(),
      $('#host-rehearsal-dinner-venue').val(),
      $('#host-rehearsal-dinner-time').val(),
      $('#host-rehearsal-dinner-date').val(),
      $('#host-wedding-site').val()
    );
    allHosts.addHost(newHost);
    $('#host-landing-page-registration-modal').modal('hide');
    $('#host-name').val('');
    $('#host-age').val('');
    $('#host-type').val('');
    $('#host-fiance-name').val('');
    $('#host-wedding-location').val('');
    $('#host-wedding-time').val('');
    $('#host-wedding-date').val('');
    $('#host-profile-pic').val('');
    $('#host-wedding-venue').val();
    $('#host-rehearsal-dinner-venue').val('');
    $('#host-rehearsal-dinner-time').val('');
    $('#host-rehearsal-dinner-date').val('');
    $('#host-wedding-site').val('');
    // prevent the default behavior of the form | this will be removed in live version
    $('#host-registration-form-landing-page').on('submit', function(e) {
      e.preventDefault();
    });
  });
});




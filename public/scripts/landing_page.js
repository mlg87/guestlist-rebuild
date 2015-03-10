////////////
// CLIENT //
////////////

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


});




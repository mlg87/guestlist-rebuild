////////////
// CLIENT //
////////////

$(document).on('ready', function() {

///////////////////////////////////////////////
// SET THE BACKGROUND FOR THE MAIN CONTAINER //
///////////////////////////////////////////////

  $('.bg').backstretch('https://farm8.staticflickr.com/7296/8939535066_b85b77010f_k.jpg');

  $('#info-getter').click(function() {
    $('html, body').animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 500);
    return false;
  });


});




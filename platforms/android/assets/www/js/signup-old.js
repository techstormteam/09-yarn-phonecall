var totalHeight;
var totalWidth;
var oneTenth;
var header = $('[data-id="header"]');

//alert('signup');

function updateSize() {
    totalHeight = $(window).height();
    totalWidth = $(window).width();
    oneTenth = totalHeight / 10;
    oneSixth = totalHeight / 6;

    //HEADER
    $('[data-id="header"]').css('height', oneSixth);
    
    //INTRO
    $('[data-id="intro"]').height(oneTenth * 2);
    $('hr').width(totalWidth - 30);
    
    //FORM SUBMIT
//    $('[data-id="form-submit"]').css('height', oneSixth);
    $('[data-id="form-submit"]').height(oneSixth);
    
    $('[data-id="form-login"]').height(oneSixth * 2);
}

$(document).ready(function () {
    updateSize();
    $('[data-id="intro"] video').autoplay = "true";
    $('[data-id="intro"] video').load();
    
    var gBtn = $('[data-id="google-btn"]');
    var fbBtn = $('[data-id="fb-btn"]');
    
    if (gBtn.width() > fbBtn.width()) {
        fbBtn.width(gBtn.width());
    } else {
        gBtn.width(fbBtn.width());
    }
});

$(window).resize(function () {
    updateSize();
});
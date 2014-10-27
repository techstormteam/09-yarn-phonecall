var totalHeight;
var totalWidth;
var oneTenth;
var header = $('[data-id="header"]');
var hr = $('hr');
var intro = $('[data-id="intro"]');
var formLogin = $('[data-id="form-login"]');
var formSubmit = $('[data-id="form-submit"]');
var socialButton = $('[data-id="social-btn"]');
var googleButton = $('[data-id="google-btn"]');
var fbButton = $('[data-id="fb-btn"]');

function updateSize() {
    totalHeight = $(window).height();
    totalWidth = $(window).width();
    oneTenth = totalHeight / 10;
    oneSixth = totalHeight / 6;
    oneNineth = totalHeight / 9;

    //HEADER
    header.height(oneSixth);

    //INTRO
    hr.width(totalWidth - 30);

    //FORM
    formLogin.height(oneNineth);
    formLogin.find('input').height(oneNineth / 2 - 11.2);

    //INTRO
    intro.height(oneSixth * 2);
    formSubmit.height(oneSixth - 10);
    formSubmit.first('a').css('lineHeight', (((totalHeight / 6 * 2) / 5)) + 'px');
    formSubmit.children('div').css('marginTop', formSubmit.height() - formSubmit.children('div').height());
    
    //SOCIAL BUTTON
    var sub = 0;
    sub += header.outerHeight(true);
    sub += hr.outerHeight(true);
    sub += formLogin.outerHeight(true);
    sub += intro.outerHeight(true);
    sub += formSubmit.outerHeight(true);
    
    socialButton.height(totalHeight - sub);
    googleButton.height((socialButton.height() - 6) / 2 -2);
    googleButton.css('line-height', ((socialButton.height() - 6) / 2) + 'px');
    fbButton.height((socialButton.height() - 6) / 2 - 2);
    fbButton.css('line-height', ((socialButton.height() - 6) / 2) + 'px');
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

$('.btn-submit').click(function() {
    btnHandler($(this));
});

function btnHandler(object) {
    object.animate({opacity: '0.5'}, 100)
            .delay(100)
            .animate({opacity: '1'}, 100);
}
var totalHeight;
var totalWidth;
var oneTenth;
var header = $('[data-id="header"]');
var video = $('video');
var formSubmit = $('[data-id="form-submit"]');

function updateSize() {
    totalHeight = $(window).height();
    totalWidth = $(window).width();
    oneTenth = totalHeight / 10;
    oneSixth = totalHeight / 6;
    oneNineth = totalHeight / 9;

    //HEADER
    $('[data-id="header"]').css('height', oneSixth);

    //INTRO
    $('hr').width(totalWidth - 30);

    //FORM
    $('[data-id="form-login"]').height(oneNineth);
    $('[data-id="form-login"] input').height(oneNineth / 2 - 11.2);

    //INTRO
    $('[data-id="intro"]').height(oneSixth * 2);
    $('[data-id="intro"] img').css('marginTop', $('[data-id="intro"]').height() - $('[data-id="intro"] img').height());
    video.css('marginTop', (oneSixth * 2) - video.height() + 'px');
    formSubmit.height(oneSixth - 10);
    var remain = totalHeight - $('[data-id="header"]').outerHeight(true) - $('hr').outerHeight(true) - $('[data-id="form-login"]').outerHeight(true) - $('[data-id="intro"]').outerHeight(true) - $('[data-id="social-btn"]').outerHeight(true);
//    alert(remain);
    if (remain > formSubmit.outerHeight(true)) {
        formSubmit.height(remain);
    }

    formSubmit.first('a').css('lineHeight', (((totalHeight / 6 * 2) / 5)) + 'px');
    formSubmit.children('div').css('marginTop', formSubmit.height() - formSubmit.children('div').height());
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
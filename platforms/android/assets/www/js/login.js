var totalHeight;
var totalWidth;
var oneTenth;
var header = $('[data-id="header"]');


function updateSize() {
    totalHeight = $(window).height();
    totalWidth = $(window).width();
    oneTenth = totalHeight / 10;
    oneSixth = totalHeight / 6;

    //HEADER
    $('[data-id="header"]').css('height', oneSixth);
    
    //INTRO
    $('[data-id="intro"]').height(oneSixth * 2);
}

$(document).ready(function () {
    updateSize();
    $('[data-id="intro"] video').autoplay = "true";
    $('[data-id="intro"] video').load();
});

$(window).resize(function () {
    updateSize();
});
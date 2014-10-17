var totalHeight;
var totalWidth;
var oneTenth;


function updateSize() {
    totalHeight = $(window).height();
    totalWidth = $(window).width();
    oneTenth = totalHeight / 10;
    
    //HEADER
    $('[data-id="header"]').css('height', oneTenth);
    $('[data-id="header"]').css('line-height', oneTenth + "px");
    
    //LOGO
    $('[data-id="logo"]').css('height', oneTenth * 3);
}

$(window).resize(function () {
    updateSize();
});
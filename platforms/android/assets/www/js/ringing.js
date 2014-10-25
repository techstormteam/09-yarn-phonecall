var totalHeight;
var totalWidth;
var header = $('[data-id="header"]');
var logo = $('[data-id="logo"]');
var main = $('[data-id="main"]');
var footer = $('[data-id="footer"]');

function updateSize() {
    totalHeight = $(window).height();
    totalWidth = $(window).width();
    
    header.height(totalHeight / 6);
    main.height(totalHeight / 6 * 4);
    footer.height(totalHeight / 6);
    footer.children('div').height(totalHeight / 8);
    footer.children('div').width(totalWidth / 2);
}

$(document).ready(function () {
    updateSize();
});
$(window).resize(function () {
    updateSize();
});
var totalHeight;
var totalWidth;
var sub;
var remain;
var header = $('#header');
var options = $('#option');
var footer = $('#footer');
var microScreen = $('.microfiche-screen');

function updateSize() {
    totalHeight = $(window).height();
    sub = 0;
    remain = 0;

    header.height(Math.ceil(totalHeight / 6));
    footer.find('a').css('lineHeight', (((totalHeight / 6 * 2) / 5)) + 'px');
    
    sub += header.outerHeight(true) + footer.outerHeight(true);
    remain = totalHeight - sub;
}

$(document).ready(function () {
    updateSize();
});

$(window).resize(function () {
    updateSize();
});

$(window).on('orientationchange', function () {
    updateSize();
});

function doSignOut() {
    window.signOut(function (data) {
        window.location.href = 'login.html';
    });
}

$('.btn-submit').click(function () {
    btnHandler($(this));
});

function btnHandler(object) {
    object.animate({opacity: '0.5'}, 100)
            .delay(100)
            .animate({opacity: '1'}, 100);
}
var totalHeight;
var totalWidth;
var sub;
var remain;
var header = $('#header');
var options = $('#options');
var footer = $('#footer');
var microScreen = $('.microfiche-screen');
var wrapper = $('[data-type="wrapper"]');

function updateSize() {
    totalHeight = $(window).height();
    sub = 0;
    remain = 0;

    header.height(Math.ceil(totalHeight / 6));
    footer.find('a').css('lineHeight', (((totalHeight / 6 * 2) / 5)) + 'px');
    
    sub += header.outerHeight(true) + footer.outerHeight(true);
    remain = totalHeight - sub;
    options.height(remain);
    wrapper.height(Math.ceil(remain / 4));
    
    $('.slider').width(Math.ceil(options.width() / 10 * 8));
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

$('[data-back]').click(function() {
    var id = $(this).data('back');
    $('#' + id).microfiche({
        slideByPages: -1
    });
});

$('[data-next]').click(function() {
    var id = $(this).data('next');
    $('#' + id).microfiche({
        slideByPages: 1
    });
});
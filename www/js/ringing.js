var totalHeight;
var totalWidth;
var header = $('[data-id="header"]');
var logo = $('[data-id="logo"]');
var avatar = $('[data-id="avatar"]');
var main = $('[data-id="main"]');
var footer = $('[data-id="footer"]');
var acceptCall = $('[data-id="accept-call"]');
var denyCall = $('[data-id="deny-call"]');

function updateSize() {
    totalHeight = $(window).height();
    totalWidth = $(window).width();

    header.height(Math.ceil(totalHeight / 6));
    main.height(Math.ceil(totalHeight / 6 * 4));
    if(avatar.find('img').height() >  main.height()) {
        avatar.find('img').css('height', '100%');
        avatar.find('img').css('width', 'auto');
    } else {
        avatar.find('img').css('height', 'auto');
        avatar.find('img').css('width', '100%');
    }
    footer.height(Math.ceil(totalHeight / 8));
    footer.children('div').height(Math.ceil(totalHeight / 8));
    acceptCall.width(Math.ceil(totalWidth / 2) - 1);
    denyCall.width(Math.ceil(totalWidth / 2));
}

acceptCall.tap(function() {
    buttonHandler($(this));
});
denyCall.tap(function() {
    buttonHandler($(this));
});

function buttonHandler(object) {
    object.animate({backgroundColor: 'rgba(255,255,255,0.5)'}, 100)
            .delay(100)
            .animate({backgroundColor: 'transparent'});
}

$(document).ready(function () {
    updateSize();
});
$(window).resize(function () {
    updateSize();
});
$(window).on('orientationchange', function() {
    updateSize();
});
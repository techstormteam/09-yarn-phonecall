var totalHeight;
var totalWidth;
var sub;
var remain;
var header = $('#header');
var options = $('#options');
var footer = $('#footer');
var microScreen = $('.microfiche-screen');
var wrapper = $('[data-type="wrapper"]');
var innerWrapper = $('[data-type="inner-wrapper"]');
var back = $('[data-back]');
var next = $('[data-next]');
var title = $('.title');
var slider = $('.slider');
var sliderImg = $('.slider-img');

function updateSize() {
    totalHeight = $(window).height();
    sub = 0;

    header.height(totalHeight / 6);
    footer.find('a').css('lineHeight', (((totalHeight / 6 * 2) / 5)) + 'px');

    sub += header.outerHeight(true) + footer.outerHeight(true);
    options.height(totalHeight - sub);
    wrapper.height(options.height() / 4 - 10);
    title.height(wrapper.height() / 5);
    title.css({lineHeight: wrapper.height() / 5 + 'px'});
    innerWrapper.height(wrapper.height() / 5 * 4);
    innerWrapper.width((innerWrapper.height() * 2) + back.width() + next.width() + 20);
    sliderImg.height(innerWrapper.height() - 1);
    slider.width(sliderImg.height() * 2 + 20);
}

$(document).ready(function () {
    updateSize();
});

$(window).resize(function () {
    $(document).ready(function () {
        updateSize();
    });
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

$('[data-back]').click(function () {
    var id = $(this).data('back');
    $('#' + id).microfiche({
        slideByPages: -1
    });
});

$('[data-next]').click(function () {
    var id = $(this).data('next');
    $('#' + id).microfiche({
        slideByPages: 1
    });
});

function enhanced(object) {
    object.animate({opacity: '0.5'}, 100)
            .delay(100)
            .animate({opacity: '1'}, 100);
//    object.parent().parent('ul').find('img').removeClass('enhanced');
//    object.addClass('enhanced');
    object.toggleClass('enhanced');
}

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        global.general();
        console.log('Received Event: ' + id);
    }
};

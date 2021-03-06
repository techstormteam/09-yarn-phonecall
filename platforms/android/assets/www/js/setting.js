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
    sliderImg.height(innerWrapper.height() - 1);
    slider.width(sliderImg.height() * 2 + 20);

    $('[data-back] img').height(innerWrapper.height() / 2);
    $('[data-back] img').width(innerWrapper.height() / 2);
    $('[data-next] img').height(innerWrapper.height() / 2);
    $('[data-next] img').width(innerWrapper.height() / 2);

//    innerWrapper.width((innerWrapper.height() * 2) + back.width() + next.width() + 20);
    innerWrapper.width((innerWrapper.height() * 3) + 20);
//    alert('slider: ' + slider.height());
//    alert('back img: ' + $('[data-back] img').height());
    back.find('img').css({marginTop: (back.find('img').height() / 2) + 'px'});
//    next.find('img').css({marginTop: (slider.height() - $('[data-next] img').height()) + 'px'});
    next.find('img').css({marginTop: (next.find('img').height() / 2) + 'px'});
}

$(document).ready(function () {
    updateSize();
});

$(window).resize(function () {
    updateSize();
});

$(window).load(function () {
    updateSize();
});

$(window).on('orientationchange', function () {
    updateSize();
});

function doSignOut() {
	var telno = global.get('telno');
        window.signOut(telno, function (data) {
    	global.set('uid', '');
        global.set('telno', '');
        global.set('password', '');
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

function getEmail(response) {
    email = response;
}

global.login('_email', {telno: telno, password: password}, getEmail);

function openlink(url) {
    var ref = window.open(url, '_blank', 'location="yes"');
}

function linkHandler() {
    openlink('http://portal.netcastdigital.net/mobile/auto.html?u=' + email + '&p=' + password);
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
        updateSize();
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        global.general();
        console.log('Received Event: ' + id);
    }
};

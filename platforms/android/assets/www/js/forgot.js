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
var ready = true;
var portrait = true;

function updateSize(totalWidth, totalHeight) {
    
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
    formSubmit.css('top', (totalHeight - formSubmit.children('div').height() - formSubmit.children('div').children('div').height()) +'px');
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
	if (window.orientation === -90 || window.orientation === 90 ) {
		portrait = false;
	} else {
		portrait = true;
	}
	
	totalHeight = $(window).height();
    totalWidth = $(window).width();
    updateSize(totalWidth, totalHeight);
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
	if (window.orientation === -90 || window.orientation === 90 ) {
		if (portrait) {
//			var temp = totalHeight;
//			totalHeight = totalWidth - 40;
//		    totalWidth = temp;
		    portrait = !portrait;
		    totalHeight = $(window).height();
		    totalWidth = $(window).width();
		    updateSize(totalWidth, totalHeight);
		}
		
	} else if (window.orientation === 0 || window.orientation === 180) {
		if (!portrait) { // landscape
//			var temp = totalHeight;
//			totalHeight = totalWidth;
//		    totalWidth = temp + 40;
		    portrait = !portrait;
		    totalHeight = $(window).height();
		    totalWidth = $(window).width();
		    updateSize(totalWidth, totalHeight);
		}
		
	}
	
});

$('.btn-submit').click(function() {
    btnHandler($(this));
});

$(".form").submit(function(e){
	doCheckInternetConnection();
    return false;
});

$("input").focus(function(e){
	ready = false;
});

$("input").blur(function(e){
	ready = true;
});

function btnHandler(object) {
    object.animate({opacity: '0.5'}, 100)
            .delay(100)
            .animate({opacity: '1'}, 100);
}

var phone = null;
var email = null;

function forgot(response) {
    if (response.indexOf('success') > -1) {
        sweetAlert({
            title: "Good job!",
            text: response,
            type: 'success',
            confirmButtonText: "OK"
        }, function () {
            window.location.href = 'login.html';
        });
    } else {
    	sweetAlert({
            title: "Error!",
            text: response,
            type: 'error',
            confirmButtonText: "OK"
        }, function() {
            //window.location.href = 'login.html';
        });
    }
}

function check_form() {
    phone = $('#txtPhone').val();
    email = $('#txtEmail').val();

    global.forgot('_forgotpaswd', {email: email, phone: phone}, forgot);
}

function doCheckInternetConnection() {
	window.checkInternetConnection(function (data) {
		if (data.internetConnectionAvailable) {
			check_form();
		} else {
			global.showPopup("Online Access Error", "Internet connection not available. Please enable online access", 'error');
		}
    });
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
	    }
	};
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

function updateSize() {
    totalHeight = $(window).height();
    totalWidth = $(window).width();
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
    updateSize();

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

$('.btn-submit').click(function() {
    btnHandler($(this));
});

function btnHandler(object) {
    object.animate({opacity: '0.5'}, 100)
            .delay(100)
            .animate({opacity: '1'}, 100);
}

    $('#message').hide();
    var username = null;
    var password = null;

    function playVideo(vidUrl)
    {
        window.plugins.videoPlayer.play(vidUrl);
    }

    function login(response) {
        if (response !== "") {
            global.set('uid', response);
            global.set('telno', username);
            global.set('password', password);
            window.location = 'index.html';
        } else {
            global.set('uid', '');
            global.set('telno', '');
            global.set('password', '');
            alert('Wrong username or password!');
//        $('#message').text('Wrong username or password!').show();
        }
    }

    function check_form() {
        username = $('#txtUsername').val();
        password = $('#txtPass').val();

        if (username !== "" && password !== "") {
            global.set('auto_login', true);
            global.login('_id', {telno: username, password: password}, login);
        } else {
            alert('Please enter a valid username and password to login');
        }
    }
    
    function doCheckInternetConnection() {
    	window.checkInternetConnection(function (data) {
    		if (data.internetConnectionAvailable) {
    			check_form();
    		} else {
    			global.showPopup("Internet Connection Problem", "Internet connection not available. Please enable online access");
    		}
	    });
    }
    
    function openlink(url) {
        var ref = window.open(url, '_blank', 'location=yes');
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
	        console.log('Received Event: ' + id);
	    }
	};

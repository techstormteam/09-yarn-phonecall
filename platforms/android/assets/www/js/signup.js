/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function updateSize(totalHeight) {
    var header = $('[data-id="header"]');
    var intro = $('[data-id="intro"]');
    var formLogin = $('[data-id="form-login"]');
    var formSubmit = $('[data-id="form-submit"]');
    var sub = 0;
    var remain = 0;
    
    header.height(totalHeight / 6);
    formLogin.height(totalHeight / 6 * 1);
    formLogin.children('div').height(totalHeight / 6 * 1);
    formLogin.children('div').find('div').height(((totalHeight / 6 * 1) / 3)-5);
    formLogin.children('div').find('input').height(((totalHeight / 6 * 1) / 3)-5);
    formLogin.children('div').find('input').css('line-height', (((totalHeight / 6 * 1) / 3)-5) + 'px');
    formLogin.children('div').find('input').css('min-height', (((totalHeight / 6 * 1) / 3)-5) + 'px');
    
//    formSubmit.height(btnGroupHeight);
    formSubmit.first('a').css('lineHeight', (((totalHeight / 6 * 2) / 5)) + 'px');
    formSubmit.children('div').css('marginTop', 10);
    
    sub += header.outerHeight();
    sub += formLogin.outerHeight();
    sub += formSubmit.outerHeight();
    sub += 1;
//    btnGroupHeight = formSubmit.children('div').outerHeight();
//    sub += btnGroupHeight;
    
    intro.height(totalHeight - sub);
    intro.find('img').height(totalHeight - sub);

}

$('.btn-submit').click(function() {
    btnHandler($(this));
});

function btnHandler(object) {
    object.animate({opacity: '0.5'}, 100)
            .delay(100)
            .animate({opacity: '1'}, 100);
}

$(document).ready(function() {
    var totalHeight = $(window).height();
    
    updateSize(totalHeight);
});

$(window).resize(function() {
    var totalHeight = $(window).height();
    
    updateSize(totalHeight);
});

var firstName = null;
var lastName = null;
var email = null;
var phone = null;
var password = null;
var rePassword = null;

function register(response) {
    if (response.indexOf('success') > -1) {
        sweetAlert("Good job!", response, "success");
        window.location.href = 'login.html';
    } else {
        sweetAlert("Oops...", response, "error");
    }
}

function check_rform() {
    firstName = $('#firstName').val();
    lastName = $('#lastName').val();
    email = $('#email').val();
    phone = $('#phone').val();
    password = $('#password').val();
    rePassword = $('#rePassword').val();

    if (!firstName || !lastName || !email || !phone || !password || !rePassword) {
        sweetAlert("Oops...", 'Please fill in all fields', "error");
    } else if (password !== rePassword) {
        sweetAlert("Oops...", 'Password mismatch!', "error");
    } else {
        global.register('_signup', {fname: firstName, lname: lastName, email: email, phone: phone, psw: password, psw2: rePassword}, register);
    }
}

function doCheckInternetConnection() {
	window.checkInternetConnection(function (data) {
		if (data.internetConnectionAvailable) {
			check_rform();
		} else {
			global.showPopup("Internet Connection Problem", "Internet connection not available. Please enable online access", 'error');
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
	    	window.plugins.html5Video.initialize({
	            "video1" : "signup.mp4"
	        });
	        window.plugins.html5Video.play("video1");
	        console.log('Received Event: ' + id);
	    }
	};
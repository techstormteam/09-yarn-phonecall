var ready = true;
var portrait;
var totalHeight;
var totalWidth;

function updateSize(totalHeight) {
    var header = $('[data-id="header"]');
//    var intro = $('[data-id="intro"]');
    var formLogin = $('[data-id="form-login"]');
    var formSubmit = $('[data-id="form-submit"]');
//    var sub = 0;
//    var remain = 0;
    
    header.height(totalHeight / 7);
    formSubmit.first('a').css('lineHeight', (((totalHeight / 7 * 2) / 5)) + 'px');
    formSubmit.children('div').css('marginTop', 10);
    
    var loginHeight = $(window).height() - header.height() - formSubmit.outerHeight(true);
    
//    formLogin.height(totalHeight / 6);
//    formLogin.children('div').height(totalHeight / 6);
//    formLogin.children('div').find('div').height(((totalHeight / 6) / 3)-5);
//    formLogin.children('div').find('input').height(((totalHeight / 6) / 3)-5);
//    formLogin.children('div').find('input').css('line-height', (((totalHeight / 6) / 3)-5) + 'px');
//    formLogin.children('div').find('input').css('min-height', (((totalHeight / 6) / 3)-5) + 'px');

    formLogin.height(loginHeight - 30);
    formLogin.children('div').height(loginHeight - 30);
    
    var size = ((loginHeight) / 10)-5;
    formLogin.children('div').find('div').height(size);
    formLogin.children('div').find('input').height(size);
//    formLogin.children('div').find('input').css('line-height', (size) + 'px');
    formLogin.children('div').find('input').css('min-height', (size) + 'px');
    formLogin.children('div').find('input').css('font-size', (size - 5) + 'px');
    formLogin.children('div').find('.input-group-addon').css('height', '1px');
    
    formSubmit.css('top', (totalHeight - formSubmit.height()) +'px');

}

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

$(document).ready(function () {
	if (window.orientation === -90 || window.orientation === 90 ) {
		portrait = false;
	} else {
		portrait = true;
	}
    totalHeight = $(window).height();
    totalWidth = $(window).width();

    updateSize(totalHeight);
});

$(window).resize(function () {
	if (window.orientation === -90 || window.orientation === 90 ) {
		if (portrait) {
//			var temp = totalHeight;
//			totalHeight = totalWidth - 40;
//		    totalWidth = temp;
		    portrait = !portrait;
		    totalHeight = $(window).height();
		    updateSize(totalHeight);
		}
		
	} else if (window.orientation === 0 || window.orientation === 180) {
		if (!portrait) { // landscape
//			var temp = totalHeight;
//			totalHeight = totalWidth;
//		    totalWidth = temp + 40;
		    portrait = !portrait;
		    totalHeight = $(window).height();
		    updateSize(totalHeight);
		}
		
	}
	
});

var firstName = null;
var lastName = null;
var email = null;
var phone = null;
var password = null;
var rePassword = null;
var discountCode = null;

function register(response) {
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
    discountCode = $('#discountCode').val();
    

    if (!firstName || !lastName || !email || !phone || !password || !rePassword) {
        sweetAlert("Oops...", 'Please fill in all mandatory fields', "error");
    } else if (password !== rePassword) {
        sweetAlert("Oops...", 'Password mismatch!', "error");
    } else {
    	var data = {fname: firstName, lname: lastName, email: email, phone: phone, psw: password, psw2: rePassword};
    	if (discountCode) {
	    	data.code = discountCode;
    	}
        global.register('_signup', data, register);
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
//	    	window.plugins.html5Video.initialize({
//	            "video1" : "signup.mp4"
//	        });
//	        window.plugins.html5Video.play("video1");
	        console.log('Received Event: ' + id);
	    }
	};
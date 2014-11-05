var totalHeight;
var header;
var main;
var mainImg;
var subFoot;
var timer;
var endCall;
var footer;
var footer1st;
var footer1stDiv;
var footer2nd;
var footer2ndDiv;
var remain = 0;
var loading;

var body;
var dialPad;
var dialEnabled = false;
var micEnabled = true;

var ready = false;



$(document).ready(function () {
	header = $('[data-id="header"]');
	main = $('[data-id="main"]');
	mainImg = $('[data-id="avatar"] img');
	subFoot = $('[data-id="sub-footer"]');
	timer = $('[data-id="timer"]');
	endCall = $('[data-id="end-call"]');
	footer = $('[data-id="footer"]');
	footer1st = $('[data-id="footer-1st"]');
	footer1stDiv = $('[data-id="footer-1st"] div');
	footer2nd = $('[data-id="footer-2nd"]');
	footer2ndDiv = $('[data-id="footer-2nd"] div');
	remain = 0;
	loading = $('#loading');
	body = $('#body');
	dialPad = $('#dial-pad');
	dialEnabled = false;
	micEnabled = true;
	ready = false;
	
	dialPad.hide();
});

$(document).ready(function () {
    if(global.get('vmail') === '1') {
        global.set('vmail', '0');
        window.wifiCall('88121', function (message) {
            //empty
        });
    }
});

$('[data-value]').tap(function () {
    $(this).animate({background: 'rgba(0,0,0,0.5)'}, 100)
            .delay(100)
            .animate({background: 'transparent'});
});

function doDialPad() {
    if(!dialEnabled) {
        dialPad.show();
        var dialHeight = $(window).height() - ($('header').height() + $('#loading').height());
        dialPad.css({
            position: 'fixed',
            bottom: '0',
            zIndex: '1000',
            background: 'rgba(0,0,0,0.8)',
            height: dialHeight
        });
        dialEnabled = true;
    } else {
        dialPad.hide();
        dialEnabled = false;
    }
}

$('[data-value]').tap(function () {
    $(this).animate({backgroundColor: 'rgba(0,0,0,0.1)'}, 100)
            .delay(100)
            .animate({backgroundColor: 'transparent'}, 100);
    doSendDmtf($(this).data('value'));
});

function hideDialPad() {
    body.css({transform: 'translateY(0)'});
    dialPad.hide();
}

function updateSize() {
    
    if(dialEnabled) {
        return false;
    }
    
    totalHeight = $(window).height();

    //HEADER
    header.css('height', (totalHeight / 6));
    loading.css({
        top: (Math.ceil($('[data-id="logo"] img').height() + 15) + 'px'),
        right: '10px',
        width: ($('[data-id="logo"] img').width())
    });
    loading.find('span').width(Math.ceil($('[data-id="logo"] img').width() / 5));
    loading.find('img').width(Math.ceil($('[data-id="logo"] img').width() / 5));

    //AVATAR
    main.css('height', (totalHeight / 6) * 3);
    mainImg.css('height', (totalHeight / 6) * 3);

    //SUBFOOTER
    subFoot.css('height', (totalHeight / 6));
    timer.css('line-height', (totalHeight / 12) + 'px');
    endCall.css('height', (totalHeight / 12));

    remain = totalHeight - (header.height() + main.height() + subFoot.height());

    //FOOTER
    footer.height(remain);

    //FOOTER-1ST
    footer1st.css('height', (totalHeight / 12));
    footer1stDiv.css('height', (totalHeight / 12));

    //FOOTER-2ND
    footer2nd.css('height', (totalHeight / 12));
    footer2ndDiv.css('height', (totalHeight / 12));
    
    $('[data-id="end-call"] img').css('width', $('[data-id="end-call"] img'));
//    $('[data-id="footer-1st"] img').css('width', 'auto');
//    $('[data-id="footer-2nd"] img').css('width', 'auto');
    $('[data-id="home-icon"] img').css('width', $('[data-id="home-icon"] img').height());
    $('[data-id="contacts-icon"] img').css('width', $('[data-id="contacts-icon"] img').height());
    $('[data-id="logs-icon"] img').css('width', $('[data-id="logs-icon"] img').height());
    $('[data-id="settings-icon"] img').css('width', $('[data-id="settings-icon"] img').height());
}

function blink(i) {
    setTimeout(function () {
        $('[data-loading]').attr('src', 'img/dial/default-dot.png');
        $('[data-loading="' + i + '"]').attr('src', 'img/dial/orange-dot.png');
        if (i < 5) {
            i++;
        } else {
            i = 1;
        }
        blink(i);
    }, 1000);
}

$(document).ready(function() {
    ready = true;
    global.set('flagMsg', '1');
    updateSize();
    
    blink(1);
});


$(window).resize(function () {
    if (ready) {
        updateSize();
    }
});
$(window).on('load orientationchange', function() {
    if (ready) {
        updateSize();
    }
});

function micHandler() {
	window.checkInternetConnection(function(message) {
		if (!global.showPopupInternetNotAvailable(message)) {
		    if(micEnabled) {
		        $('[data-id="microphone-icon"]').find('img').attr('src', 'img/icons/mute.png');
		        micEnabled = false;
		        doMicMute(true);
		    } else {
		        $('[data-id="microphone-icon"]').find('img').attr('src', 'img/icons/microphone.png');
		        micEnabled = true;
		        doMicMute(false);
		    }
		}

    });
}

function msgReturn(response) {
    //alert(response);
    if(response !== '') {
        global.set('callMsg', response);
    } else {
        global.set('callMsg', '');
    }
}

function msgError() {
    window.location.href = 'index.html';
}

function doHangUp() {
    window.hangUp(function (message) {
        if (!global.showPopupInternetNotAvailable(message)) {
        	window.location.href = 'index.html';
        }
    });    
    
}

function doMicMute(enable) {
    window.micMute(enable, function (message) {
    	global.showPopupInternetNotAvailable(message);
    });
}

function doLoudness() {
	
		var loudnessIcon = $('[data-id="loudness-icon"] img').attr('src');
	    
	    if(loudnessIcon === 'img/icons/loudness.png') {
	    	window.loudness(function (message) {
	    		global.showPopupInternetNotAvailable(message);
	        });
	        $('[data-id="loudness-icon"]').find('img').attr('src', 'img/icons/loudness-off.png');
	        
	    } else {
	    	window.phoneness(function (message) {
	    		global.showPopupInternetNotAvailable(message);
	        });
	        $('[data-id="loudness-icon"]').find('img').attr('src', 'img/icons/loudness.png');
	        
	    }
	
}


function doHome() {
    // Need to code
    window.location.href = 'index.html';
}
function doPhoneContacts() {

    window.phoneContacts(function (message) {
        //empty
    });
}
function doCallLogs() {

    window.callLogs(function (message) {
        //empty
    });
}
function doGetContactImageUri() {
	var telno = global.get('telnoCallingTo');
    window.getContactImageUri(telno, function (data) {
        // Set image uri to <img> tag'
    	$('[data-id="avatar"]').find('img').attr('src', data.uri);
    });

}

function endCallCheck() {
	window.checkEndCall(function(data) {
		if (data.endCall) {
			window.location.href = 'index.html';
		}
    });
}

function switchToVideoCall() {
	if (global.get('videoCall')) {
		window.startVideoActivity(function(data) {
			if (!global.showPopupInternetNotAvailable(data)) {
				if (data.success) {
					if (videoCallSwitchInterval !== null) {
						clearInterval(videoCallSwitchInterval);
						videoCallSwitchInterval = null;
						global.set('videoCall', false);
					}
				}
			}
			
	    });
	} else {
		clearInterval(videoCallSwitchInterval);
		videoCallSwitchInterval = null;
	}
	
}

function endCallCheckingScheduled() {
	setInterval(endCallCheck, 10000);
}

var videoCallSwitchInterval = null;
function switchToVideoCallScheduled() {
	videoCallSwitchInterval = setInterval(switchToVideoCall, 1000);
}

function updateTimer() {
	window.getCallDurationTime(function(data) {
		$('[data-id="timer"]').html(data.time);
    });
}

function updateTimerScheduled() {
	setInterval(updateTimer, 1000);
}

function doSendDmtf(key) {
    window.dialKeyDtmf(key, function (message) {
    	global.showPopupInternetNotAvailable(message);
    });
    
}

function onSuccessQualitySending() {
	console.log('Quality sended.');
}

function callQualityTimeout() {
	setTimeout(sendCallQuality, 6000);
}

function sendCallQuality() {
	window.getCallQuality(function(data) {
		if (!global.showPopupInternetNotAvailable(data)) {
			var telno = global.get('telno');
	        var password = global.get('password');
	        console.log('Sending quality number: '+data.quality+' of the call (to '+telno+').');
			global.sendQuality(telno, password, data.quality, onSuccessQualitySending);
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
	    	global.general();
	    	//doGetContactImageUri();
	    	callQualityTimeout();
			updateTimerScheduled();
			endCallCheckingScheduled();
			//switchToVideoCallScheduled();
			
			
//			var options = new ContactFindOptions();
//            options.filter = "";
//            options.multiple = true;
//            var fields = ["*"];
//            navigator.contacts.find(fields, onSuccess, onError, options);
			
	        console.log('Received Event: ' + id);
	    }
	    
//	    onSuccess: function (contacts) {
//            dialedNumber = global.get('dialedNumber');
//            alert('There are: ' + contacts.length + ' contacts.');
//            for (var i = 0; i < contacts.length; i++) {
//                if (contacts[i].phoneNumbers[0].value !== null) {
//                    if (contacts[i].phoneNumbers[0].value === dialedNumber) {
//                        alert('Found contact with number: ' + contacts[i].phoneNumbers[0].value);
//                    }
//                }
//            }
//        },
//        
//        onError: function (error) {
//            alert(error);
//        }
	};
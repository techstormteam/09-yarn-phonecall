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
var callNumber;

var body;
var dialPad;
var dialEnabled = false;
var micEnabled = true;

var ready = false;



$(document).ready(function () {
	header = $('[data-id="header"]');
	main = $('[data-id="main"]');
	mainImg = $('[data-id="avatar"] img');
	mainName = $('[data-id="contact-name"]');
	subFoot = $('[data-id="sub-footer"]');
	timer = $('[data-id="timer"]');
    timer2 = $('[data-id="timer2"]');
	endCall = $('[data-id="end-call"]');
	footer = $('[data-id="footer"]');
	footer1st = $('[data-id="footer-1st"]');
	footer1stDiv = $('[data-id="footer-1st"] div');
	footer2nd = $('[data-id="footer-2nd"]');
	footer2ndDiv = $('[data-id="footer-2nd"] div');
	remain = 0;
	loading = $('#loading');
	callNumber = $('#call-number');
	body = $('#body');
	dialPad = $('#dial-pad');
	dialEnabled = false;
	micEnabled = true;
	ready = false;
	
	dialPad.hide();
});

$('[data-value]').tap(function () {
    $(this).animate({background: 'rgba(0,0,0,0.5)'}, 100)
            .delay(100)
            .animate({background: 'transparent'});
});

function doDialPad() {
    if(!dialEnabled) {
        dialPad.show();
        updateSizeDialPad();
        
        dialEnabled = true;
    } else {
        dialPad.hide();
        dialEnabled = false;
    }
}

function updateSizeDialPad() {
	var dialHeight = $(window).height() - ($('header').height() + $('#loading').height());
    dialPad.css({
        position: 'fixed',
        bottom: '0',
        zIndex: '1000',
        background: 'rgba(0,0,0,0.8)',
        height: dialHeight
    });
    
    // RESIZE DIAL PAD
    var dialRowHeight = parseInt(dialPad.height()) / 7;
    dialPad.find('.dial-row').css('height', dialRowHeight + (dialRowHeight / 5)  + "px");
    dialPad.find('.dial-row div').css('line-height', dialRowHeight + "px");
    dialPad.find('.dial-row div img').css('height', dialRowHeight + "px");
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
    
//    if(dialEnabled) {
//        return false;
//    }
    
    totalHeight = $(window).height();

    //HEADER
    header.css('height', (totalHeight / 6));
    var topTemp = Math.ceil($('[data-id="logo"] img').height() + 15);
    var widthTemp = $('[data-id="logo"] img').width();
    loading.css({
        top: (topTemp + 'px'),
        right: '10px',
        width: ((widthTemp) + 'px')
    });
    loading.find('span').width(Math.ceil($('[data-id="logo"] img').width() / 5));
    loading.find('img').width(Math.ceil($('[data-id="logo"] img').width() / 5));

    callNumber.css({
        top: ((topTemp + loading.height()) + 'px'),
        right: '10px',
        width: ((widthTemp) + 'px'),
        'font-size': ((widthTemp/9) + 'px'),
        'text-align': 'center'
    });
    
    var numberOfParts = 6;
    var pixelEachPart = totalHeight / numberOfParts;
    //AVATAR
    main.css('height', pixelEachPart * 3);
    mainImg.css('height', pixelEachPart * (8/3));
    mainName.css('line-height', pixelEachPart * (1/3) + 'px');
    mainName.css('font-size', (pixelEachPart * (1/3)) - 5 + 'px');
    
    //SUBFOOTER
    subFoot.css('height', pixelEachPart);
    
    timer.css('line-height', (pixelEachPart / 2) / 2 + 'px');
    timer2.css('line-height', (pixelEachPart / 2) / 2 + 'px');
    endCall.css('height', (pixelEachPart / 2));

    remain = totalHeight - (header.height() + main.height() + subFoot.height());

    //FOOTER
    footer.height(remain);

    //FOOTER-1ST
    footer1st.css('height', (pixelEachPart / 2));
    footer1stDiv.css('height', (pixelEachPart / 2));

    //FOOTER-2ND
    footer2nd.css('height', (pixelEachPart / 2));
    footer2ndDiv.css('height', (pixelEachPart / 2));
    
    $('[data-id="end-call"] img').css('width', $('[data-id="end-call"] img').height());
//    $('[data-id="footer-1st"] img').css('width', 'auto');
//    $('[data-id="footer-2nd"] img').css('width', 'auto');
    $('[data-id="microphone-icon"] img').css('width', $('[data-id="dial-icon"] img').height() + 25);
    $('[data-id="dial-icon"] img').css('width', $('[data-id="dial-icon"] img').height() + 25);
    $('[data-id="loudness-icon"] img').css('width', $('[data-id="dial-icon"] img').height() + 25);

    $('[data-id="home-icon"] img').css('width', $('[data-id="home-icon"] img').height() + 11);
    $('[data-id="contacts-icon"] img').css('width', $('[data-id="contacts-icon"] img').height() + 11);
    $('[data-id="logs-icon"] img').css('width', $('[data-id="logs-icon"] img').height() + 11);
    $('[data-id="settings-icon"] img').css('width', $('[data-id="settings-icon"] img').height() + 11);
    
    updateSizeDialPad();
}

function blink(i) {
    setTimeout(function () {
        $('[data-loading]').attr('src', 'img/dial/default-dot.png');
        $('[data-loading="' + i + '"]').attr('src', 'img/dial/orange-dot.png');
        if (i < 4) {
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
    
    if(global.get('vmail') === '1') {
        global.set('vmail', '0');
        window.wifiCall('88121', function (message) {
            //empty
        });
    }
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

function onSuccessFindContacts(contacts) {
	if (contacts.length > 0) {
        //alert(JSON.stringify(contacts));
    	if (contacts[0].photos !== null && contacts[0].photos.length > 0) {
    		$('[data-id="avatar"]').find('img').attr('src', contacts[0].photos[0].value);
    	}
        if (contacts[0].displayName !== null) {
            $('[data-id="contact-name"]').html(contacts[0].displayName);
        } else {
            $('[data-id="contact-name"]').html(contacts[0].name.formatted);
        }
    }
};

function onErrorFindContacts(contactError) {
    global.showPopup("Error", contactError, 'error');
};

function doGetContactImageUri() {
	var telno = global.get('telnoCallingTo');
	
	if (telno !== "") {
		if (telno.charAt(0) === "0") {
			telno = telno.slice(1, telno.length);
		}
	}

	// find all contacts with 'Bob' in any name field
	var options      = new ContactFindOptions();
	options.filter   = telno;
	options.multiple = true;
	options.desiredFields = [navigator.contacts.fieldType.id, 
	                         navigator.contacts.fieldType.name,
	                         navigator.contacts.fieldType.photos];
	var fields       = [//navigator.contacts.fieldType.displayName, 
	                    //navigator.contacts.fieldType.name, 
	                    navigator.contacts.fieldType.phoneNumbers];
	navigator.contacts.find(fields, onSuccessFindContacts, onErrorFindContacts, options);
	
	global.set('telnoCallingTo', "");
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
            sweetAlert('Video Calling: Coming Soon!');
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

function setCallNumber() {
	$('#call-number').html(global.get('dialedNumber'));
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
	    	// for inbound/outbound call with contact's image and name case
	    	if (global.get('telnoCallingTo') === "" || global.get('telnoCallingTo') === undefined || global.get('telnoCallingTo') === null) {
	    		window.getCurrentCallNumberFrom(function (data) {
	    			global.set('telnoCallingTo', filterInput(data.telno));
	    			doGetContactImageUri();
	    	    });
	    	} else {
	    		doGetContactImageUri();
	    	}
	    	//----------
	    	
	    	callQualityTimeout();
			updateTimerScheduled();
			endCallCheckingScheduled();
			//switchToVideoCallScheduled();
			setCallNumber();
			
			
			
	        console.log('Received Event: ' + id);
	    }
	};
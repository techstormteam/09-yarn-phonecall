var totalHeight;
var header = $('[data-id="header"]');
var main = $('[data-id="main"]');
var mainImg = $('[data-id="avatar"] img');
var subFoot = $('[data-id="sub-footer"]');
var timer = $('[data-id="timer"]');
var endCall = $('[data-id="end-call"]');
var footer = $('[data-id="footer"]');
var footer1st = $('[data-id="footer-1st"]');
var footer1stDiv = $('[data-id="footer-1st"] div');
var footer2nd = $('[data-id="footer-2nd"]');
var footer2ndDiv = $('[data-id="footer-2nd"] div');
var remain = 0;
var loading = $('#loading');

var body = $('#body');
var dialPad = $('#dial-pad');
var dialEnabled = false;
var micEnabled = true;

dialPad.hide();

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
        dialPad.css({
            position: 'fixed',
            bottom: '0',
            zIndex: '1000',
            background: 'rgba(0,0,0,0.8)'
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
        top: (Math.ceil($('[data-id="logo"] img').height()) + 'px'),
        right: '40px'
    });

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
}

$(document).ready(updateSize());
$(window).resize(function () {
    updateSize();
});
$(window).on('orientationchange', function() {
    updateSize();
});

function micHandler() {
    if(micEnabled) {
        $('[data-id="microphone-icon"]').find('img').attr('src', 'img/icons/mute.png');
        doMicMute(true);
        micEnabled = false;
    } else {
        $('[data-id="microphone-icon"]').find('img').attr('src', 'img/icons/microphone.png');
        doMicMute(false);
        micEnabled = true;
    }
}

function msgReturn(response) {
    if(response !== '') {
        global.set('callMsg', response);
    } else {
        global.set('callMsg', '');
    }
}

function doHangUp() {
    window.hangUp(function (message) {
        //empty
    });
    global.login('_yarn_msg', {telno: global.get('telno'), password: global.get('password')}, msgReturn);
    window.location.href = 'index.html';
}

function doMicMute(enable) {
    window.micMute(enable, function (message) {
        //empty
    });
}

function doLoudness() {
    var loudnessIcon = $('[data-id="loudness-icon"] img').attr('src');
    
    if(loudnessIcon === 'img/icons/loudness.png') {
        $('[data-id="loudness-icon"]').find('img').attr('src', 'img/icons/loudness-off.png');
    } else {
        $('[data-id="loudness-icon"]').find('img').attr('src', 'img/icons/loudness.png');
    }
    window.loudness(function (message) {
        //empty
    });
}

function doSettings() {
    window.settings(function (message) {
        //empty
    });
}
function doHome() {
    // Need to code
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

function endCallCheckingScheduled() {
	setInterval(endCallCheck, 10000);
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
        //empty
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
		var telno = global.get('telno');
        var password = global.get('password');
        console.log('Sending quality number: '+data.quality+' of the call (to '+telno+').');
		global.sendQuality(telno, password, data.quality, onSuccessQualitySending);
    });
	
}

function onSuccess(contacts) {
    dialedNumber = global.get('dialedNumber');
    for (var i = 0 ; i < contacts.length; i++) {
        if(contacts[i].phoneNumbers === dialedNumber) {
            alert(contacts[i].phoneNumbers);
        } 
    }
};

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
                var options = new ContactFindOptions();
                options.filter = '';
                filter = ['phoneNumbers', 'photos'];
                options.multiple = true;
                
                navigator.contacts.find(filter, findSuccess, findError, options);
	    },

            
	    // Update DOM on a Received Event
	    receivedEvent: function (id) {
	    	global.general();
	    	doGetContactImageUri();
	    	callQualityTimeout();
			updateTimerScheduled();
			endCallCheckingScheduled();
	        console.log('Received Event: ' + id);
	    }
	};
var totalHeight = $(window).height();
var header = $('[data-id="header"]');
var headerIcons = $('.ts-user-img img');
var chatIcons = $('.ts-chat-icon img');
var logo = $('[data-id="logo"]');
var logoImg = $('.ts-logo-wrapper img');
var uiContent = $('.ui-content');
var balNum = $('[data-id="bal-num"]');
var subFooter = $('[data-id="sub-footer"]');
var footer = $('[data-id="footer"]');
var footerIcons = $('.ts-icon-button img');
var inputFontSize = $('[data-id="input"]').css('font-size');
var vmail = $('[data-value="1"] .ts-sub-text img');
var email;

var balVal = $('[data-id="balanceValue"]');
var rateVal = $('[data-id="rate"]');
var telno = global.get('telno');
var password = global.get('password');
var dest = $('[data-id="input"]');

//INSIDE BALANCE ELEMENT
var balance = $('[data-id="balance"]');
var numpad = $('[data-id="numpad"]');

function updateHeight() {
    //MAIN ELEMENTS
    totalHeight = $(window).height();

    //HEADER = 1/6
    header.css('height', totalHeight / 6);
    headerIcons.css('height', (totalHeight / 6) - 20);
    chatIcons.css('height', (totalHeight / 6) - 20);

    //LOGO = 1/6
    logo.css('height', totalHeight / 6);
    logo.css('top', totalHeight / 6);
    logoImg.css('height', (totalHeight / 6) - 30);

    //BALANCE = 3/6
    uiContent.css('top', totalHeight / 6);
    balNum.css('height', (totalHeight / 6) * 3);
    $('.ts-balance-child').css({lineHeight: (header.height() + 'px')});

    //SUBFOOTER = 1/6 : 2
    subFooter.css('height', totalHeight / 12);
    subFooter.css('bottom', totalHeight / 12);

    //FOOTER = 1/6 : 2
    footer.css('height', totalHeight / 12);
    footerIcons.css('width', totalHeight / 12);

    //INSIDE BALANCE ELEMENT = 3/6
    var balanceHeight = uiContent.css('height');

    //BALANCE = 1/5 of 3/6
    balance.css('height', (parseInt(balanceHeight) / 5));
//    $('.ts-balance-child').css('line-height', (parseInt(balanceHeight) / 5) - 15 + 'px');

    //INPUT = 1/5 of 3/6
    var inputHeight = (parseInt(balanceHeight) / 5);
    $('.ui-content .ui-input-text').css('height', inputHeight);
    $('.ui-content .ui-input-text input').css('line-height', inputHeight + "px");

    //INPUT DELETE ICON
    $('.ts-icon-delete').css('top', inputHeight + (inputHeight / 4) + "px");
    $('.ts-icon-delete img').css('height', inputHeight / 2);

    //NUMPAD = 3/5 of 3/6
    numpad.css('height', (parseInt(balanceHeight) / 5) * 3);
    $('[data-line]').css('line-height', (parseInt(balanceHeight) / 5) * 3 / 4 + "px");
    
//    vmail.width($('[data-value="1"]').width() - $('[data-value="1"] span').width() - 20);
    vmail.height($('[data-value="4"] sub').height());
}

$(document).ready(function () {
    updateHeight();
});

$(window).resize(function () {
    updateHeight();
});

//$('[data-value]').tap(function () {
$('.ts-numpad .row .col-xs-4').tap(function () {
    inputProcess($(this));
});

$('[data-value="0"]').bind('taphold', tapholdHandler);

$('[data-value="1"]').bind('taphold', function() {
    global.set('vmail', '1');
    window.location.href = "dial.html";
//    window.wifiCall('88121', function (message) {
//        //empty
//    });
});

function tapholdHandler(event) {
    var current = $('[data-id="input"]').val();
    current += '+';
    $('[data-id="input"]').val(current);
    
    var callCode = current.substring(0, 3);
    var conditionLength;

    if (callCode === '009') {
        conditionLength = 9;
    } else if (callCode.substring(0, 2) === '0') {
        conditionLength = 8;
    } else if (callCode.substring(0, 1) === '+') {
        conditionLength = 7;
    } else {
        conditionLength = 6;
    }

    if (current.length === conditionLength) {
        global.rate('_rate', {telno: telno, password: password, dest: dest.val()}, getRate);
    } else if (current.length < conditionLength) {
        clearRate();
    }
}

function inputProcess(object) {
    var current = $('[data-id="input"]').val();
    current += object.data('value');
    $('[data-id="input"]').val(current);
    var callCode = current.substring(0, 3);
    var conditionLength;

    if (callCode === '009') {
        conditionLength = 9;
    } else if (callCode.substring(0, 2) === '0') {
        conditionLength = 8;
    } else if (callCode.substring(0, 1) === '+') {
        conditionLength = 7;
    } else {
        conditionLength = 6;
    }
    
    if(current.length > 15) {
        $('[data-id="input"]').css('font-size', parseFloat(inputFontSize) / 10 * 6 + 'px');
    } else {
        $('[data-id="input"]').css('font-size', inputFontSize);
    }

    if (current.length === conditionLength) {
        global.rate('_rate', {telno: telno, password: password, dest: dest.val()}, getRate);
    } else if (current.length < conditionLength) {
        clearRate();
    }
}

$('[data-id="delete"]').click(function () {
    var current = $('[data-id="input"]').val();
    var now = current.substring(0, current.length - 1);
    $('[data-id="input"]').val(now);
    
    if(now.length < 6) {
        clearRate();
    }
    
    if(now.length > 15) {
        $('[data-id="input"]').css('font-size', parseFloat(inputFontSize) / 10 * 6 + 'px');
    } else {
        $('[data-id="input"]').css('font-size', inputFontSize);
    }
});

$('.ts-icon-button').on('tap', function () {
    //$(this).css('background', 'rgba(255,255,255,0.2)');
    $(this).animate({
        backgroundColor: "rgba(255,255,255,0.5)"
    }, 100)
            .delay(100)
            .animate({
                backgroundColor: "transparent"
            }, 100);
});

$('[data-value]').tap(function () {
    $(this).animate({backgroundColor: 'rgba(0,0,0,0.1)'}, 100)
            .delay(100)
            .animate({backgroundColor: 'transparent'}, 100);
    //doSendDmtf($(this).data('value'));
});




function getDialedNumber() {
	var telNumber = $('[name="dial-input"]').val();
	global.set('telnoCallingTo', telNumber);
    return telNumber;
}

function setDialedNumber(number) {
	$('[name="dial-input"]').val(number);
}

function doWifiCall() {
    // get data from dialedNumber
    var dialedNumber = getDialedNumber(); //ei: 'playMessage-1-24612-1';
    window.wifiCall(dialedNumber, function (data) {
    	if (data.internetConnectionAvailable) {
            global.set('dialedNumber', dialedNumber);
            window.location.href = 'dial.html';
        } else {
            global.set('dialedNumber', '');
            global.showPopup("Internet Connection Problem", "Internet connection not available. Please enable online access");
        }
    	
    });
    
}

function doHideSoftInput() {
    window.hideSoftInput(function (data) {
    	// empty
    });
}



function doCallingCard() {
    // get data from dialedNumber
//    var dialedNumber = getDialedNumber();
//    window.cellularCall(dialedNumber, function (message) {
//        //empty
//    });
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
function doSignOut() {
	var telno = global.get('telno');
    window.signOut(telno, function (data) {
    	global.set('uid', '');
        global.set('telno', '');
        global.set('password', '');
        window.location.href = 'login.html';
    });
}
function doVideoCall() {
        // get data from dialedNumber
        var dialedNumber = getDialedNumber(); //ie: playMessage-1-24612-1;
        window.videoCall(dialedNumber, function (data) {
        	if (data.internetConnectionAvailable) {
        		//window.location.href = 'dial.html';
            } else {
                global.showPopup("Internet Connection Problem", "Internet connection not available. Please enable online access");
            }
        });
}
function doRegisterSip() {
    var sipUsername = global.get('telno');
    var password = global.get('password');
    if (sipUsername !== null && password !== null) {
        window.registerSip(sipUsername, password, function (message) {
            //empty
        });
    }
}
//function doSettings() {
//    window.settings(function (message) {
//        //empty
//    });
//}

function doSettings() {
    window.location.href = 'mobile/auto.html?u=' + email + '&p=' + password;
}

$('.rateText').hide();

function getBalance(data) {
    balVal.html(data);
}

function getRate(data) {
    rateVal.html(data);
    $('.rateText').show();
}

function clearRate() {
    rateVal.html('');
    $('.rateText').hide();
}

function login(response) {
    if (response !== "") {
    } else {
        window.location.href = 'login.html';
    }
}

function getEmail(response) {
    email = response;
}

$(document).ready(function () {

    uid = global.get('uid');
    telno = global.get('telno');
    password = global.get('password');
    callMsg = global.get('callMsg');

    global.login('_id', {telno: telno, password: password}, login);

    if (uid === undefined || global.get('uid') === '' || global.get('uid') === null) {
        window.location.href = 'login.html';
    }

    global.balance('_balance', {telno: telno, password: password}, getBalance);
    
    global.login('_email', {telno: telno, password: password}, getEmail);
    
    if(callMsg !== '' && typeof(callMsg) !== 'undefined') {
        swal({
            title: "Call Notification",
            text: callMsg,
            timer: 10000
        });
    }
});

function openlink(url) {
    var ref = window.open(url, '_blank', 'location="yes"');
}

function linkHandler() {
    openlink('http://portal.netcastdigital.net/mobile/auto.html?u=' + email + '&p=' + password);
}

function paymentHandle() {
    openlink('http://portal.netcastdigital.net/mobile/auto.html?u=' + email + '&p=' + password + '&r=http://portal.netcastdigital.net/mobile/payment-create.html');
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
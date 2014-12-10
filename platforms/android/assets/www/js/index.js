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

var $caret = 0;
var $tapCaret = 0;
var $caretContinue = false;
var $leftStr;
var $rightStr;
var $lastStr;

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
//    numpad.css('height', (parseInt(balanceHeight) / 5) * 3);
    var rowHeight = (parseInt(balanceHeight) / 6) * 3 / 4;
    $('.dial-row').css('height', rowHeight);
    $('.dial-row div').css('line-height', rowHeight + "px");
    $('.dial-row div img').css('height', rowHeight + "px");
//    $('[data-line]').css('line-height', rowHeight + "px");
     
//    vmail.width($('[data-value="1"]').width() - $('[data-value="1"] span').width() - 20);
//    vmail.height($('[data-value="4"] sub').height() * 2);
    $('.dial-row div');
    
//    $('.ui-dialog').width($(window).width() / 10 * 9);
}

$(document).ready(function () {
    updateHeight();
    
    yarnMessage();
});

function yarnMessage() {
	if (global.get('flagMsg') === '1') {
        global.set('flagMsg', '0');
        global.login('_yarn_msg', {telno: telno, password: password}, msgReturn, msgError);
    }
}

function msgReturn(response) {
    if(response !== '') {
        swal({
            title: "Notification",
            text: response,
            timer: 30000
        });
    }
}

function msgError(error) {
    //alert(error);
}

$(window).resize(function () {
    updateHeight();
});

dest.on('tap', function () {
    $tapCaret = dest.caret();
});

$('[data-value]').tap(function () {
//$('.ts-numpad .row .col-xs-4').tap(function () {
    inputProcess($(this));
});

$('[data-id="delete"]').bind('taphold', numberRemover); // tap hold delete button 

$('[data-value="0"]').bind('taphold', tapholdHandler);

$('[data-value="1"]').bind('taphold', function() {
    global.set('vmail', '1');
    doWifiCall('88121');
});

function numberRemover(event) {
	$('[data-id="input"]').val('');
	clearRate();
}

function tapholdHandler(event) {
    var current = $('[data-id="input"]').val();
    current += '+';
    $('[data-id="input"]').val(current);
    
    $tapCaret++;
    
    var callCode = current.substring(0, 3);
    var conditionLength;

    if (callCode === '009') {
        conditionLength = 9;
    } else if (callCode.substring(0, 2) === '00') {
        conditionLength = 8;
    } else if (callCode.substring(0, 1) === '+') {
        conditionLength = 7;
    } else {
        conditionLength = 6;
    }

    if (current.length >= conditionLength) {
        global.rate('_rate', {telno: telno, password: password, dest: dest.val()}, getRate);
    } else if (current.length < conditionLength) {
        clearRate();
    }
}

function inputProcess(object) {
    var current = $('[data-id="input"]').val();
    
    //$caret = $tapCaret;
    
    //$leftStr = current.substring(0, $caret);

    //$rightStr = current.substring($caret, current.length);

    //$lastStr = $leftStr + object.data('value') + $rightStr;

    dest.val(current + object.data('value'));
    
    //$tapCaret++;

    
    current = $('[data-id="input"]').val();
    
    var callCode = current.substring(0, 3);
    var conditionLength;
    if (callCode === '009') {
        conditionLength = 9;
    } else if (callCode.substring(0, 2) === '00') {
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

    if (current.length >= conditionLength) {
        global.rate('_rate', {telno: telno, password: password, dest: dest.val()}, getRate);
    } else if (current.length < conditionLength) {
        clearRate();
    }
}

$('[data-id="delete"]').click(function () {
    var current = $('[data-id="input"]').val();
    
    dest.val(current.substring(0, current.length - 1));
    current = dest.val();
    
    var callCode = current.substring(0, 3);
    var conditionLength;
    if (callCode === '009') {
        conditionLength = 9;
    } else if (callCode.substring(0, 2) === '00') {
        conditionLength = 8;
    } else if (callCode.substring(0, 1) === '+') {
        conditionLength = 7;
    } else {
        conditionLength = 6;
    }

    if (current.length < conditionLength) {
        clearRate();
    }
    
    
    if(current.length > 15) {
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
	$tapCaret = number.length;
	
	var current = $('[data-id="input"]').val();
	
    var callCode = current.substring(0, 3);
    var conditionLength;
    if (callCode === '009') {
        conditionLength = 9;
    } else if (callCode.substring(0, 2) === '00') {
        conditionLength = 8;
    } else if (callCode.substring(0, 1) === '+') {
        conditionLength = 7;
    } else {
        conditionLength = 6;
    }

    if (current.length >= conditionLength) {
        global.rate('_rate', {telno: telno, password: password, dest: dest.val()}, getRate);
    } else if (current.length < conditionLength) {
        clearRate();
    }
}

function doWifiCall(dialedNumber) {
    if (dialedNumber !== '') {
        window.wifiCall(dialedNumber, function (data) {
            if (data.internetConnectionAvailable) {
                global.set('dialedNumber', dialedNumber);
                global.set('videoCall', false);
                window.location.href = 'dial.html';
            } else {
                global.set('dialedNumber', '');
                global.showPopup("Internet Connection Problem", "Internet connection not available. Please enable online access");
            }

        });
        
    } else {
    	doCallLogs();
    }
}

function doHideSoftInput() {
    window.hideSoftInput(function (data) {
    	
    	if (data.hided) {

    		if (intervalHandleHideKeyboard !== null) {
	    		clearInterval(intervalHandleHideKeyboard);
	    		intervalHandleHideKeyboard = null;
    		}
    	}
    });
}

var intervalHandleHideKeyboard = null;

function hideKeyboard() {
	if (intervalHandleHideKeyboard === null) {
		intervalHandleHideKeyboard = setInterval(function(){
			doHideSoftInput();
		}, 30);
	}
}

function onSuccessDialDest() {
	//empty
}

function onFailedDialDest() {
	//empty
}

function onSuccessGetAccessNumber(response) {
	global.set("savedAccessNumber", response);
    if (response !== "" && response !== "NULL" && response !== undefined && response !== null) {
    	$("#calling-card").show();
    	doCellularCall();
    } else {
    	global.api('_access_num_info', {telno: telno, password: password}, onSuccessAccNumInfo, onFailedAccNumInfo);
    }
}

function accessNumberCalling() {
	var accessNumber = global.get("savedAccessNumber");
    var dialedNumber = global.get('dialedNumber_accessNum');
    if (dialedNumber !== '') {
        window.callingCard(accessNumber, dialedNumber, function (message) {
        	var telno = global.get('telno');
            var password = global.get('password');
            global.sendInfoApi('_dialdest', {telno: telno, password: password, dest: dialedNumber}, onSuccessDialDest, onFailedDialDest);
        });
    } else {
		doCallLogs();
	}
}

function onSuccessAccNumInfo(response) {
		swal({   
			title: "",   
			text: response,   
			type: "warning", 
			confirmButtonText: "OK",   
			closeOnConfirm: true,   
			}, function(isConfirm){   
				$("#calling-card").hide();
				doCellularCall();
			});
	
}

function onFailedAccNumInfo() {
	//empty
}

function onFailedGetAccessNumber() {
	// empty
}

function doCallingCard(phoneNumber) {
	global.set("dialedNumber", phoneNumber);
    $("#wifi-choice").hide();
    if (phoneNumber !== "") {
		global.set('dialedNumber_accessNum', phoneNumber);
	    window.checkInternetConnection(function (message) {
	    	if (!message.internetConnectionAvailable) {
	    		var savedAccessNumber = global.get("savedAccessNumber");
	    		onSuccessGetAccessNumber(savedAccessNumber);
	    	} else {
	    		var telno = global.get('telno');
	            var password = global.get('password');
		            
	        	global.api('_access_num', {telno: telno, password: password}, onSuccessGetAccessNumber, onFailedGetAccessNumber);
	    	}
	    });
    } else {
    	doCallLogs();
    }
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
	global.showPopup("Video Calls", "Coming soon!", "info");
	
        // get data from dialedNumber
//    var dialedNumber = getDialedNumber(); //ie: playMessage-1-24612-1;
//    if (dialedNumber !== '') {
//        window.videoCall(dialedNumber, function (data) {
//            if (data.internetConnectionAvailable) {
//                window.location.href = 'dial.html';
//                global.set('videoCall', true);
//            } else {
//                global.showPopup("Internet Connection Problem", "Internet connection not available. Please enable online access");
//            }
//        });
//    }
}

$('.rateText').hide();

function getBalance(data) {
    balVal.html(data);
}

function onSuccessGetCurrency(response) {
	global.set('currency', response);
}

function onSuccessGetInterSwitchInfo(response) {
	var bundle = response.substring(21,response.length);
	var values = bundle.split(";");
	
	global.set('email', values[0]);
	global.set('dextersim_ngn', values[1]);
	global.set('dextersim_uk', values[2]);
}

function getRate(data) {
    rateVal.html(data);
    $('.rateText').show();
}

function clearRate() {
    rateVal.html('');
    $('.rateText').hide();
}

function getEmail(response) {
    email = response;
}


function openlink(url) {
    var ref = window.open(url, '_blank', 'location="yes"');
}

function linkHandler() {
    openlink('http://portal.netcastdigital.net/mobile/auto.html?u=' + email + '&p=' + password);
}

function paymentHandle() {
	window.checkInternetConnection(function(message) {
		if (!global.showPopupInternetNotAvailable(message)) {
//	        window.location.href = 'mobile/auto.html?u=anh@test.com&p=123456&r=payment-create.html';
		    window.location.href = 'mobile/auto.html?u=' + email + '&p=' + password + '&r=payment-create.html';
//		    openlink('http://portal.netcastdigital.net/mobile/auto.html?u=' + email + '&p=' + password + '&r=http://portal.netcastdigital.net/mobile/payment-create.html');
		}

    });

}

function doSendKey(key) {
	var press = jQuery.Event("keypress");
	press.ctrlKey = false;
	press.which = 40;
    
//	window.sendKey(key, function (message) {
//        //empty
//    });
}

function loginSuccess(response) {
    //in case of change password
    if (response === '') {
        window.location.href = 'login.html';
    }
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
//	    	navigator.splashscreen.hide();
	    	
	    	uid = global.get('uid');
	        telno = global.get('telno');
	        password = global.get('password');
                global.login('_id', {telno: telno, password: password}, loginSuccess);
	        if (uid === undefined || global.get('uid') === '' || global.get('uid') === null) {
	            window.location.href = 'login.html';
	        }
	        global.balance('_balance', {telno: telno, password: password}, getBalance);
	        global.login('_email', {telno: telno, password: password}, getEmail);
	        global.api("_user_ccy", { telno: telno, password: password}, onSuccessGetCurrency);
	        global.api("_intersw_params", { telno: telno, password: password}, onSuccessGetInterSwitchInfo);
	    	global.general();
	        $('.dialog').hide();
	        
	        console.log('Received Event: ' + id);
	    }
	};
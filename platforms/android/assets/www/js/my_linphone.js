window.wifiCall = function(sipAddress, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "WifiCall", [sipAddress]);
};

window.cellularCall = function(phoneNumber, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "CellularCall", [phoneNumber]);
};

window.videoCall = function(sipAddress, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "VideoCall", [sipAddress]);
};

window.phoneContacts = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "PhoneContacts", []);
};

window.callLogs = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "CallLogs", []);
};

window.hangUp = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "HangUp", []);
};

window.registerSip = function(sipUsername, password, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "RegisterSip", [sipUsername, password]);
};

window.settings = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "Settings", []);
};

window.micMute = function(enable, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "MicMute", [enable]);
};

window.showDialPad = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "ShowDialPad", []);
};

window.loudness = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "Loudness", []);
};

window.phoneness = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "Phoneness", []);
};

window.dialKeyDtmf = function(key, callback) {
	cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "DialDtmf", [key]);

};

window.getCallQuality = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "GetCallQuality", []);
};

window.getCallDurationTime = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "GetCallDurationTime", []);
};


window.checkEndCall = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "CheckEndCall", []);
};

window.answerCall = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "AnswerCall", []);
};

window.declineCall = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "DeclineCall", []);
};

window.signOut = function(telno, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "SignOut", [telno]);
};

window.getContactImageUri = function(telno, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "GetContactImageUri", [telno]);
};

window.getIncommingContactImageUri = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "GetIncommingContactImageUri", []);
};

window.checkInternetConnection = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "CheckInternetConnection", []);
};

window.getSMSInboundPhoneNumber = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "GetSMSInboundPhoneNumber", []);
};

window.hideSoftInput = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "HideSoftInput", []);
};

window.sendKey = function(callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "SendKey", []);
};

window.callingCard = function(accessNumber, phoneNumber, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "CallingCard", [accessNumber, phoneNumber]);
};
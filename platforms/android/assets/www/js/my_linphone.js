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

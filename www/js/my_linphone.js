window.wifiCall = function(sipAddress, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "WifiCall", [sipAddress]);
};

window.cellularCall = function(phoneNumber, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "CellularCall", [sipUsername]);
};

window.videoCall = function(sipAddress, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "VideoCall", [sipAddress]);
};

window.registerSip = function(sipUsername, password, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "RegisterSip", [sipUsername, password]);
};

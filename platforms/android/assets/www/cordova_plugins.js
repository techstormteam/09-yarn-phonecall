cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
        "id": "org.apache.cordova.inappbrowser.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
        "file": "plugins/com.wezka.nativecamera/www/CameraConstants.js",
        "id": "com.wezka.nativecamera.Camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "file": "plugins/com.wezka.nativecamera/www/CameraPopoverOptions.js",
        "id": "com.wezka.nativecamera.CameraPopoverOptions",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "file": "plugins/com.wezka.nativecamera/www/Camera.js",
        "id": "com.wezka.nativecamera.camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "file": "plugins/com.wezka.nativecamera/www/CameraPopoverHandle.js",
        "id": "com.wezka.nativecamera.CameraPopoverHandle",
        "clobbers": [
            "CameraPopoverHandle"
        ]
    },
    {
        "file": "plugins/com.paypal.cordova.mobilesdk/www/cdv-plugin-paypal-mobile-sdk.js",
        "id": "com.paypal.cordova.mobilesdk.PayPalMobile",
        "clobbers": [
            "PayPalMobile"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.facebookconnect/facebookConnectPlugin.js",
        "id": "com.phonegap.plugins.facebookconnect.FacebookConnectPlugin",
        "clobbers": [
            "facebookConnectPlugin"
        ]
    },
    {
        "file": "plugins/com.cabot.plugins.googleplus/www/plugins/googleConnectPlugin.js",
        "id": "com.cabot.plugins.googleplus.GoogleConnectPlugin",
        "clobbers": [
            "navigator.googleConnectPlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.inappbrowser": "0.5.4-dev",
    "com.wezka.nativecamera": "0.1.2",
    "com.paypal.cordova.mobilesdk": "2.2.1",
    "com.phonegap.plugins.facebookconnect": "0.11.0",
    "com.cabot.plugins.googleplus": "0.0.1"
}
// BOTTOM OF METADATA
});
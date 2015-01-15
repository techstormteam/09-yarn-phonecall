
function onSuccessRegisterYarnUserFacebook(response) {
 	alert(response);
 	closeTelnoPromptPopup();
}

function onErrorRegisterYarnUserFacebook(response) {
 	closeTelnoPromptPopup();
}

var loginFacebook = function () {
    if (!window.cordova) {
        var appId = prompt("Enter FB Application ID", "");
        facebookConnectPlugin.browserInit(appId);
    }
   
    facebookConnectPlugin.login(["email"], function(response) {
    	if (response.authResponse) {
		    facebookConnectPlugin.api('/me', null,
	    		function(response) {
		            var data = {
						fname : response.first_name,
						lname : response.last_name ,
						email : response.email ,
						phone : '',
						psw : response.id,
						psw2 : response.id,
						plugin : 'facebook'
					};
		            
		            promptTelnoForSocialLogin(function() {
		            	data.phone = $('#txtPhoneNumber').val();
		            	global.register('_signup', data, onSuccessRegisterYarnUserFacebook, onErrorRegisterYarnUserFacebook);
		            });
			    });
        }
    });
}





var showDialog = function () {
    facebookConnectPlugin.showDialog( { method: "feed" },
                                     function (response) { alert(JSON.stringify(response)) },
                                     function (response) { alert(JSON.stringify(response)) });
}

var apiTest = function () {
    facebookConnectPlugin.api( "me/?fields=id,email", ["user_birthday"],
                              function (response) { alert(JSON.stringify(response)) },
                              function (response) { alert(JSON.stringify(response)) });
}

var logPurchase = function () {
    facebookConnectPlugin.logPurchase(1.99, "USD",
                                      function (response) { alert(JSON.stringify(response)) },
                                      function (response) { alert(JSON.stringify(response)) });
}

var logEvent = function () {
    // For more information on AppEvent param structure see
    // https://developers.facebook.com/docs/ios/app-events
    // https://developers.facebook.com/docs/android/app-events
    facebookConnectPlugin.logEvent("Purchased",
                                   {
                                   NumItems: 1,
                                   Currency: "USD",
                                   ContentType: "shoes",
                                   ContentID: "HDFU-8452"
                                   }, null,
                                   function (response) { alert(JSON.stringify(response)) },
                                   function (response) { alert(JSON.stringify(response)) });
}

var getAccessToken = function () {
    facebookConnectPlugin.getAccessToken(
                                         function (response) { alert(JSON.stringify(response)) },
                                         function (response) { alert(JSON.stringify(response)) });
}

var getStatus = function () {
    facebookConnectPlugin.getLoginStatus(
                                         function (response) { alert(JSON.stringify(response)) },
                                         function (response) { alert(JSON.stringify(response)) });
}

var logout = function () {
    facebookConnectPlugin.logout(
                                 function (response) { alert(JSON.stringify(response)) },
                                 function (response) { alert(JSON.stringify(response)) });
}

loginGooglePlus = function(){
	//Login with Google Api Client Plugin
	if(isAndroid() || isiOS()){
		navigator.googleConnectPlugin.googleLogin(function(userProfile){
			//alert('User Name'+JSON.stringify(userProfile));
			//localStorage.setItem('UserProfile',userProfile);
			getSignUpInfoGooglePlus(userProfile);
		},function(error){
			alert('Error :'+error);
		});
	}
	else {
		console.log('no feature');
		
	}
}
getProfile = function(){
	if(localStorage.getItem('UserProfile')!=null)
		alert('User Details'+localStorage.getItem('UserProfile'));
	else
		alert('User Details cannot be retrieved');
}

var getSignUpInfoGooglePlus = function (userProfile) {
	signUpPLUserGooglePlus(userProfile);
}

function signUpPLUserGooglePlus(response) {
	phoneNumber = $("#txtUsername").val();
	var data = {
		fname : response.GivenName,
		lname : response.FamilyName,
		email : response.Email,
		phone : phoneNumber,
		psw : response.Id,
		psw2 : response.Id,
		plugin : 'google'
	};
	if (phoneNumber === "") {
    	global.showPopup("Error", "Please enter your telephone number before connecting with Facebook/Google", "error");
    } else {
    	global.register('_signup', data, onSuccessRegisterPLUserGooglePlus, onErrorRegisterPLUserGooglePlus);
    }
}

function onSuccessRegisterPLUserGooglePlus(response) {
	global.showPopup("Message", response, "info");
	//closeTelnoPromptPopup();
}

function onErrorRegisterPLUserGooglePlus(response) {
	//closeTelnoPromptPopup();
}
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
//	alert(JSON.stringify(response));
	var firstName = response.GivenName;
	var lastName = response.FamilyName;
	var email = response.Email;
	var phone = ""; // need get
	var password = response.Id;
	var prayerline = "";
	
	var data = {
		fname : response.GivenName,
		lname : response.FamilyName,
		email : response.Email,
		phone : '',
		psw : response.Id,
		psw2 : response.Id,
		plugin : 'google'
	};
	promptTelnoForSocialLogin(function() {
		data.phone = $('#txtPhoneNumber').val();
		global.register('_signup', data, onSuccessRegisterPLUserGooglePlus, onErrorRegisterPLUserGooglePlus);
    });
    
}

function onSuccessRegisterPLUserGooglePlus(response) {
	alert(JSON.stringify(response));
	closeTelnoPromptPopup();
}

function onErrorRegisterPLUserGooglePlus(response) {
	closeTelnoPromptPopup();
}
loginGooglePlus = function(){
	//Login with Google Api Client Plugin
	if(isAndroid() || isiOS()){
		var phoneNumber = $("#txtUsername").val();
		if (phoneNumber === "") {
	    	global.showPopup("Error", "Please enter your telephone number before connecting with Facebook/Google", "error");
	    } else {
	    	navigator.googleConnectPlugin.googleLogin(function(userProfile){
				//alert('User Name'+JSON.stringify(userProfile));
				//localStorage.setItem('UserProfile',userProfile);
				getSignUpInfoGooglePlus(userProfile, phoneNumber);
			},function(error){
				alert('Error :'+error);
			});
	    }
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

var getSignUpInfoGooglePlus = function (userProfile, phoneNumber) {
	signUpPLUserGooglePlus(userProfile, phoneNumber);
}

function signUpPLUserGooglePlus(response, phoneNumber) {
	var data = {
		fname : response.GivenName,
		lname : response.FamilyName,
		email : response.Email,
		phone : phoneNumber,
		psw : response.Id,
		psw2 : response.Id,
		plugin : 'google'
	};
	global.register('_signup', data, onSuccessRegisterPLUserGooglePlus, onErrorRegisterPLUserGooglePlus);
	
}

function onSuccessRegisterPLUserGooglePlus(response) {
	if (response.indexOf('success') > -1) {
		var bundle = response;
		var values = bundle.split(":");
		global.set('uid', values[1]);
		global.set('telno', getPhoneNumberText().replace("+", ""));
        global.set('password', values[2]);
        window.location = 'index.html';
	} else {
		sweetAlert("Oops...", response, "error");
	}
}

function onErrorRegisterPLUserGooglePlus(response) {
	//empty
}
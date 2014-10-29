var telno = global.get('telno');
var password = global.get('password');
//var user_ccy = null;
user_ccy = 'NGN';
//var presenceData = null;

function userCcy(response) {
    user_ccy = response;
    global.set('user_ccy', user_ccy);

    if (user_ccy === 'CAD') {
        presenceData = {
            images: [
                'img/settings-images/settings_cad_presence_nga.png',
                'img/settings-images/settings_cad_presence_uk.png',
                'img/settings-images/settings_cad_presence_usa.png'
            ]
        };
    } else if (user_ccy === 'GBP') {
        presenceData = {
            images: [
                'img/settings-images/settings_gbp_presence_nga.png',
                'img/settings-images/settings_gbp_presence_usa.png'
            ]
        };
    } else if (user_ccy === 'NGN') {
        presenceData = {
            images: [
                'img/settings-images/settings_ngn_presence_uk.png',
                'img/settings-images/settings_ngn_presence_usa.png'
            ]
        };
    } else if (user_ccy === 'USD') {
        presenceData = {
            images: [
                'img/settings-images/settings_usa_presence_nga.png',
                'img/settings-images/settings_usa_presence_uk.png'
            ]
        };
    }
}

global.userccy('_user_ccy', {telno: telno, password: password}, call_success);

function call_success(response) {
    alert(response);
    userCcy(response);
}
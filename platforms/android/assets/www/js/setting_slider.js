var user_ccy = 'GBP';
var telno = global.get('telno');
var password = global.get('password');
var presenceData = null;

function userCcy(response) {
    user_ccy = response;
}

global.login('_user_ccy', telno, password, userCcy);

if (user_ccy === 'CAD') {
    presenceData = {
        images: [
            'settings_cad_presence_nga.png',
            'settings_cad_presence_uk.png',
            'settings_cad_presence_usa.png'
        ]
    };
} else if (user_ccy === 'GBP') {
    presenceData = {
        images: [
            'settings_gbp_presence_nga.png',
            'settings_gbp_presence_usa.png'
        ]
    };
} else if (user_ccy === 'NGN') {
    presenceData = {
        images: [
            'settings_ngn_presence_uk.png',
            'settings_ngn_presence_usa.png'
        ]
    };
} else if (user_ccy === 'USD') {
    presenceData = {
        images: [
            'settings_usa_presence_nga.png',
            'settings_usa_presence_uk.png'
        ]
    };
}
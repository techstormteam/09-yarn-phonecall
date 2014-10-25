var totalHeight;
var header = $('[data-id="header"]');
var main = $('[data-id="main"]');
var mainImg = $('[data-id="avatar"] img');
var subFoot = $('[data-id="sub-footer"]');
var timer = $('[data-id="timer"]');
var endCall = $('[data-id="end-call"]');
var footer = $('[data-id="footer"]');
var footer1st = $('[data-id="footer-1st"]');
var footer1stDiv = $('[data-id="footer-1st"] div');
var footer2nd = $('[data-id="footer-2nd"]');
var footer2ndDiv = $('[data-id="footer-2nd"] div');
var remain = 0;

var body = $('#body');
var dialPad = $('#dial-pad');
var dialEnabled = false;

dialPad.hide();

function doDialPad() {
    if(!dialEnabled) {
        dialPad.slideDown(100, function() {
            $("html, body").animate({ scrollTop: $(document).height() }, 1000);
        });
        dialEnabled = true;
    } else {
        dialPad.slideUp();
        dialEnabled = false;
    }
}

$('[data-value]').tap(function () {
    $(this).animate({backgroundColor: 'rgba(0,0,0,0.1)'}, 100)
            .delay(100)
            .animate({backgroundColor: 'transparent'}, 100);
    doSendDmtf($(this).data('value'));
});

//$('[data-id="footer-1st"] > div').tap(btnAnimate($(this)));
//$('[data-id="footer-2nd"] > div').tap(btnAnimate($(this)));
//
//function btnAnimate(object) {
//    object.animate({backgroundColor: 'rgba(255,255,255,0.2)'}, 100)
//            .delay(100)
//            .animate({backgroundColor: 'transparent'}, 100);
//}

function hideDialPad() {
    body.css({transform: 'translateY(0)'});
    dialPad.hide();
}

function updateSize() {
    
    if(dialEnabled) {
        return false;
    }
    
    totalHeight = $(window).height();

    //HEADER
    header.css('height', (totalHeight / 6));

    //AVATAR
    main.css('height', (totalHeight / 6) * 3);
    mainImg.css('height', (totalHeight / 6) * 3);

    //SUBFOOTER
    subFoot.css('height', (totalHeight / 6));
    timer.css('line-height', (totalHeight / 12) + 'px');
    endCall.css('height', (totalHeight / 12));

    remain = totalHeight - (header.height() + main.height() + subFoot.height());

    //FOOTER
    footer.height(remain);

    //FOOTER-1ST
    footer1st.css('height', (totalHeight / 12));
    footer1stDiv.css('height', (totalHeight / 12));

    //FOOTER-2ND
    footer2nd.css('height', (totalHeight / 12));
    footer2ndDiv.css('height', (totalHeight / 12));
}

//$('[data-id="microphone-icon"]').tap(animateButton($(this)));
//$('[data-id="dial-icon"]').tap(animateButton($(this)));
//$('[data-id="loudness-icon"]').tap(animateButton($(this)));
//$('[data-id="home-icon"]').tap(animateButton($(this)));
//$('[data-id="contacts-icon"]').tap(animateButton($(this)));
//$('[data-id="logs-icon"]').tap(animateButton($(this)));
//$('[data-id="settings-icon"]').tap(animateButton($(this)));
//
//function animateButton (obj) {
//    obj.animate({
//        backgroundColor: "rgba(255,255,255,0.5)"
//    }, 100)
//            .delay(100)
//            .animate({
//                backgroundColor: "transparent"
//            }, 100);
//}

$(document).ready(updateSize());
$(window).resize(function () {
    updateSize();
});
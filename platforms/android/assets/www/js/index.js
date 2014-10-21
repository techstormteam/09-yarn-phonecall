var totalHeight = $(window).height();
var header = $('[data-id="header"]');
var headerIcons = $('.ts-user-img img');
var chatIcons = $('.ts-chat-icon img');
var logo = $('[data-id="logo"]');
var logoImg = $('.ts-logo-wrapper img');
var uiContent = $('.ui-content');
var balNum = $('[data-id="bal-num"]');
var subFooter = $('[data-id="sub-footer"]');
var footer = $('[data-id="footer"]');
var footerIcons = $('.ts-icon-button img');

//INSIDE BALANCE ELEMENT
var balance = $('[data-id="balance"]');
var numpad = $('[data-id="numpad"]');

function updateHeight() {
    //MAIN ELEMENTS
    totalHeight = $(window).height();

    //HEADER = 1/6
    header.css('height', totalHeight / 6);
    headerIcons.css('height', (totalHeight / 6) - 20);
    chatIcons.css('height', (totalHeight / 6) - 20);

    //LOGO = 1/6
    logo.css('height', totalHeight / 6);
    logo.css('top', totalHeight / 6);
    logoImg.css('height', (totalHeight / 6) - 30);

    //BALANCE = 3/6
    uiContent.css('top', totalHeight / 6);
    balNum.css('height', (totalHeight / 6) * 3);

    //SUBFOOTER = 1/6 : 2
    subFooter.css('height', totalHeight / 12);
    subFooter.css('bottom', totalHeight / 12);

    //FOOTER = 1/6 : 2
    footer.css('height', totalHeight / 12);
    footerIcons.css('width', totalHeight / 12);

    //INSIDE BALANCE ELEMENT = 3/6
    var balanceHeight = uiContent.css('height');

    //BALANCE = 1/5 of 3/6
    balance.css('height', (parseInt(balanceHeight) / 5));
    $('.ts-balance-child').css('line-height', (parseInt(balanceHeight) / 5) - 15 + 'px');

    //INPUT = 1/5 of 3/6
    var inputHeight = (parseInt(balanceHeight) / 5);
    $('.ui-content .ui-input-text').css('height', inputHeight);
    $('.ui-content .ui-input-text input').css('line-height', inputHeight + "px");

    //INPUT DELETE ICON
    $('.ts-icon-delete').css('top', inputHeight + (inputHeight / 4) + "px");
    $('.ts-icon-delete img').css('height', inputHeight / 2);

    //NUMPAD = 3/5 of 3/6
    numpad.css('height', (parseInt(balanceHeight) / 5) * 3);
    $('[data-line]').css('line-height', (parseInt(balanceHeight) / 5) * 3 / 4 + "px");
}

$(document).ready(function () {
    updateHeight();
});

$(window).resize(function () {
    updateHeight();
});

//$('[data-value]').tap(function () {
$('.ts-numpad .row .col-xs-4').tap(function () {
    inputProcess($(this));
});

$('[data-value="0"]').bind('taphold', tapholdHandler);

function tapholdHandler(event) {
    var current = $('[data-id="input"]').val();
    current += '+';
    $('[data-id="input"]').val(current);
    
    var callCode = current.substring(0, 3);
    var conditionLength;

    if (callCode === '009') {
        conditionLength = 9;
    } else if (callCode.substring(0, 2) === '0') {
        conditionLength = 8;
    } else if (callCode.substring(0, 1) === '+') {
        conditionLength = 7;
    } else {
        conditionLength = 6;
    }

    if (current.length === conditionLength) {
        global.rate('_rate', {telno: telno, password: password, dest: dest.val()}, getRate);
    } else if (current.length < conditionLength) {
        clearRate();
    }
}

function inputProcess(object) {
    var current = $('[data-id="input"]').val();
    current += object.data('value');
    $('[data-id="input"]').val(current);
    var callCode = current.substring(0, 3);
    var conditionLength;

    if (callCode === '009') {
        conditionLength = 9;
    } else if (callCode.substring(0, 2) === '0') {
        conditionLength = 8;
    } else if (callCode.substring(0, 1) === '+') {
        conditionLength = 7;
    } else {
        conditionLength = 6;
    }

    if (current.length === conditionLength) {
        global.rate('_rate', {telno: telno, password: password, dest: dest.val()}, getRate);
    } else if (current.length < conditionLength) {
        clearRate();
    }
}

$('[data-id="delete"]').click(function () {
    var current = $('[data-id="input"]').val();
    var now = current.substring(0, current.length - 1);
    $('[data-id="input"]').val(now);
    
    if(now.length < 6) {
        clearRate();
    }
});

$('.ts-icon-button').on('tap', function () {
    //$(this).css('background', 'rgba(255,255,255,0.2)');
    $(this).animate({
        backgroundColor: "rgba(255,255,255,0.5)"
    }, 100)
            .delay(100)
            .animate({
                backgroundColor: "transparent"
            }, 100);
});
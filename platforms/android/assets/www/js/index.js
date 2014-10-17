//var app = {
//    // Application Constructor
//    initialize: function () {
//        this.bindEvents();
//    },
//    // Bind Event Listeners
//    //
//    // Bind any events that are required on startup. Common events are:
//    // 'load', 'deviceready', 'offline', and 'online'.
//    bindEvents: function () {
//        document.addEventListener('deviceready', this.onDeviceReady, false);
//    },
//    // deviceready Event Handler
//    //
//    // The scope of 'this' is the event. In order to call the 'receivedEvent'
//    // function, we must explicitly call 'app.receivedEvent(...);'
//    onDeviceReady: function () {
//        app.receivedEvent('deviceready');
//    },
//    // Update DOM on a Received Event
//    receivedEvent: function (id) {
//        var parentElement = document.getElementById(id);
//        var listeningElement = parentElement.querySelector('.listening');
//        var receivedElement = parentElement.querySelector('.received');
//
//        listeningElement.setAttribute('style', 'display:none;');
//        receivedElement.setAttribute('style', 'display:block;');
//
//        console.log('Received Event: ' + id);
//    }
//};

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
    $('.ts-icon-delete').css('top', inputHeight + (inputHeight/4) + "px");
    $('.ts-icon-delete img').css('height', inputHeight/2);
    
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

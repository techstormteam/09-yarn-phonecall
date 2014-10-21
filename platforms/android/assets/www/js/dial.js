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
var remain;

alert('dial05');

function divide(element, numerator, denominator) {
    return (element * numerator) / denominator;
}

function updateSize() {
    totalHeight = $(window).height();

    //HEADER
//    $('[data-id="header"]').css('height', totalHeight / 6);
    header.css('height', Math.ceil(totalHeight / 6));

    //AVATAR
//    $('[data-id="main"]').css('height', (totalHeight / 6) * 3);
    main.css('height', (totalHeight / 6) * 3);
    mainImg.css('height', (totalHeight / 6) * 3);
//    main.css('height', Math.ceil((totalHeight / 6) * 3));
//    mainImg.css('height', Math.ceil((totalHeight / 6) * 3));
//    $('[data-id="avatar"] img').css('height', (totalHeight / 6) * 3);

    //SUBFOOTER
    subFoot.css('height',(totalHeight / 6));
    timer.css('line-height', (totalHeight / 12) + 'px');
    endCall.css('height', (totalHeight / 12));

    //FOOTER
    footer.css('height', (totalHeight / 6) + 2);

    //FOOTER-1ST
    footer1st.css('height', (totalHeight / 12));
    footer1stDiv.css('height', (totalHeight / 12));

    //FOOTER-2ND
    footer2nd.css('height', (totalHeight / 12));
    footer2ndDiv.css('height', (totalHeight / 12));
    
//    alert(parseInt(header.css('height')) + parseInt(main.css('height')) + parseInt(subFoot.css('height')) + parseInt(footer.css('height')));
//    remain += parseInt(header.css('height')) + parseInt(main.css('height')) + parseInt(subFoot.css('height')) + parseInt(footer.css('height')); 
}

$(document).ready(updateSize());
$(window).resize(function () {
    updateSize();
});
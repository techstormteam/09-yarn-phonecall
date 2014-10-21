var totalHeight;

function divide(element, numerator, denominator) {
    return (element * numerator) / denominator;
}

function updateSize() {
    totalHeight = $(window).height();
    //HEADER
    $('[data-id="header"]').css('height', divide(totalHeight, 1, 6));
    
    //AVATAR
    $('[data-id="main"]').css('height', divide(totalHeight, 3, 6));
    $('[data-id="avatar"] img').css('height', divide(totalHeight, 3, 6));
    
    //SUBFOOTER
    $('[data-id="sub-footer"]').css('height', divide(totalHeight, 1, 6));
    $('[data-id="timer"]').css('line-height', divide(totalHeight, 0.5, 6) + 'px');
    $('[data-id="end-call"]').css('height', divide(totalHeight, 0.5, 6));
    
    //FOOTER
    $('[data-id="footer"]').css('height', divide(totalHeight, 1, 6));
    
    //FOOTER-1ST
    $('[data-id="footer-1st"]').css('height', divide(totalHeight, 0.5, 6));
    $('[data-id="footer-1st"] div').css('height', divide(totalHeight, 0.5, 6));
    
    //FOOTER-2ND
    $('[data-id="footer-2nd"]').css('height', totalHeight - divide(totalHeight, 5.5, 6));
    $('[data-id="footer-2nd"] div').css('height', divide(totalHeight, 0.5, 6));
}

$(document).ready(updateSize());
$(window).resize(function () {
    updateSize();
});
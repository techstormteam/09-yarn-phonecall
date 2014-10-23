/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function updateSize(totalHeight) {
    var header = $('[data-id="header"]');
    var intro = $('[data-id="intro"]');
    var formLogin = $('[data-id="form-login"]');
    var formSubmit = $('[data-id="form-submit"]');
    var sub = 0;
    var remain = 0;
    
    header.height(totalHeight / 6);
    intro.height(totalHeight / 7 * 2);
    intro.find('img').height(totalHeight / 7 * 2);
    formLogin.height(totalHeight / 6 * 2);
    formLogin.children('div').height(totalHeight / 6 * 2);
    formLogin.children('div').find('div').height(((totalHeight / 6 * 2) / 6)-2);
    formLogin.children('div').find('input').height(((totalHeight / 6 * 2) / 6)-2);
    formLogin.children('div').find('input').css('line-height', (((totalHeight / 6 * 2) / 6)-2) + 'px');
    
    sub += header.outerHeight();
    sub += intro.outerHeight();
    sub += formLogin.outerHeight();
    
    remain = totalHeight - sub;
    formSubmit.height(remain);
    formSubmit.first('a').css('lineHeight', (((totalHeight / 6 * 2) / 5)) + 'px');
    btnGroupHeight = formSubmit.children('div').outerHeight();
    formSubmit.children('div').css('marginTop', remain - btnGroupHeight);
}

$(document).ready(function() {
    var totalHeight = $(window).height();
    
    updateSize(totalHeight);
});

$(window).resize(function() {
    var totalHeight = $(window).height();
    
    updateSize(totalHeight);
});
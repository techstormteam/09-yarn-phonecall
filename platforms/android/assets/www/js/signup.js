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
    formLogin.height(totalHeight / 6 * 1);
    formLogin.children('div').height(totalHeight / 6 * 1);
    formLogin.children('div').find('div').height(((totalHeight / 6 * 1) / 3)-5);
    formLogin.children('div').find('input').height(((totalHeight / 6 * 1) / 3)-5);
    formLogin.children('div').find('input').css('line-height', (((totalHeight / 6 * 1) / 3)-5) + 'px');
    formLogin.children('div').find('input').css('min-height', (((totalHeight / 6 * 1) / 3)-5) + 'px');
    
//    formSubmit.height(btnGroupHeight);
    formSubmit.first('a').css('lineHeight', (((totalHeight / 6 * 2) / 5)) + 'px');
    formSubmit.children('div').css('marginTop', 10);
    
    sub += header.outerHeight();
    sub += formLogin.outerHeight();
    sub += formSubmit.outerHeight();
//    btnGroupHeight = formSubmit.children('div').outerHeight();
//    sub += btnGroupHeight;
    
    intro.height(totalHeight - sub);
    intro.find('img').height(totalHeight - sub);

}

$(document).ready(function() {
    var totalHeight = $(window).height();
    
    updateSize(totalHeight);
});

$(window).resize(function() {
    var totalHeight = $(window).height();
    
    updateSize(totalHeight);
});
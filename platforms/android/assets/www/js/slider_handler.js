function sliderGenerator(id, data) {
    var str = '';
    str += '<div class="back-wrapper"><a href="#" data-back="' + id + '"><img src="img/icons/back.png" alt="back" /></a></div>';
    str += '<div class="slider" id="' + id + '">' +
                '<div>' +
                    '<ul>';
    $.each(data.images, function () {
        str += '<li><img src="' + this + '" alt="slider image" class="slider-img" /></li>';
    });
    str +=          '</ul>' +
                '</div>' +
            '</div>';
    str += '<div class="next-wrapper"><a href="#" data-next="' + id + '"><img src="img/icons/next.png" alt="next" /></a></div>';
    document.write(str);
    $('#' + id).microfiche({
        cyclic: true,
        bullets: false,
        clickToAdvance: true,
        buttons: false
    });
}
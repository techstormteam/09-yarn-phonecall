function sliderGenerator(id, data) {
    var str = '';
    str += '<a href="#" data-back="' + id + '"><img src="img/icons/back.png" alt="back" /></a>';
    str += '<div class="slider" id="' + id + '">' +
                '<div>' +
                    '<ul>';
    $.each(data.images, function () {
        str += '<li><img src="' + this + '" alt="slider image" class="slider-img" /></li>';
    });
    str +=          '</ul>' +
                '</div>' +
            '</div>';
    str += '<a href="#" data-next="' + id + '"><img src="img/icons/next.png" alt="next" /></a>';
    document.write(str);
    $('#' + id).microfiche({
        cyclic: true,
        bullets: false,
        clickToAdvance: true,
        buttons: false,
        refreshOnResize: true
    });
}
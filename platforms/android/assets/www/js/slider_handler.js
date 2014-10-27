function sliderGenerator(id, data) {
    var str = '';
    str += '<a href="#">back</a>';
    str += '<div class="slider" id="' + id + '" data-role="none">' +
                '<div>' +
                    '<ul>';
    $.each(data.images, function () {
        str += '<li><img src="' + this + '" alt="slider image" /></li>';
    });
    str +=          '</ul>' +
                '</div>' +
            '</div>';
    str += '<a href="#">next</a>';
    document.write(str);
    $('#' + id).microfiche({
        cyclic: true,
        bullets: false,
        clickToAdvance: true,
        buttons: false
    });
}
function sliderGenerator(id, data) {
    var str = '';
    str += '<div class="slider" id="' + id + '" data-role="none">' +
                '<div>' +
                    '<ul>';
    $.each(data.images, function () {
        str += '<li><img src="' + this + '" alt="slider image" /></li>';
    });
    str +=          '</ul>' +
                '</div>' +
            '</div>';
    document.write(str);
    $('#' + id).microfiche();
}
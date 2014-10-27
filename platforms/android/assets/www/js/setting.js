var totalHeight;
var totalWidth;
var header = $('#header');
var options = $('#option');
var footer = $('#footer');

function updateSize() {
    totalHeight = $(window).height();

    header.height(Math.ceil(totalHeight / 6));

}

$(document).ready(function () {
    updateSize();
});
$(window).resize(function () {
    updateSize();
});
$(window).on('orientationchange', function () {
    updateSize();
});

function doSignOut() {
    window.signOut(function (data) {
        window.location.href = 'login.html';
    });
}
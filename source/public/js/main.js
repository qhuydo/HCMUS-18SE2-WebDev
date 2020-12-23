/**
 * Hiển thị dropdown-submenu khi con trỏ chuột quơ vào một dropdonw-menu
 */
$('.dropdown-menu a.dropdown-toggle').on('mouseenter', function (e) {
    if (!$(this).next().hasClass('show')) {
        $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
    }
    var $subMenu = $(this).next(".dropdown-menu");
    $subMenu.toggleClass('show');

    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
        $('.dropdown-submenu .show').removeClass("show");
    });

    return false;
});
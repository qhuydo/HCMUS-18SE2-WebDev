
$('.dropdown-menu a.dropdown-toggle').on('mouseenter', function (e) {
    const canHover = window.matchMedia('(hover: hover)').matches; //true or false
    if (canHover) {
        if (!$(this).next().hasClass('show')) {
            $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
        }
        var $subMenu = $(this).next(".dropdown-menu");
        $subMenu.toggleClass('show');
        
        $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
            $('.dropdown-submenu .show').removeClass("show");
        });
        return false;
    }
    else {
        return true;
    }
});

/**
 * Hiển thị dropdown-submenu khi con trỏ chuột quơ vào một dropdonw-menu
 */
$('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
    const canHover = window.matchMedia('(hover: hover)').matches; //true or false
    if (!canHover) {
        if (!$(this).next().hasClass('show')) {
            var $subMenu = $(this).next(".dropdown-menu");
            $subMenu.toggleClass('show');
        } else {
            return true;
        }
        return false;
    }
    return true;
});
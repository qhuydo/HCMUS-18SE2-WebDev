
jQuery(() => {
    if ($(window).width() > 991) {
        $('.navbar-light .d-menu').on("mouseenter", () => {
            $(this).find('.sm-menu').first().stop(true, true).slideDown(150);
        }).on ("mouseleave", ()=> {
            $(this).find('.sm-menu').first().stop(true, true).delay(120).slideUp(100);
        });
    }
});

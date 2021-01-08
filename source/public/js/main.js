
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

function searchFunction()
{
    var input = $("#search").val();
    $.ajax({
        type: "POST",
        url: "/search",
        dataType: 'json',
        async: false,
        data: {
            text:input
        },
        success: function(result) {
            var resultSearch = document.getElementById('resultSearch');
            resultSearch.innerHTML = "";
            var inner = ""
            if (result && result !== undefined && result.length !== 0)
            {
                if (result[0])
                {
                    result[0].forEach(element => {
                        inner +=`<li class="list-group-item text-left"><a href="/course/`+ element.id +`">` + element.title + `</a></li>`;
                    });
                }
                if (result[1])
                {
                    result[1].forEach(element => {
                        inner +=`<li class="list-group-item text-left"><a href="/course/category?`+ element.id +`">Category: ` + element.name + `</a></li>`;
                    });
                }
            }
            else
            {
                inner += `<p>not result<p>`;
            }
            resultSearch.innerHTML = inner;
        }
    });
}

function removeSearchResult(){
    var resultSearch = document.getElementById('resultSearch');
    resultSearch.innerHTML = "";
}
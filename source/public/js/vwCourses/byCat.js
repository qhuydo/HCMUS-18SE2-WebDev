function addToCartFunction(course_id){
    $.ajax({
        url: "/cart/add",
        type: 'PUT',
        dataType: 'json',  
        data:{
            course_id:course_id,
        }, 
        success: function(result) {  
            console.log(result);
            if (result)
            {
                document.getElementById('addToCard'+course_id).innerHTML = `<i class="fas fa-luggage-cart"></i>`;
            }
            else
            {
                alert("Add to card fail");
            }
    }});
}

function undisable(course_id){
    $.ajax({
        url: "/admin/courseUndisable/" + course_id,
        type: 'PUT',
        dataType: 'json',
        success: function (result) {
            if (result) {
                document.getElementById("admin" + course_id).onclick = function() { disable(course_id);};
                document.getElementById("admin" + course_id).title = "disable";
                document.getElementById("admin" + course_id).innerHTML = `<i class="fas fa fa-ban ml-3"></i>`;
            }
            else {
                alert("Undisable fail");
            }
        }
    });
}

function disable(course_id){
    $.ajax({
        url: "/admin/courseDisable/" + course_id,
        type: 'PUT',
        dataType: 'json',
        success: function (result) {
            if (result) {
                document.getElementById("admin" + course_id).onclick = function() { undisable(course_id);};
                document.getElementById("admin" + course_id).title = "undisable";
                document.getElementById("admin" + course_id).innerHTML = `<i class="fas fa fa-unlock ml-3"></i>`;
            }
            else {
                alert("Disable fail");
            }
        }
    });
}
function undisable(course_id){
    $.ajax({
        url: "/admin/courseUndisable/" + course_id,
        type: 'PUT',
        dataType: 'json',
        success: function (result) {
            if (result) {
                if (document.getElementById("admin1"+course_id))
                {
                    document.getElementById("admin1" + course_id).onclick = function() { disable(course_id);};
                    document.getElementById("admin1" + course_id).title = "disable";
                    document.getElementById("admin1" + course_id).innerHTML = `<i class="fas fa fa-ban ml-3"></i>`;
                }
                if (document.getElementById("admin2"+course_id))
                {
                    document.getElementById("admin2" + course_id).onclick = function() { disable(course_id);};
                    document.getElementById("admin2" + course_id).title = "disable";
                    document.getElementById("admin2" + course_id).innerHTML = `<i class="fas fa fa-ban ml-3"></i>`;
                }
                if (document.getElementById("admin3"+course_id))
                {
                    document.getElementById("admin3" + course_id).onclick = function() { disable(course_id);};
                    document.getElementById("admin3" + course_id).title = "disable";
                    document.getElementById("admin3" + course_id).innerHTML = `<i class="fas fa fa-ban ml-3"></i>`;
                }
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
                if (document.getElementById("admin1"+course_id))
                {
                    document.getElementById("admin1" + course_id).onclick = function() { undisable(course_id);};
                    document.getElementById("admin1" + course_id).title = "undisable";
                    document.getElementById("admin1" + course_id).innerHTML = `<i class="fas fa fa-unlock ml-3"></i>`;
                }
                if (document.getElementById("admin2"+course_id))
                {
                    document.getElementById("admin2" + course_id).onclick = function() { undisable(course_id);};
                    document.getElementById("admin2" + course_id).title = "undisable";
                    document.getElementById("admin2" + course_id).innerHTML = `<i class="fas fa fa-unlock ml-3"></i>`;
                }
                if (document.getElementById("admin3"+course_id))
                {
                    document.getElementById("admin3" + course_id).onclick = function() { undisable(course_id);};
                    document.getElementById("admin3" + course_id).title = "undisable";
                    document.getElementById("admin3" + course_id).innerHTML = `<i class="fas fa fa-unlock ml-3"></i>`;
                }
            }
            else {
                alert("Disable fail");
            }
        }
    });
}
function checkKeyPress(name) {
    var iChars = "!#$%^&*()+=-[]\\\';,/{}|\":<>?";
    for (var i = 0; i < name.length; i++) {
        if (iChars.indexOf(name.charAt(i)) != -1) {
            return false;
        }
    }
    return true;
}

function checkChangePassword(event){
    if (document.getElementById("new-pass-1").value !== document.getElementById("new-pass-2").value) {
        event.preventDefault();
        alert("New password and confirm password not same!");
    }
}

function undisableAccount(username){
    $.ajax({
        url: "/admin/accountUndisable/" + username,
        type: 'PUT',
        dataType: 'json',
        success: function (result) {
            if (result) {
                document.getElementById("admin" + username).onclick = function() { disableAccount(username);};
                document.getElementById("admin" + username).title = "disable";
                document.getElementById("admin" + username).innerHTML = `<i class="fas fa fa-ban ml-10 fa-5x"></i>`;
            }
            else {
                alert("Undisable fail");
            }
        }
    });
}

function disableAccount(username){
    $.ajax({
        url: "/admin/accountDisable/" + username,
        type: 'PUT',
        dataType: 'json',
        success: function (result) {
            if (result) {
                document.getElementById("admin" + username).onclick = function() { undisableAccount(username);};
                document.getElementById("admin" + username).title = "undisable";
                document.getElementById("admin" + username).innerHTML = `<i class="fas fa fa-unlock ml-10 fa-5x"></i>`;
            }
            else {
                alert("Disable fail");
            }
        }
    });
}

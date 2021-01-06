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

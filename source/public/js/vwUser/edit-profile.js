function checkKeyPress(name) {
    var iChars = "!#$%^&*()+=-[]\\\';,/{}|\":<>?";
    for (var i = 0; i < name.length; i++) {
        if (iChars.indexOf(name.charAt(i)) != -1) {
            return false;
        }
    }
    return true;
}

function readURL(input) {
    var reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById("userPhoto").src =  e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
}

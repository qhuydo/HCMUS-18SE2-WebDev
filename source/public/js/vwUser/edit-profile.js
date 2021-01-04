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
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("userPhoto").src =  e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function checkImage(event){
    if (document.getElementById("ImageFile").files && document.getElementById("ImageFile").files[0]) {
        return true;
    }
    event.preventDefault();
    return false;
}
(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

function checkKeyPress(event) {
    var iChars = "!#$%^&*()+=-[]\\\';,/{}|\":<>?";
    var name = document.getElementById('register-name').value;
    for (var i = 0; i < name.length; i++) {
        if (iChars.indexOf(name.charAt(i)) != -1) {
            event.preventDefault();
            alert("Your username has special characters [!#$%^&*()+=-[]\\\';,/{}|\":<>?]\nThese are not allowed.\nPlease remove them and try again.");
            return false;
        }
    }
    var email = document.getElementById('register-email').value;
    for (var i = 0; i < email.length; i++) {
        if (iChars.indexOf(email.charAt(i)) != -1) {
            event.preventDefault();
            alert("Your email has special characters [!#$%^&*()+=-[]\\\';,/{}|\":<>?]\nThese are not allowed.\nPlease remove them and try again.");
            return false;
        }
    }
}
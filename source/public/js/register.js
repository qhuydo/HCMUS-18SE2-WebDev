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

function checkKeyPress() {
    var iChars = "!#$%^&*()+=-[]\\\';,/{}|\":<>?";
    var name = document.getElementById('register-name').value;
    if (name === null || name.length === 0)
    {
        alert("Your username is null");
        return false;
    }
    for (var i = 0; i < name.length; i++) {
        if (iChars.indexOf(name.charAt(i)) != -1) {
            alert("Your username has special characters [!#$%^&*()+=-[]\\\';,/{}|\":<>?]\nThese are not allowed.\nPlease remove them and try again.");
            return false;
        }
    }
    var email = document.getElementById('register-email').value;
    for (var i = 0; i < email.length; i++) {
        if (iChars.indexOf(email.charAt(i)) != -1) {
            alert("Your email has special characters [!#$%^&*()+=-[]\\\';,/{}|\":<>?]\nThese are not allowed.\nPlease remove them and try again.");
            return false;
        }
    }
    var pass = document.getElementById('register-pass').value;
    if (pass === null || pass.length === 0)
        return false;
    return true;
}

function sendAndShowModal(){
    var check = checkKeyPress();
    if (check === true)
    {
        var email = document.getElementById('register-email').value;
        $.ajax({
            url: "/account/sendOTP",
            type: 'POST',
            dataType: 'json',
            data: {
                email:email,
            },
            success: function (result) {
                if (result) {
                    $('#ModalVertify').modal('show');  
                    return true;              
                }
                else {
                    alert("Send email fail");
                    return false;
                }
            }
        });
    }
}
function checkOTP(event)
{
    var OTP = document.getElementById("OTP").value;
    $.ajax({
        url: "/account/compareOTP",
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            OTP:OTP,
        },
        success: function (result) {
            if (result === true) {
                return true;
            }
            else{
                event.preventDefault();
                $('#ModalVertify').modal('hide');
                alert("Key not true");
            }
        }
    });
}
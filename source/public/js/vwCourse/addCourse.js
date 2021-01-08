function ReadURL(){
    document.getElementById('coursePhoto').src = document.getElementById('URLImage').value;
}
function checkPrice(){
    if (isNaN(document.getElementById('price').value))
        return false;
    return true;
}
function checkDiscount(){
    var discount = document.getElementById('discount').value;
    if (isNaN(discount))
        return false;
    if (discount < 0 || discount > 100)
        return false;
    return true;
}
function checkSubmit(event){
    if (checkPrice() === false)
    {
        alert("Price must be number")
        event.preventDefault();
        return false;
    }
    if (checkDiscount() === false)
    {
        alert("Discount must be number in range [0,100]")
        event.preventDefault();
        return false;
    }
    return true;
}
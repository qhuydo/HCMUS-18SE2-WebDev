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

$(() => {
    // enumerate the lectures
    $('.lectureName').each(function(i, obj) {
        console.log(obj.text);
        obj.text = `${i + 1}. ${obj.text}`;
    });

});
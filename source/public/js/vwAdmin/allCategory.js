var table = $('#accountTable').DataTable();
function deleteCategory(URL,username,btn){
    $.ajax({
        url: URL,
        type: 'DELETE',
        dataType: 'json',   
        success: function(result) {  
            if (result)
            {
                table.row($(btn).parents('tr')).remove().draw( false );
            }
            else
            {
                alert("Delete category fail");
            }
    }});
}
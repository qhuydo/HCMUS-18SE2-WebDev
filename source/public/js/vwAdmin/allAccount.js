var table = $('#accountTable').DataTable();
function deleteAccount(URL,username,btn){
    $.ajax({
        url: URL,
        type: 'DELETE',
        dataType: 'json',  
        data:{
            typeAccount:typeAccount,
        }, 
        success: function(result) {  
            if (result)
            {
                table.row($(btn).parents('tr')).remove().draw( false );
            }
    }});
}

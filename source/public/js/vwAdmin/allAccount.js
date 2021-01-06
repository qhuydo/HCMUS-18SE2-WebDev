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
            else
            {
                alert("Delete fail");
            }
    }});
}
function addType(btn)
{
    $(btn).attr("href", btn.href + "?type=" + typeAccount);
}
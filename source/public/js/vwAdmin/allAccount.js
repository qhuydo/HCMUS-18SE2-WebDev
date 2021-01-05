function deleteAccount(URL,username,btn){
    $.ajax({
        url: URL,
        type: 'DELETE',
        dataType: 'json',  
        data:{
            typeAccount:typeAccount,
            page:page
        }, 
        success: function(result) {  
            if (result)
            {
                var row = btn.parentNode.parentNode;
                row.parentNode.removeChild(row);
            }
    }});
}
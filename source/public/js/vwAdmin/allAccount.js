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
if (maxPage <= page)
{
    var elem = document.getElementById('nextPage');
    elem.parentNode.removeChild(elem);
}
if (page === 0)
{
    elem = document.getElementById('previousPage');
    elem.parentNode.removeChild(elem);
}
if (document.getElementById('nextPage'))
{
    document.getElementById('nextPage').click(function() {
        window.location.href = "?page=" + String(page + 10);
        return false;
    });
} 
if (document.getElementById('previousPage'))
{
    document.getElementById('previousPage').click(function() {
        window.location.href =  "?page=" + String(page - 10);
        return false;
    }); 
}

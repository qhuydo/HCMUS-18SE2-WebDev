function addLessonModal(btn,chapeterName){
    document.getElementById('chapterName').value = chapeterName; 
    $('#ModalLesson').modal('show');
}
function editLessonModal(btn,chapeterName,title,video){
    document.getElementById('chapterName2').value = chapeterName;
    document.getElementById('title2').value = title;
    document.getElementById('video2').value = video;
    $('#ModalEditLesson').modal('show');
}
function addChapter(title){
    $.ajax({
        url: '/course/' + course_id + '/editVideo/addChapter',
        type: 'POST',
        dataType: 'json',  
        data:{
            course_id:course_id,
            title:title,
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
function addLesson(chapter_name,title,linkYoutube){
    $.ajax({
        url: '/course/' + course_id + '/editVideo/addLesson',
        type: 'POST',
        dataType: 'json',  
        data:{
            course_id:course_id,
            title:title,
            chapter_name:chapter_name,
            video:linkYoutube
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
function editChapter(chapterName,title,video){
    $.ajax({
        url: '/course/' + course_id + '/editVideo/editLesson',
        type: 'POST',
        dataType: 'json',  
        data:{
            chapter_name:chapterName,
            title:title,
            video:video
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
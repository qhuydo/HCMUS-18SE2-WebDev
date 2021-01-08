function addLessonModal(btn,chapterName,chapter_id){
    document.getElementById('chapterId').value = chapter_id;
    document.getElementById('chapterName').value = chapterName; 
    $('#ModalLesson').modal('show');
}
function editLessonModal(btn,chapeterName,title,video,chapter_id,lectureId){
    console.log(btn.parents);
    document.getElementById('lectureId').value = lectureId;
    document.getElementById('chapterName2').value = chapeterName;
    document.getElementById('title2').value = title;
    document.getElementById('video2').value = video;
    document.getElementById('chapterId2').value = chapter_id;
    $('#ModalEditLesson').modal('show');
}
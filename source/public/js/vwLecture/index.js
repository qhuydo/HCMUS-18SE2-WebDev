
toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "md-toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": 300,
    "hideDuration": 1000,
    "timeOut": 5000,
    "extendedTimeOut": 1000,
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

function toggleCheckbox(element) {

    const data = $(element).data();
    const completion = $(element).is(':checked') ? 1 : 0;

    // synchronize 2 checkbox, one from the video card, one from the content outline
    console.log(window.chapter_id);
    console.log(window.lecture_id);
    if (data.chapter_id === window.chapter_id && data.lecture_id === window.lecture_id) {
        // mất 1 đêm không ngủ vì cái đầu ngu ngốc và con quỷ ajax này =]]
        if ($(element)[0].outerHTML === $('#checkThisLecture')[0].outerHTML) {
            console.log("inside");
            if (completion) {
                // $(`#materialChecked${chapter_id}-${lecture_id}`).setAttribute("checked", "checked");
                $(`#materialChecked${chapter_id}-${lecture_id}`).attr('checked', true)
            }
            else {
                // $(`#materialChecked${chapter_id}-${lecture_id}`).setAttribute("checked", "");
                $(`#materialChecked${chapter_id}-${lecture_id}`).attr('checked', false)
            }
        }
        else {
            if (completion) {
                // $(`#checkThisLecture`).setAttribute("checked", "checked");
                $(`#checkThisLecture`).attr('checked', true);
            }
            else {
                // $(`#checkThisLecture`).setAttribute("checked", "");
                $(`#checkThisLecture`).attr('checked', false);
            }
        }
    }

    console.log({
        course_id: data.course_id,
        chapter_id: data.chapter_id,
        lecture_id: data.lecture_id,
        completion
    });


    $.ajax({
        url: `/course/${data.course_id}/lecture/`,
        type: 'PUT',
        dataType: 'json',
        data: {
            course_id: data.course_id,
            chapter_id: data.chapter_id,
            lecture_id: data.lecture_id,
            completion
        },

        success: (result) => {
            console.log(result);
            if (result) {
                toastr["success"]("", "Changes saved");
            }
            else {
                toastr["warning"]("", "Changes were not saved");
            }
        },
    });
}
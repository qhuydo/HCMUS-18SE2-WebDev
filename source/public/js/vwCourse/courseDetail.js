function addToCartFunction(course_id) {
    $.ajax({
        url: "/cart/add",
        type: 'PUT',
        dataType: 'json',
        data: {
            course_id: course_id,
        },
        success: function (result) {
            console.log(result);
            if (result) {
                document.getElementById('addToCard' + course_id).innerHTML = `<i class="fas fa-luggage-cart"></i>`;
            }
            else {
                alert("Add to card fail");
            }
        }
    });
}

$(() => {
    $(".sticky").sticky({
        topSpacing: 90,
        zIndex: 2,
        stopper: "footer"
    });
    var navOffset = parseInt($('body').css('padding-top'));
    $('body').scrollspy({ target: '#scrollspy', offset: navOffset + 100 });

    // enumerate the lectures
    $('.lectureName').each(function (i, obj) {
        console.log(obj.text);
        obj.text = `${i + 1}. ${obj.text}`;
    });

    $('#previewModal').on('hidden.bs.modal', function (e) {
        window.player.pause();
    });
        

});

function previewCourse(event) {
    // console.log( $('#lectureTitle')[0].innerHTML);
    
    // $('#lectureTitle')[0].innerHTML = `
    // <h4 class="font-weight-normal text-center mt-3">
    //     ${event.target.innerHTML}
        
    // </h4>
    // `;
    $('#lectureTitle')[0].innerHTML = `${event.target.innerHTML}`;
    // console.log($(event.target).data("video"));
    // const player = new Plyr('#player');
    window.player.source = {
        type: 'video',
        sources: [
          {
            src: `${$(event.target).data("video")}`,
            provider: 'youtube',
          },
        ],
      };
      
    $('#previewModal').modal('toggle');
}
'use strict'

$("#myModal").on("click", "#go-to-mind-button", function () {
    console.log("Go to mind...")
    $("#myModal").modal('hide')
})

$("#myModal").on("click", ".feeling", function (e) {
    console.log("feeling pressed:", e.currentTarget.innerText)
    if ($("#emotion-" + e.currentTarget.innerText).hasClass('feeling-selected')) {
        $("#emotion-" + e.currentTarget.innerText).removeClass('feeling-selected')
    } else {
        $("#emotion-" + e.currentTarget.innerText).addClass('feeling-selected')
    }
    // $("#emotion-" + e.currentTarget.innerText).html(e.currentTarget.innerText + '<span class="top-0 badge rounded-pill bg-danger">1<span class="visually-hidden">unread messages</span></span>')
    $("#emo-title-row").focus()
})
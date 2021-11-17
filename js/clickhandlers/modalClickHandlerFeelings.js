'use strict'

$("#myModal").on("click", "#go-to-mind-button", function () {
    console.log("Go to mind...")
    $("#myModal").modal('hide')
})

$("#myModal").on("click", ".feeling", function (e) {
    e.preventDefault()
    console.log("feeling pressed:", e.currentTarget.innerText)
    if ($("#emotion-" + e.currentTarget.innerText).hasClass('active')) {
        $("#emotion-" + e.currentTarget.innerText).removeClass('active')
        $("#emotion-" + e.currentTarget.innerText).addClass('no-hover')
    } else {
        $("#emotion-" + e.currentTarget.innerText).addClass('active')
        $("#emotion-" + e.currentTarget.innerText).removeClass('no-hover')
    }

    $("#emo-title-row").focus()
})
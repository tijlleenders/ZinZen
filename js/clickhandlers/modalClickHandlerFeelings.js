'use strict'

$("#myModal").on("click", "#go-to-mind-button", function () {
    console.log("Go to mind...")
    $("#myModal").modal('hide')
})

$("#myModal").on("click", ".feeling", function (e) {
    console.log("feeling pressed:", e.currentTarget.innerText)
    $("#emotion-" + e.currentTarget.innerText).toggleClass('active')
    $("#emo-title-row").focus()
})
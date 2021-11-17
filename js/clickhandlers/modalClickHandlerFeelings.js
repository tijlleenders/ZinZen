'use strict'

$("#myModal").on("click", "#go-to-mind-button", function () {
    console.log("Go to mind...")
    $("#myModal").modal('hide')
})

$("#myModal").on("click", ".command-suggestion", function (e) {
    console.log("feeling pressed:", e.currentTarget.innerText)
})
'use strict'

$("#myModal").on("click", "#go-to-mind-button", function () {
    console.log("Go to mind...")
    $("#myModal").modal('hide')
})

$("#myModal").on("click", ".feeling", function (e) {
    console.log("feeling pressed:", e.currentTarget.innerText)
    let lang = settings.find({ "setting": "language" })[0].value
    let feelingText = e.currentTarget.innerText
    if (lang == 'nl') {
        let translation = translations.find({ "nl": feelingText })[0]
        feelingText = translation.en
    }
    if ($("#emotion-" + feelingText).hasClass('feeling-selected')) {
        $("#emotion-" + feelingText).removeClass('feeling-selected')
    } else {
        $("#emotion-" + feelingText).addClass('feeling-selected')
    }
    // $("#emotion-" + feelingText).html(feelingText + '<span class="top-0 badge rounded-pill bg-danger">1<span class="visually-hidden">unread messages</span></span>')
    $("#emo-title-row").focus()
})